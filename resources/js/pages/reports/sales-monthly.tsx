import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

export default function SalesMonthly() {
    const { props } = usePage<any>();
    const sales = props.sales ?? [];
    const total = props.total ?? 0;
    const { data, setData } = useForm({ month: props.month ?? '' });

    function applyFilter(e: React.FormEvent) {
        e.preventDefault();
        router.get(route('reports.sales.monthly'), data);
    }

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'التقارير', href: route('reports.index') },
        { title: 'مبيعات شهرية', href: route('reports.sales.monthly') },
    ];

    return (
        <>
        <Head title="تقرير المبيعات الشهري" />
        <div className="p-6">
            <h1 className="mb-4 text-xl font-semibold">تقرير المبيعات الشهري</h1>
            <form onSubmit={applyFilter} className="mb-4 flex flex-wrap items-end gap-3">
                <div className="grid gap-1">
                    <Label htmlFor="report_month">الشهر</Label>
                    <input id="report_month" type="month" className="border p-2" value={data.month} onChange={(e) => setData('month', e.target.value)} />
                </div>
                <button className="rounded border px-3 py-2">تطبيق</button>
            </form>
            <table className="min-w-full border text-sm">
                <thead className="bg-gray-50 dark:bg-slate-800">
                    <tr>
                        <th className="p-2 text-start">رقم الفاتورة</th>
                        <th className="p-2 text-start">التاريخ</th>
                        <th className="p-2 text-start">الإجمالي</th>
                    </tr>
                </thead>
                <tbody>
                    {sales.map((x: any) => (
                        <tr key={x.id} className="border-t">
                            <td className="p-2">{x.invoice_number}</td>
                            <td className="p-2">{x.invoice_date}</td>
                            <td className="p-2">{x.total}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="mt-4">الإجمالي: {total}</div>
        </div>
        </>
    );
}

// Apply app layout
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(SalesMonthly as any).layout = (page: any) => {
    const crumbs: BreadcrumbItem[] = [
        { title: 'التقارير', href: route('reports.index') },
        { title: 'مبيعات شهرية', href: route('reports.sales.monthly') },
    ];
    return <AppLayout breadcrumbs={crumbs}>{page}</AppLayout>;
};
