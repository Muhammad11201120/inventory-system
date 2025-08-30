import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

export default function ProfitLoss() {
    const { props } = usePage<any>();
    const { startDate, endDate, totalRevenue, totalCosts, grossProfit, profitMargin, monthlyData, sales, purchases } = props;
    const { data, setData } = useForm({
        start_date: startDate || '',
        end_date: endDate || '',
    });

    function applyFilter(e: React.FormEvent) {
        e.preventDefault();
        router.get(route('reports.profit-loss.index'), data);
    }

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'التقارير', href: route('reports.index') },
        { title: 'الأرباح والخسائر', href: route('reports.profit-loss.index') },
    ];

    return (
        <>
        <Head title="تقرير الأرباح والخسائر" />
        <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold">تقرير الأرباح والخسائر</h1>
                <Link href={route('reports.index')} className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600">
                    العودة للتقارير
                </Link>
            </div>

            <div className="mb-6 rounded-lg bg-white p-6 shadow dark:bg-slate-800">
                <h2 className="mb-4 text-lg font-semibold">اختر الفترة</h2>
                <form onSubmit={applyFilter} className="flex flex-wrap gap-4 items-end">
                    <div className="grid gap-1">
                        <Label htmlFor="profit_start_date">تاريخ البداية</Label>
                        <input
                            id="profit_start_date"
                            type="date"
                            className="rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                            value={data.start_date}
                            onChange={(e) => setData('start_date', e.target.value)}
                        />
                    </div>
                    <div className="grid gap-1">
                        <Label htmlFor="profit_end_date">تاريخ النهاية</Label>
                        <input
                            id="profit_end_date"
                            type="date"
                            className="rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                            value={data.end_date}
                            onChange={(e) => setData('end_date', e.target.value)}
                        />
                    </div>
                    <button type="submit" className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
                        تطبيق
                    </button>
                </form>
            </div>

            {/* Summary Cards */}
            <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-4">
                <div className="rounded-lg bg-white p-6 shadow dark:bg-slate-800">
                    <div className="text-sm font-medium text-gray-600 dark:text-slate-300">إجمالي الإيرادات</div>
                    <div className="mt-2 text-3xl font-bold text-green-600">{totalRevenue?.toLocaleString()} ريال</div>
                </div>

                <div className="rounded-lg bg-white p-6 shadow dark:bg-slate-800">
                    <div className="text-sm font-medium text-gray-600 dark:text-slate-300">إجمالي التكاليف</div>
                    <div className="mt-2 text-3xl font-bold text-red-600">{totalCosts?.toLocaleString()} ريال</div>
                </div>

                <div className="rounded-lg bg-white p-6 shadow dark:bg-slate-800">
                    <div className="text-sm font-medium text-gray-600 dark:text-slate-300">إجمالي الربح</div>
                    <div className={`mt-2 text-3xl font-bold ${grossProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {grossProfit?.toLocaleString()} ريال
                    </div>
                </div>

                <div className="rounded-lg bg-white p-6 shadow dark:bg-slate-800">
                    <div className="text-sm font-medium text-gray-600 dark:text-slate-300">هامش الربح</div>
                    <div className={`mt-2 text-3xl font-bold ${profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>{profitMargin}%</div>
                </div>
            </div>

            {/* Monthly Chart */}
            <div className="mb-6 rounded-lg bg-white p-6 shadow dark:bg-slate-800">
                <h2 className="mb-4 text-lg font-semibold">التحليل الشهري</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50 dark:bg-slate-800">
                            <tr>
                                <th className="px-6 py-3 text-start text-xs font-medium tracking-wider text-gray-500 dark:text-slate-300 uppercase">الشهر</th>
                                <th className="px-6 py-3 text-start text-xs font-medium tracking-wider text-gray-500 dark:text-slate-300 uppercase">المبيعات</th>
                                <th className="px-6 py-3 text-start text-xs font-medium tracking-wider text-gray-500 dark:text-slate-300 uppercase">المشتريات</th>
                                <th className="px-6 py-3 text-start text-xs font-medium tracking-wider text-gray-500 dark:text-slate-300 uppercase">الربح/الخسارة</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white dark:divide-slate-700 dark:bg-slate-900">
                            {monthlyData?.map((month: any) => (
                                <tr key={month.month} className="hover:bg-gray-50 dark:hover:bg-slate-800">
                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900 dark:text-slate-100">{month.month}</td>
                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-green-600">{month.sales?.toLocaleString()} ريال</td>
                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-red-600">{month.purchases?.toLocaleString()} ريال</td>
                                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                                        <span className={`font-medium ${month.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {month.profit?.toLocaleString()} ريال
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detailed Tables */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Sales Table */}
                <div className="rounded-lg bg-white shadow dark:bg-slate-800">
                    <div className="border-b p-6 dark:border-slate-700">
                        <h2 className="text-lg font-semibold">تفاصيل المبيعات</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-50 dark:bg-slate-800">
                                <tr>
                                    <th className="px-6 py-3 text-start text-xs font-medium tracking-wider text-gray-500 dark:text-slate-300 uppercase">رقم الفاتورة</th>
                                    <th className="px-6 py-3 text-start text-xs font-medium tracking-wider text-gray-500 dark:text-slate-300 uppercase">التاريخ</th>
                                    <th className="px-6 py-3 text-start text-xs font-medium tracking-wider text-gray-500 dark:text-slate-300 uppercase">المبلغ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white dark:divide-slate-700 dark:bg-slate-900">
                                {sales?.slice(0, 10).map((sale: any) => (
                                    <tr key={sale.id} className="hover:bg-gray-50 dark:hover:bg-slate-800">
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900 dark:text-slate-100">{sale.invoice_number}</td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900 dark:text-slate-100">
                                            {new Date(sale.invoice_date).toLocaleDateString('ar-SA')}
                                        </td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-green-600">{sale.total?.toLocaleString()} ريال</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Purchases Table */}
                <div className="rounded-lg bg-white shadow dark:bg-slate-800">
                    <div className="border-b p-6 dark:border-slate-700">
                        <h2 className="text-lg font-semibold">تفاصيل المشتريات</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-50 dark:bg-slate-800">
                                <tr>
                                    <th className="px-6 py-3 text-start text-xs font-medium tracking-wider text-gray-500 dark:text-slate-300 uppercase">رقم الفاتورة</th>
                                    <th className="px-6 py-3 text-start text-xs font-medium tracking-wider text-gray-500 dark:text-slate-300 uppercase">التاريخ</th>
                                    <th className="px-6 py-3 text-start text-xs font-medium tracking-wider text-gray-500 dark:text-slate-300 uppercase">المبلغ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white dark:divide-slate-700 dark:bg-slate-900">
                                {purchases?.slice(0, 10).map((purchase: any) => (
                                    <tr key={purchase.id} className="hover:bg-gray-50 dark:hover:bg-slate-800">
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900 dark:text-slate-100">{purchase.invoice_number}</td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900 dark:text-slate-100">
                                            {new Date(purchase.invoice_date).toLocaleDateString('ar-SA')}
                                        </td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-red-600">{purchase.total?.toLocaleString()} ريال</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}

// Apply app layout
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(ProfitLoss as any).layout = (page: any) => {
    const crumbs: BreadcrumbItem[] = [
        { title: 'التقارير', href: route('reports.index') },
        { title: 'الأرباح والخسائر', href: route('reports.profit-loss.index') },
    ];
    return <AppLayout breadcrumbs={crumbs}>{page}</AppLayout>;
};
