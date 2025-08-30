<?php

namespace App\Http\Controllers;

use App\Models\StockCount;
use App\Models\StockCountItem;
use App\Models\Product;
use App\Models\Warehouse;
use App\Models\StockLevel;
use App\Models\InventoryTransaction;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class StockCountController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $counts = StockCount::with(['warehouse'])->latest()->paginate(15)->withQueryString();
        return Inertia::render('stock-counts/index', [
            'stockCounts' => $counts,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('stock-counts/create', [
            'warehouses' => Warehouse::select('id', 'name')->get(),
            'products' => Product::select('id','name')->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'warehouse_id' => ['required','exists:warehouses,id'],
            'count_date' => ['required','date'],
            'items' => ['required','array','min:1'],
            'items.*.product_id' => ['required','exists:products,id'],
            'items.*.counted_quantity' => ['required','numeric','min:0'],
        ]);

        DB::transaction(function () use ($validated) {
            $count = StockCount::create([
                'warehouse_id' => $validated['warehouse_id'],
                'count_date' => $validated['count_date'],
                'status' => 'completed',
                'notes' => null,
            ]);

            foreach ($validated['items'] as $item) {
                $systemQty = (float) (StockLevel::where('product_id', $item['product_id'])
                    ->where('warehouse_id', $validated['warehouse_id'])
                    ->value('quantity') ?? 0);
                $countedQty = (float) $item['counted_quantity'];
                $difference = round($countedQty - $systemQty, 3);

                StockCountItem::create([
                    'stock_count_id' => $count->id,
                    'product_id' => $item['product_id'],
                    'system_quantity' => $systemQty,
                    'counted_quantity' => $countedQty,
                    'difference' => $difference,
                ]);

                // Update stock level to counted and log transaction
                $level = StockLevel::firstOrCreate([
                    'product_id' => $item['product_id'],
                    'warehouse_id' => $validated['warehouse_id'],
                ], ['quantity' => 0]);
                $level->update(['quantity' => $countedQty]);

                InventoryTransaction::create([
                    'product_id' => $item['product_id'],
                    'warehouse_id' => $validated['warehouse_id'],
                    'type' => 'stock_count',
                    'quantity' => $difference,
                    'reference_type' => StockCount::class,
                    'reference_id' => $count->id,
                    'transacted_at' => $count->count_date,
                ]);
            }
        });

        return redirect()->route('stock-counts.index')->with('success', __('Stock count saved'));
    }

    /**
     * Display the specified resource.
     */
    public function show(StockCount $stockCount)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(StockCount $stockCount): Response
    {
        return Inertia::render('stock-counts/edit', [
            'stockCount' => $stockCount->load(['items.product','warehouse']),
            'products' => Product::select('id','name')->get(),
            'warehouses' => Warehouse::select('id','name')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, StockCount $stockCount): RedirectResponse
    {
        // Simplified: not implementing updates here
        return redirect()->route('stock-counts.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(StockCount $stockCount): RedirectResponse
    {
        $stockCount->delete();
        return redirect()->route('stock-counts.index')->with('success', __('Stock count deleted'));
    }
}
