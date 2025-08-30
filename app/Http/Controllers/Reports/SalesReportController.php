<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
use App\Models\Sale;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SalesReportController extends Controller
{
    public function daily(Request $request): Response
    {
        $date = $request->input('date', now()->toDateString());
        $sales = Sale::where('invoice_date', $date)->with('items.product')->get();
        $total = $sales->sum('total');
        return Inertia::render('reports/sales-daily', [
            'date' => $date,
            'sales' => $sales,
            'total' => $total,
        ]);
    }

    public function monthly(Request $request): Response
    {
        $month = $request->input('month', now()->format('Y-m'));
        $sales = Sale::whereRaw('DATE_FORMAT(invoice_date, "%Y-%m") = ?', [$month])->get();
        $total = $sales->sum('total');
        return Inertia::render('reports/sales-monthly', [
            'month' => $month,
            'sales' => $sales,
            'total' => $total,
        ]);
    }
}
