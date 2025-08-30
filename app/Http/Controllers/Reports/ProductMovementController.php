<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\InventoryTransaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductMovementController extends Controller
{
    public function show(Request $request, Product $product): Response
    {
        $transactions = InventoryTransaction::where('product_id', $product->id)
            ->with(['warehouse', 'product'])
            ->orderBy('transacted_at', 'desc')
            ->paginate(20);

        return Inertia::render('reports/product-movement', [
            'product' => $product,
            'transactions' => $transactions,
        ]);
    }

    public function index(Request $request): Response
    {
        $products = Product::with('category')->get();
        $selectedProduct = $request->input('product_id');

        if ($selectedProduct) {
            $transactions = InventoryTransaction::where('product_id', $selectedProduct)
                ->with(['warehouse', 'product'])
                ->orderBy('transacted_at', 'desc')
                ->paginate(20);
        } else {
            $transactions = collect();
        }

        return Inertia::render('reports/product-movement-index', [
            'products' => $products,
            'selectedProduct' => $selectedProduct,
            'transactions' => $transactions,
        ]);
    }
}
