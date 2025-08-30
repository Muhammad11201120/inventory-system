<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Sale;
use App\Models\Purchase;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $productsCount = Product::count();
        // Get products with low stock
        $lowStock = Product::where('reorder_level', '>', 0)
            ->get()
            ->filter(function ($product) {
                $totalStock = $product->stockLevels->sum('quantity');
                return $totalStock <= $product->reorder_level;
            })
            ->count();

        $recentSales = Sale::latest()->limit(5)->get(['id', 'invoice_number', 'total', 'invoice_date']);
        $recentPurchases = Purchase::latest()->limit(5)->get(['id', 'invoice_number', 'total', 'invoice_date']);

        $salesSum30 = Sale::where('invoice_date', '>=', now()->subDays(30))->sum('total');
        $purchasesSum30 = Purchase::where('invoice_date', '>=', now()->subDays(30))->sum('total');
        $usersCount = User::count();

        return Inertia::render('dashboard', [
            'metrics' => [
                'productsCount' => $productsCount,
                'lowStockCount' => $lowStock,
                'sales30' => $salesSum30,
                'purchases30' => $purchasesSum30,
                'usersCount' => $usersCount,
            ],
            'recentSales' => $recentSales,
            'recentPurchases' => $recentPurchases,
        ]);
    }
}
