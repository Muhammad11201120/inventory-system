<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Customer;
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

class SaleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $sales = Sale::with(['customer', 'warehouse'])
            ->latest()->paginate(15)->withQueryString();
        return Inertia::render('sales/index', [
            'sales' => $sales,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('sales/create', [
            'customers' => Customer::select('id', 'name')->get(),
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
            'invoice_number' => ['required', 'string', 'max:255', 'unique:sales,invoice_number'],
            'customer_id' => ['nullable', 'exists:customers,id'],
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
            $sale = Sale::create([
                'invoice_number' => $validated['invoice_number'],
                'customer_id' => $validated['customer_id'] ?? null,
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
                SaleItem::create([
                    'sale_id' => $sale->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'line_total' => $lineTotal,
                ]);

                $stock = StockLevel::firstOrCreate([
                    'product_id' => $item['product_id'],
                    'warehouse_id' => $validated['warehouse_id'],
                ], ['quantity' => 0]);
                $stock->decrement('quantity', $item['quantity']);

                InventoryTransaction::create([
                    'product_id' => $item['product_id'],
                    'warehouse_id' => $validated['warehouse_id'],
                    'type' => 'sale',
                    'quantity' => $item['quantity'],
                    'unit_cost' => $item['unit_price'],
                    'reference_type' => Sale::class,
                    'reference_id' => $sale->id,
                    'transacted_at' => $validated['invoice_date'],
                ]);
            }
        });

        return redirect()->route('sales.index')->with('success', 'Sale created');
    }

    /**
     * Display the specified resource.
     */
    public function show(Sale $sale): Response
    {
        return Inertia::render('sales/show', [
            'sale' => $sale->load(['customer', 'warehouse', 'items.product']),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Sale $sale): Response
    {
        return Inertia::render('sales/edit', [
            'sale' => $sale->load('items'),
            'customers' => Customer::select('id', 'name')->get(),
            'warehouses' => Warehouse::select('id', 'name')->get(),
            'products' => Product::select('id', 'name', 'sale_price', 'cost_price')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Sale $sale): RedirectResponse
    {
        $validated = $request->validate([
            'customer_id' => ['nullable', 'exists:customers,id'],
            'warehouse_id' => ['required', 'exists:warehouses,id'],
            'invoice_date' => ['required', 'date'],
            'discount' => ['nullable', 'numeric', 'min:0'],
            'tax' => ['nullable', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string'],
        ]);
        $sale->update($validated);
        return redirect()->route('sales.index')->with('success', 'Sale updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Sale $sale): RedirectResponse
    {
        $sale->delete();
        return redirect()->route('sales.index')->with('success', 'Sale deleted');
    }

    public function print(Sale $sale)
    {
        $sale->load(['customer', 'warehouse', 'items.product']);
        $barcode = (new BarcodeGeneratorSVG())->getBarcode($sale->invoice_number, BarcodeGeneratorSVG::TYPE_CODE_128);
        try {
            $renderer = new PdfRenderer();
            return $renderer->downloadView('pdf.sale', ['sale' => $sale, 'barcodeSvg' => $barcode], 'sale-' . $sale->invoice_number . '.pdf');
        } catch (\Throwable $e) {
            $pdf = Pdf::loadView('pdf.sale', ['sale' => $sale, 'barcodeSvg' => $barcode])
                ->setPaper('a4', 'portrait')
                ->setOptions([
                    'isHtml5ParserEnabled' => true,
                    'isRemoteEnabled' => true,
                    'defaultMediaType' => 'all',
                    'defaultFont' => 'DejaVu Sans',
                    'dpi' => 96,
                ]);
            return $pdf->download('sale-' . $sale->invoice_number . '.pdf');
        }
    }
}
