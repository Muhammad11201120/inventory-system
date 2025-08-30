<?php

namespace Database\Seeders;

use App\Models\Adjustment;
use App\Models\Category;
use App\Models\Customer;
use App\Models\InventoryTransaction;
use App\Models\Notification;
use App\Models\Product;
use App\Models\Purchase;
use App\Models\PurchaseItem;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\StockCount;
use App\Models\StockCountItem;
use App\Models\StockLevel;
use App\Models\Supplier;
use App\Models\Transfer;
use App\Models\Unit;
use App\Models\Warehouse;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class InventorySeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function () {
            // Base reference data
            $units = Unit::factory()->count(6)->create();

            // Create some fixed categories with hierarchy
            $rootCategories = Category::factory()->count(5)->create();
            foreach ($rootCategories as $root) {
                Category::factory()->count(2)->create(['parent_id' => $root->id]);
            }

            // Warehouses
            $warehouses = Warehouse::factory()->count(3)->create();
            if ($warehouses->isNotEmpty()) {
                $warehouses->first()->update(['is_default' => true]);
            }

            // Business parties
            $suppliers = Supplier::factory()->count(10)->create();
            $customers = Customer::factory()->count(20)->create();

            // Products
            $products = Product::factory()->count(60)->create();

            // Initial stock levels
            foreach ($products as $product) {
                foreach ($warehouses as $warehouse) {
                    StockLevel::factory()->create([
                        'product_id' => $product->id,
                        'warehouse_id' => $warehouse->id,
                    ]);
                }
            }

            // Purchases with items
            $purchases = Purchase::factory()->count(25)->create();
            foreach ($purchases as $purchase) {
                $itemsCount = random_int(2, 6);
                for ($i = 0; $i < $itemsCount; $i++) {
                    $product = $products->random();
                    $quantity = fake()->randomFloat(3, 1, 20);
                    $unitPrice = fake()->randomFloat(2, 5, 400);
                    PurchaseItem::create([
                        'purchase_id' => $purchase->id,
                        'product_id' => $product->id,
                        'quantity' => $quantity,
                        'unit_price' => $unitPrice,
                        'line_total' => round($quantity * $unitPrice, 2),
                    ]);

                    // Stock level increment and inventory transaction
                    $level = StockLevel::firstOrCreate([
                        'product_id' => $product->id,
                        'warehouse_id' => $purchase->warehouse_id,
                    ], ['quantity' => 0]);
                    $level->increment('quantity', $quantity);

                    InventoryTransaction::create([
                        'product_id' => $product->id,
                        'warehouse_id' => $purchase->warehouse_id,
                        'type' => 'purchase',
                        'quantity' => $quantity,
                        'unit_cost' => $unitPrice,
                        'reference_type' => Purchase::class,
                        'reference_id' => $purchase->id,
                        'transacted_at' => Carbon::parse($purchase->invoice_date)->setTime(10, 0, 0),
                    ]);
                }
            }

            // Sales with items
            $sales = Sale::factory()->count(25)->create();
            foreach ($sales as $sale) {
                $itemsCount = random_int(2, 5);
                for ($i = 0; $i < $itemsCount; $i++) {
                    $product = $products->random();
                    $available = StockLevel::where('product_id', $product->id)
                        ->where('warehouse_id', $sale->warehouse_id)
                        ->value('quantity') ?? 0;
                    $quantity = min($available, max(1, fake()->randomFloat(3, 1, 10)));
                    if ($quantity <= 0) {
                        continue;
                    }
                    $unitPrice = max($product->sale_price, fake()->randomFloat(2, 10, 600));
                    SaleItem::create([
                        'sale_id' => $sale->id,
                        'product_id' => $product->id,
                        'quantity' => $quantity,
                        'unit_price' => $unitPrice,
                        'line_total' => round($quantity * $unitPrice, 2),
                    ]);

                    // Stock decrement and inventory transaction
                    $level = StockLevel::firstOrCreate([
                        'product_id' => $product->id,
                        'warehouse_id' => $sale->warehouse_id,
                    ], ['quantity' => 0]);
                    $level->decrement('quantity', $quantity);

                    InventoryTransaction::create([
                        'product_id' => $product->id,
                        'warehouse_id' => $sale->warehouse_id,
                        'type' => 'sale',
                        'quantity' => -$quantity,
                        'unit_cost' => null,
                        'reference_type' => Sale::class,
                        'reference_id' => $sale->id,
                        'transacted_at' => $sale->invoice_date . ' 12:00:00',
                    ]);
                }
            }

            // Random transfers
            Transfer::factory()->count(15)->create();

            // Random adjustments
            Adjustment::factory()->count(20)->create()->each(function ($adj) {
                // reflect on stock and transaction
                $level = StockLevel::firstOrCreate([
                    'product_id' => $adj->product_id,
                    'warehouse_id' => $adj->warehouse_id,
                ], ['quantity' => 0]);
                $level->increment('quantity', $adj->quantity);

                InventoryTransaction::create([
                    'product_id' => $adj->product_id,
                    'warehouse_id' => $adj->warehouse_id,
                    'type' => 'adjustment',
                    'quantity' => $adj->quantity,
                    'unit_cost' => null,
                    'reference_type' => Adjustment::class,
                    'reference_id' => $adj->id,
                    'transacted_at' => $adj->adjusted_at,
                ]);
            });

            // Stock counts with items
            $counts = StockCount::factory()->count(5)->create();
            foreach ($counts as $count) {
                $pickProducts = $products->random(min(10, $products->count()));
                foreach ($pickProducts as $product) {
                    $system = StockLevel::where('product_id', $product->id)
                        ->where('warehouse_id', $count->warehouse_id)
                        ->value('quantity') ?? 0;
                    $counted = max(0, round($system + fake()->randomFloat(3, -3, 3), 3));
                    StockCountItem::create([
                        'stock_count_id' => $count->id,
                        'product_id' => $product->id,
                        'system_quantity' => round($system, 3),
                        'counted_quantity' => $counted,
                        'difference' => round($counted - $system, 3),
                    ]);

                    InventoryTransaction::create([
                        'product_id' => $product->id,
                        'warehouse_id' => $count->warehouse_id,
                        'type' => 'stock_count',
                        'quantity' => round($counted - $system, 3),
                        'unit_cost' => null,
                        'reference_type' => StockCount::class,
                        'reference_id' => $count->id,
                        'transacted_at' => Carbon::parse($count->count_date)->setTime(15, 0, 0),
                    ]);

                    // Update stock level to counted
                    $level = StockLevel::firstOrCreate([
                        'product_id' => $product->id,
                        'warehouse_id' => $count->warehouse_id,
                    ], ['quantity' => 0]);
                    $level->update(['quantity' => $counted]);
                }
            }

            // Notifications
            Notification::factory()->count(15)->create();
        });
    }
}
