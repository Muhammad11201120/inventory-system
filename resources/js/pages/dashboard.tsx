import EChart from '@/components/charts/echart';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { AlertTriangle, Package, ShoppingCart, TrendingUp, Users as UsersIcon } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'لوحة التحكم',
        href: '/dashboard',
    },
];

type DashboardMetricProps = {
    productsCount: number;
    lowStockCount: number;
    sales30: number | string;
    purchases30: number | string;
    usersCount: number;
};

type RecentSale = { id: number; invoice_number: string; invoice_date: string | Date; total: number | string };
type RecentPurchase = { id: number; invoice_number: string; invoice_date: string | Date; total: number | string };

export default function Dashboard() {
    const { metrics, recentSales, recentPurchases } = usePage().props as unknown as {
        metrics?: Partial<DashboardMetricProps>;
        recentSales?: RecentSale[];
        recentPurchases?: RecentPurchase[];
    };

    const salesVsPurchasesOption = {
        color: ['#22c55e', '#3b82f6'] as string[],
        tooltip: { trigger: 'axis' as const },
        legend: { data: ['المبيعات', 'المشتريات'] as string[] },
        xAxis: {
            type: 'category' as const,
            data: ['الأسبوع 1', 'الأسبوع 2', 'الأسبوع 3', 'الأسبوع 4'] as string[],
            axisLine: { lineStyle: { color: '#94a3b8' } },
        },
        yAxis: {
            type: 'value' as const,
            axisLine: { show: false },
            splitLine: { lineStyle: { color: '#e2e8f0' } },
        },
        series: [
            {
                name: 'المبيعات',
                type: 'line' as const,
                smooth: true,
                areaStyle: {},
                data: [
                    Number(metrics?.sales30 ?? 0) * 0.15,
                    Number(metrics?.sales30 ?? 0) * 0.35,
                    Number(metrics?.sales30 ?? 0) * 0.25,
                    Number(metrics?.sales30 ?? 0) * 0.25,
                ],
            },
            {
                name: 'المشتريات',
                type: 'line' as const,
                smooth: true,
                areaStyle: {},
                data: [
                    Number(metrics?.purchases30 ?? 0) * 0.2,
                    Number(metrics?.purchases30 ?? 0) * 0.3,
                    Number(metrics?.purchases30 ?? 0) * 0.3,
                    Number(metrics?.purchases30 ?? 0) * 0.2,
                ],
            },
        ],
    };

    const lowStockDonutOption = {
        color: ['#f97316', '#94a3b8'] as string[],
        tooltip: { trigger: 'item' as const },
        legend: { bottom: 0 },
        series: [
            {
                name: 'المخزون',
                type: 'pie' as const,
                radius: ['50%', '70%'] as [string, string],
                avoidLabelOverlap: false,
                itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
                label: { show: false, position: 'center' as const },
                emphasis: { label: { show: true, fontSize: 18, fontWeight: 700 } },
                labelLine: { show: false },
                data: [
                    { value: Number(metrics?.lowStockCount ?? 0), name: 'منخفض' },
                    { value: Math.max(1, Number(metrics?.productsCount ?? 0) - Number(metrics?.lowStockCount ?? 0)), name: 'جيد' },
                ],
            },
        ],
    };

    return (
        <>
            <Head title="لوحة التحكم" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
                {/* بطاقات الإحصائيات */}
                <div className="grid auto-rows-min gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-0 bg-white shadow-sm transition-all duration-300 hover:shadow-lg dark:bg-slate-800">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">إجمالي المنتجات</CardTitle>
                            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900">
                                <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">{metrics?.productsCount || 0}</div>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">منتج متاح</p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 bg-white shadow-sm transition-all duration-300 hover:shadow-lg dark:bg-slate-800">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">المنتجات منخفضة المخزون</CardTitle>
                            <div className="rounded-lg bg-orange-100 p-2 dark:bg-orange-900">
                                <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{metrics?.lowStockCount || 0}</div>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">تحتاج إعادة طلب</p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 bg-white shadow-sm transition-all duration-300 hover:shadow-lg dark:bg-slate-800">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">المبيعات (30 يوم)</CardTitle>
                            <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900">
                                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                                ${metrics?.sales30 ? Number(metrics.sales30).toLocaleString() : '0'}
                            </div>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">إجمالي المبيعات</p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 bg-white shadow-sm transition-all duration-300 hover:shadow-lg dark:bg-slate-800">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">المشتريات (30 يوم)</CardTitle>
                            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900">
                                <ShoppingCart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                ${metrics?.purchases30 ? Number(metrics.purchases30).toLocaleString() : '0'}
                            </div>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">إجمالي المشتريات</p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 bg-white shadow-sm transition-all duration-300 hover:shadow-lg dark:bg-slate-800">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">المستخدمون</CardTitle>
                            <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900">
                                <UsersIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">{metrics?.usersCount ?? 0}</div>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">إجمالي المستخدمين</p>
                        </CardContent>
                    </Card>
                </div>

                {/* مخططات */}
                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="border-0 bg-white shadow-sm transition-all duration-300 hover:shadow-lg dark:bg-slate-800">
                        <CardHeader className="border-b border-slate-200 dark:border-slate-700">
                            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">المبيعات مقابل المشتريات</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <EChart option={salesVsPurchasesOption} height={320} />
                        </CardContent>
                    </Card>
                    <Card className="border-0 bg-white shadow-sm transition-all duration-300 hover:shadow-lg dark:bg-slate-800">
                        <CardHeader className="border-b border-slate-200 dark:border-slate-700">
                            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">حالة المخزون</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <EChart option={lowStockDonutOption} height={320} />
                        </CardContent>
                    </Card>
                </div>

                {/* النشاط الأخير */}
                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="border-0 bg-white shadow-sm transition-all duration-300 hover:shadow-lg dark:bg-slate-800">
                        <CardHeader className="border-b border-slate-200 dark:border-slate-700">
                            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">المبيعات الأخيرة</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                            {recentSales && recentSales.length > 0 ? (
                                <div className="space-y-4">
                                    {recentSales.map((sale: RecentSale) => (
                                        <div
                                            key={sale.id}
                                            className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700"
                                        >
                                            <div>
                                                <div className="font-medium text-slate-900 dark:text-slate-100">#{sale.invoice_number}</div>
                                                <div className="text-sm text-slate-500 dark:text-slate-400">
                                                    {new Date(sale.invoice_date).toLocaleDateString('ar-SA')}
                                                </div>
                                            </div>
                                            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                ${Number(sale.total).toLocaleString()}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 text-center text-slate-500 dark:text-slate-400">
                                    <ShoppingCart className="mx-auto mb-3 h-12 w-12 text-slate-300 dark:text-slate-600" />
                                    <p>لا توجد مبيعات حديثة</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="border-0 bg-white shadow-sm transition-all duration-300 hover:shadow-lg dark:bg-slate-800">
                        <CardHeader className="border-b border-slate-200 dark:border-slate-700">
                            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">المشتريات الأخيرة</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                            {recentPurchases && recentPurchases.length > 0 ? (
                                <div className="space-y-4">
                                    {recentPurchases.map((purchase: RecentPurchase) => (
                                        <div
                                            key={purchase.id}
                                            className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700"
                                        >
                                            <div>
                                                <div className="font-medium text-slate-900 dark:text-slate-100">#{purchase.invoice_number}</div>
                                                <div className="text-sm text-slate-500 dark:text-slate-400">
                                                    {new Date(purchase.invoice_date).toLocaleDateString('ar-SA')}
                                                </div>
                                            </div>
                                            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                ${Number(purchase.total).toLocaleString()}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 text-center text-slate-500 dark:text-slate-400">
                                    <Package className="mx-auto mb-3 h-12 w-12 text-slate-300 dark:text-slate-600" />
                                    <p>لا توجد مشتريات حديثة</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

// Assign layout once to avoid double rendering
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(Dashboard as any).layout = (page: any) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;
