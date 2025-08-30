<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Ensure route model params don't swallow literal paths like "/create"
Route::pattern('category', '[0-9]+');
Route::pattern('unit', '[0-9]+');
Route::pattern('product', '[0-9]+');
Route::pattern('supplier', '[0-9]+');
Route::pattern('customer', '[0-9]+');
Route::pattern('warehouse', '[0-9]+');
Route::pattern('purchase', '[0-9]+');
Route::pattern('sale', '[0-9]+');

Route::get('locale/{locale}', function (string $locale) {
    if (in_array($locale, ['ar', 'en'])) {
        session(['locale' => $locale]);
        app()->setLocale($locale);
    }
    return back();
})->name('locale.switch');

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified', 'role.readwrite'])->group(function () {
    Route::get('dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');

    // Read-only routes (index/show and GET utilities) available to all authenticated users via role.readwrite
    Route::resource('categories', \App\Http\Controllers\CategoryController::class)->only(['index', 'show']);
    Route::resource('units', \App\Http\Controllers\UnitController::class)->only(['index', 'show']);
    Route::resource('products', \App\Http\Controllers\ProductController::class)->only(['index', 'show']);
    Route::resource('suppliers', \App\Http\Controllers\SupplierController::class)->only(['index', 'show']);
    Route::resource('customers', \App\Http\Controllers\CustomerController::class)->only(['index', 'show']);
    Route::resource('warehouses', \App\Http\Controllers\WarehouseController::class)->only(['index', 'show']);
    Route::resource('purchases', \App\Http\Controllers\PurchaseController::class)->only(['index', 'show']);
    Route::get('purchases/{purchase}/print', [\App\Http\Controllers\PurchaseController::class, 'print'])->name('purchases.print');
    Route::resource('sales', \App\Http\Controllers\SaleController::class)->only(['index', 'show']);
    Route::get('sales/{sale}/print', [\App\Http\Controllers\SaleController::class, 'print'])->name('sales.print');
    Route::resource('stock-counts', \App\Http\Controllers\StockCountController::class)->only(['index']);
    Route::resource('adjustments', \App\Http\Controllers\AdjustmentController::class)->only(['index']);
    Route::resource('transfers', \App\Http\Controllers\TransferController::class)->only(['index']);
    Route::resource('users', \App\Http\Controllers\UserController::class)->only(['index']);
    Route::get('reports', [\App\Http\Controllers\ReportController::class, 'index'])->name('reports.index');
    Route::get('reports/sales/daily', [\App\Http\Controllers\Reports\SalesReportController::class, 'daily'])->name('reports.sales.daily');
    Route::get('reports/sales/monthly', [\App\Http\Controllers\Reports\SalesReportController::class, 'monthly'])->name('reports.sales.monthly');
    Route::get('reports/product-movement', [\App\Http\Controllers\Reports\ProductMovementController::class, 'index'])->name('reports.product-movement.index');
    Route::get('reports/product-movement/{product}', [\App\Http\Controllers\Reports\ProductMovementController::class, 'show'])->name('reports.product-movement.show');
    Route::get('reports/profit-loss', [\App\Http\Controllers\Reports\ProfitLossController::class, 'index'])->name('reports.profit-loss.index');

    // Admin/manage routes for write operations only
    Route::middleware('role:admin|manager')->group(function () {
        Route::resource('categories', \App\Http\Controllers\CategoryController::class)->except(['index', 'show']);
        Route::resource('units', \App\Http\Controllers\UnitController::class)->except(['index', 'show']);
        Route::resource('products', \App\Http\Controllers\ProductController::class)->except(['index', 'show']);
        Route::resource('suppliers', \App\Http\Controllers\SupplierController::class)->except(['index', 'show']);
        Route::resource('customers', \App\Http\Controllers\CustomerController::class)->except(['index', 'show']);
        Route::resource('warehouses', \App\Http\Controllers\WarehouseController::class)->except(['index', 'show']);
        Route::resource('purchases', \App\Http\Controllers\PurchaseController::class)->except(['index', 'show']);
        Route::resource('sales', \App\Http\Controllers\SaleController::class)->except(['index', 'show']);
        Route::resource('stock-counts', \App\Http\Controllers\StockCountController::class)->except(['index']);
        Route::resource('adjustments', \App\Http\Controllers\AdjustmentController::class)->except(['index']);
        Route::resource('transfers', \App\Http\Controllers\TransferController::class)->except(['index']);
        Route::resource('users', \App\Http\Controllers\UserController::class)->except(['index'])->middleware('permission:users.manage');
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
