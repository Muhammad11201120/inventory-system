import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'التعديلات', href: '/adjustments' },
    { title: 'إظافة تعديل', href: '/adjustments/create' },
];

type Option = { id: number; name: string };

export default function AdjustmentsCreate() {
    const { products, warehouses } = usePage().props as unknown as { products: Option[]; warehouses: Option[] };
    const { data, setData, post, processing, errors } = useForm({
        product_id: '',
        warehouse_id: '',
        quantity: 0,
        reason: '',
        adjusted_at: new Date().toISOString().slice(0, 16),
    });

    return (
        <>
            <Head title="تعديل جديد" />
            <div className="space-y-4 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">تعديل جديد</h1>
                    <Link href="/adjustments" className="text-blue-600">
                        الرجوع
                    </Link>
                </div>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post('/adjustments');
                    }}
                    className="max-w-xl space-y-4"
                >
                    <div className="grid gap-2">
                        <label>المنتج</label>
                        <select
                            value={data.product_id}
                            onChange={(e) => setData('product_id', e.target.value)}
                            className="rounded border p-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        >
                            <option value="">اختر...</option>
                            {products?.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name}
                                </option>
                            ))}
                        </select>
                        {errors.product_id && <p className="text-sm text-red-600">{errors.product_id}</p>}
                    </div>

                    <div className="grid gap-2">
                        <label>المخزن</label>
                        <select
                            value={data.warehouse_id}
                            onChange={(e) => setData('warehouse_id', e.target.value)}
                            className="rounded border p-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        >
                            <option value="">اختر...</option>
                            {warehouses?.map((w) => (
                                <option key={w.id} value={w.id}>
                                    {w.name}
                                </option>
                            ))}
                        </select>
                        {errors.warehouse_id && <p className="text-sm text-red-600">{errors.warehouse_id}</p>}
                    </div>

                    <div className="grid gap-2">
                        <label>الكمية (+/-)</label>
                        <input
                            type="number"
                            step="0.001"
                            value={data.quantity}
                            onChange={(e) => setData('quantity', Number(e.target.value))}
                            className="rounded border p-2"
                        />
                        {errors.quantity && <p className="text-sm text-red-600">{errors.quantity}</p>}
                    </div>

                    <div className="grid gap-2">
                        <label>السبب</label>
                        <input type="text" value={data.reason} onChange={(e) => setData('reason', e.target.value)} className="rounded border p-2" />
                    </div>

                    <div className="grid gap-2">
                        <label>التاريخ</label>
                        <input
                            type="datetime-local"
                            value={data.adjusted_at}
                            onChange={(e) => setData('adjusted_at', e.target.value)}
                            className="rounded border p-2"
                        />
                    </div>

                    <button type="submit" disabled={processing} className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50">
                        حفظ
                    </button>
                </form>
            </div>
        </>
    );
}

// Apply app layout
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(AdjustmentsCreate as any).layout = (page: any) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;
