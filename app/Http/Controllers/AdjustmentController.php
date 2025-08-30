<?php

namespace App\Http\Controllers;

use App\Models\Adjustment;
use App\Models\Product;
use App\Models\Warehouse;
use App\Models\StockLevel;
use App\Models\InventoryTransaction;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AdjustmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $adjustments = Adjustment::with(['product', 'warehouse'])->latest()->paginate(15)->withQueryString();
        return Inertia::render('adjustments/index', [
            'adjustments' => $adjustments,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('adjustments/create', [
            'products' => Product::select('id', 'name')->get(),
            'warehouses' => Warehouse::select('id', 'name')->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'product_id' => ['required', 'exists:products,id'],
            'warehouse_id' => ['required', 'exists:warehouses,id'],
            'quantity' => ['required', 'numeric'],
            'reason' => ['nullable', 'string', 'max:255'],
            'adjusted_at' => ['nullable', 'date'],
        ]);

        DB::transaction(function () use ($validated) {
            $level = StockLevel::firstOrCreate([
                'product_id' => $validated['product_id'],
                'warehouse_id' => $validated['warehouse_id'],
            ], ['quantity' => 0]);

            $level->increment('quantity', $validated['quantity']);

            $adj = Adjustment::create([
                'product_id' => $validated['product_id'],
                'warehouse_id' => $validated['warehouse_id'],
                'quantity' => $validated['quantity'],
                'reason' => $validated['reason'] ?? null,
                'adjusted_at' => $validated['adjusted_at'] ?? now(),
            ]);

            InventoryTransaction::create([
                'product_id' => $validated['product_id'],
                'warehouse_id' => $validated['warehouse_id'],
                'type' => 'adjustment',
                'quantity' => $validated['quantity'],
                'reference_type' => Adjustment::class,
                'reference_id' => $adj->id,
                'transacted_at' => $adj->adjusted_at,
            ]);
        });

        return redirect()->route('adjustments.index')->with('success', __('Adjustment saved'));
    }

    /**
     * Display the specified resource.
     */
    public function show(Adjustment $adjustment)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Adjustment $adjustment): Response
    {
        return Inertia::render('adjustments/edit', [
            'adjustment' => $adjustment->load(['product', 'warehouse']),
            'products' => Product::select('id','name')->get(),
            'warehouses' => Warehouse::select('id','name')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Adjustment $adjustment): RedirectResponse
    {
        // Simplify for now: disallow editing existing adjustments
        return redirect()->route('adjustments.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Adjustment $adjustment): RedirectResponse
    {
        $adjustment->delete();
        return redirect()->route('adjustments.index')->with('success', __('Adjustment deleted'));
    }
}
