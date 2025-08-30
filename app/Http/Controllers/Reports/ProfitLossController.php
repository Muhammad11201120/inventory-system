<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
use App\Models\Sale;
use App\Models\Purchase;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;

class ProfitLossController extends Controller
{
    public function index(Request $request): Response
    {
        $startDate = $request->input('start_date', now()->startOfMonth()->toDateString());
        $endDate = $request->input('end_date', now()->endOfMonth()->toDateString());

        // Calculate sales revenue
        $sales = Sale::whereBetween('invoice_date', [$startDate, $endDate])->get();
        $totalRevenue = $sales->sum('total');

        // Calculate purchase costs
        $purchases = Purchase::whereBetween('invoice_date', [$startDate, $endDate])->get();
        $totalCosts = $purchases->sum('total');

        // Calculate profit/loss
        $grossProfit = $totalRevenue - $totalCosts;
        $profitMargin = $totalRevenue > 0 ? ($grossProfit / $totalRevenue) * 100 : 0;

        // Monthly breakdown for chart
        $monthlyData = collect();
        $currentDate = Carbon::parse($startDate);
        $endDateObj = Carbon::parse($endDate);

        while ($currentDate <= $endDateObj) {
            $monthStart = $currentDate->copy()->startOfMonth();
            $monthEnd = $currentDate->copy()->endOfMonth();

            $monthSales = Sale::whereBetween('invoice_date', [$monthStart, $monthEnd])->sum('total');
            $monthPurchases = Purchase::whereBetween('invoice_date', [$monthStart, $monthEnd])->sum('total');
            $monthProfit = $monthSales - $monthPurchases;

            $monthlyData->push([
                'month' => $currentDate->format('Y-m'),
                'sales' => $monthSales,
                'purchases' => $monthPurchases,
                'profit' => $monthProfit,
            ]);

            $currentDate->addMonth();
        }

        return Inertia::render('reports/profit-loss', [
            'startDate' => $startDate,
            'endDate' => $endDate,
            'totalRevenue' => $totalRevenue,
            'totalCosts' => $totalCosts,
            'grossProfit' => $grossProfit,
            'profitMargin' => round($profitMargin, 2),
            'monthlyData' => $monthlyData,
            'sales' => $sales,
            'purchases' => $purchases,
        ]);
    }
}
