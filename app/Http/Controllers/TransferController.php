<?php

namespace App\Http\Controllers;

use App\Models\Transfer;
use App\Models\Product;
use App\Models\Warehouse;
use App\Models\StockLevel;
use App\Models\InventoryTransaction;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class TransferController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $transfers = Transfer::with(['product', 'fromWarehouse', 'toWarehouse'])
            ->latest()->paginate(15)->withQueryString();
        return Inertia::render('transfers/index', [
            'transfers' => $transfers,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('transfers/create', [
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
            'from_warehouse_id' => ['required', 'different:to_warehouse_id', 'exists:warehouses,id'],
            'to_warehouse_id' => ['required', 'exists:warehouses,id'],
            'quantity' => ['required', 'numeric', 'min:0.001'],
            'transferred_at' => ['nullable', 'date'],
        ]);

        DB::transaction(function () use ($validated) {
            // Ensure stock available in from warehouse
            $fromLevel = StockLevel::firstOrCreate([
                'product_id' => $validated['product_id'],
                'warehouse_id' => $validated['from_warehouse_id'],
            ], ['quantity' => 0]);

            abort_if($fromLevel->quantity < $validated['quantity'], 422, __('Not enough stock in source warehouse.'));

            // Decrement from source
            $fromLevel->decrement('quantity', $validated['quantity']);

            // Increment destination
            $toLevel = StockLevel::firstOrCreate([
                'product_id' => $validated['product_id'],
                'warehouse_id' => $validated['to_warehouse_id'],
            ], ['quantity' => 0]);
            $toLevel->increment('quantity', $validated['quantity']);

            $transfer = Transfer::create([
                'product_id' => $validated['product_id'],
                'from_warehouse_id' => $validated['from_warehouse_id'],
                'to_warehouse_id' => $validated['to_warehouse_id'],
                'quantity' => $validated['quantity'],
                'transferred_at' => $validated['transferred_at'] ?? now(),
            ]);

            // Inventory transactions
            InventoryTransaction::create([
                'product_id' => $validated['product_id'],
                'warehouse_id' => $validated['from_warehouse_id'],
                'type' => 'transfer_out',
                'quantity' => -$validated['quantity'],
                'reference_type' => Transfer::class,
                'reference_id' => $transfer->id,
                'transacted_at' => $transfer->transferred_at,
            ]);
            InventoryTransaction::create([
                'product_id' => $validated['product_id'],
                'warehouse_id' => $validated['to_warehouse_id'],
                'type' => 'transfer_in',
                'quantity' => $validated['quantity'],
                'reference_type' => Transfer::class,
                'reference_id' => $transfer->id,
                'transacted_at' => $transfer->transferred_at,
            ]);
        });

        return redirect()->route('transfers.index')->with('success', __('Transfer completed'));
    }

    /**
     * Display the specified resource.
     */
    public function show(Transfer $transfer)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Transfer $transfer): Response
    {
        return Inertia::render('transfers/edit', [
            'transfer' => $transfer->load(['product', 'fromWarehouse', 'toWarehouse']),
            'products' => Product::select('id','name')->get(),
            'warehouses' => Warehouse::select('id','name')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Transfer $transfer): RedirectResponse
    {
        // For simplicity, disallow editing finalized transfers in this version
        return redirect()->route('transfers.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Transfer $transfer): RedirectResponse
    {
        // Optionally implement reversal; skipping for now
        $transfer->delete();
        return redirect()->route('transfers.index')->with('success', __('Transfer deleted'));
    }
}
