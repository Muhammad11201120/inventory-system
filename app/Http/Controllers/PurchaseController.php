<?php

namespace App\Http\Controllers;

use App\Models\Purchase;
use App\Models\PurchaseItem;
use App\Models\Supplier;
use App\Models\Warehouse;
use App\Models\Product;
use App\Models\StockLevel;
use App\Models\InventoryTransaction;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Services\PdfRenderer;
use Picqer\Barcode\BarcodeGeneratorSVG;

class PurchaseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $purchases = Purchase::with(['supplier', 'warehouse'])
            ->latest()->paginate(15)->withQueryString();
        return Inertia::render('purchases/index', [
            'purchases' => $purchases,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('purchases/create', [
            'suppliers' => Supplier::select('id', 'name')->get(),
            'warehouses' => Warehouse::select('id', 'name')->get(),
            'products' => Product::select('id', 'name', 'sale_price', 'cost_price')->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'invoice_number' => ['required', 'string', 'max:255', 'unique:purchases,invoice_number'],
            'supplier_id' => ['nullable', 'exists:suppliers,id'],
            'warehouse_id' => ['required', 'exists:warehouses,id'],
            'invoice_date' => ['required', 'date'],
            'discount' => ['nullable', 'numeric', 'min:0'],
            'tax' => ['nullable', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'exists:products,id'],
            'items.*.quantity' => ['required', 'numeric', 'min:0.001'],
            'items.*.unit_price' => ['required', 'numeric', 'min:0'],
        ]);

        $subtotal = collect($validated['items'])
            ->reduce(fn($c, $i) => $c + ($i['quantity'] * $i['unit_price']), 0);
        $discount = (float)($validated['discount'] ?? 0);
        $tax = (float)($validated['tax'] ?? 0);
        $total = $subtotal - $discount + $tax;

        DB::transaction(function () use ($validated, $subtotal, $discount, $tax, $total) {
            $purchase = Purchase::create([
                'invoice_number' => $validated['invoice_number'],
                'supplier_id' => $validated['supplier_id'] ?? null,
                'warehouse_id' => $validated['warehouse_id'],
                'invoice_date' => $validated['invoice_date'],
                'subtotal' => $subtotal,
                'discount' => $discount,
                'tax' => $tax,
                'total' => $total,
                'notes' => $validated['notes'] ?? null,
            ]);

            foreach ($validated['items'] as $item) {
                $lineTotal = $item['quantity'] * $item['unit_price'];
                PurchaseItem::create([
                    'purchase_id' => $purchase->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'line_total' => $lineTotal,
                ]);

                $stock = StockLevel::firstOrCreate([
                    'product_id' => $item['product_id'],
                    'warehouse_id' => $validated['warehouse_id'],
                ], ['quantity' => 0]);
                $stock->increment('quantity', $item['quantity']);

                InventoryTransaction::create([
                    'product_id' => $item['product_id'],
                    'warehouse_id' => $validated['warehouse_id'],
                    'type' => 'purchase',
                    'quantity' => $item['quantity'],
                    'unit_cost' => $item['unit_price'],
                    'reference_type' => Purchase::class,
                    'reference_id' => $purchase->id,
                    'transacted_at' => $validated['invoice_date'],
                ]);
            }
        });

        return redirect()->route('purchases.index')->with('success', 'Purchase created');
    }

    /**
     * Display the specified resource.
     */
    public function show(Purchase $purchase): Response
    {
        return Inertia::render('purchases/show', [
            'purchase' => $purchase->load(['supplier', 'warehouse', 'items.product']),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Purchase $purchase): Response
    {
        return Inertia::render('purchases/edit', [
            'purchase' => $purchase->load('items'),
            'suppliers' => Supplier::select('id', 'name')->get(),
            'warehouses' => Warehouse::select('id', 'name')->get(),
            'products' => Product::select('id', 'name', 'sale_price', 'cost_price')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Purchase $purchase): RedirectResponse
    {
        $validated = $request->validate([
            'supplier_id' => ['nullable', 'exists:suppliers,id'],
            'warehouse_id' => ['required', 'exists:warehouses,id'],
            'invoice_date' => ['required', 'date'],
            'discount' => ['nullable', 'numeric', 'min:0'],
            'tax' => ['nullable', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string'],
        ]);

        $purchase->update($validated);
        return redirect()->route('purchases.index')->with('success', 'Purchase updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Purchase $purchase): RedirectResponse
    {
        $purchase->delete();
        return redirect()->route('purchases.index')->with('success', 'Purchase deleted');
    }

    public function print(Purchase $purchase)
    {
        $purchase->load(['supplier','warehouse','items.product']);
        $barcode = (new BarcodeGeneratorSVG())->getBarcode($purchase->invoice_number, BarcodeGeneratorSVG::TYPE_CODE_128);
        try {
            $renderer = new PdfRenderer();
            return $renderer->downloadView('pdf.purchase', ['purchase' => $purchase, 'barcodeSvg' => $barcode], 'purchase-'.$purchase->invoice_number.'.pdf');
        } catch (\Throwable $e) {
            $pdf = Pdf::loadView('pdf.purchase', ['purchase' => $purchase, 'barcodeSvg' => $barcode])
                ->setPaper('a4', 'portrait')
                ->setOptions([
                    'isHtml5ParserEnabled' => true,
                    'isRemoteEnabled' => true,
                    'defaultMediaType' => 'all',
                    'defaultFont' => 'DejaVu Sans',
                    'dpi' => 96,
                ]);
            return $pdf->download('purchase-'.$purchase->invoice_number.'.pdf');
        }
    }
}
