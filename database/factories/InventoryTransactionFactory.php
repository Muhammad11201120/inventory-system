<?php

namespace Database\Factories;

use App\Models\InventoryTransaction;
use App\Models\Product;
use App\Models\Warehouse;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<InventoryTransaction>
 */
class InventoryTransactionFactory extends Factory
{
    protected $model = InventoryTransaction::class;

    public function definition(): array
    {
        $type = $this->faker->randomElement(['purchase', 'sale', 'transfer_in', 'transfer_out', 'adjustment', 'stock_count']);
        return [
            'product_id' => Product::query()->inRandomOrder()->value('id'),
            'warehouse_id' => Warehouse::query()->inRandomOrder()->value('id'),
            'type' => $type,
            'quantity' => $this->faker->randomFloat(3, 1, 50) * ($type === 'sale' || $type === 'transfer_out' ? -1 : 1),
            'unit_cost' => $this->faker->optional()->randomFloat(2, 1, 500),
            'reference_type' => null,
            'reference_id' => null,
            'transacted_at' => $this->faker->dateTimeBetween('-6 months', 'now'),
        ];
    }
}


