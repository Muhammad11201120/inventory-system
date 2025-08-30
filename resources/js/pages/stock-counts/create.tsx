import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'الجرد', href: '/stock-counts' },
    { title: 'إضافة', href: '/stock-counts/create' },
];

type Option = { id: number; name: string };

export default function StockCountsCreate() {
    const { warehouses, products } = usePage().props as unknown as { warehouses: Option[]; products: Option[] };
    const { data, setData, post, processing, errors } = useForm({
        warehouse_id: '',
        count_date: new Date().toISOString().slice(0, 10),
        items: [] as { product_id: string; counted_quantity: number }[],
    });

    const addRow = () => setData('items', [...data.items, { product_id: '', counted_quantity: 0 }]);
    const removeRow = (idx: number) =>
        setData(
            'items',
            data.items.filter((_, i) => i !== idx),
        );

    return (
        <>
            <Head title="New Stock Count" />
            <div className="space-y-4 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">جرد جديد</h1>
                    <Link href="/stock-counts" className="text-blue-600">
                        الرجوع
                    </Link>
                </div>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        post('/stock-counts');
                    }}
                    className="space-y-4"
                >
                    <div className="grid max-w-xl gap-2">
                        <label>Warehouse</label>
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

                    <div className="grid max-w-xl gap-2">
                        <label>التاريخ</label>
                        <input
                            type="date"
                            value={data.count_date}
                            onChange={(e) => setData('count_date', e.target.value)}
                            className="rounded border p-2"
                        />
                        {errors.count_date && <p className="text-sm text-red-600">{errors.count_date}</p>}
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">المنتجات</h2>
                            <button type="button" onClick={addRow} className="rounded bg-slate-600 px-3 py-1.5 text-white">
                                اضافة
                            </button>
                        </div>
                        <div className="overflow-x-auto rounded border">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-100 dark:bg-slate-800">
                                    <tr>
                                        <th className="p-2 text-start">المنتج</th>
                                        <th className="p-2 text-start">الكمية المعدلة</th>
                                        <th className="p-2 text-start">الاجراءات</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.items.map((row, idx) => (
                                        <tr key={idx} className="odd:bg-white even:bg-slate-50 dark:odd:bg-slate-900 dark:even:bg-slate-800">
                                            <td className="p-2">
                                                <select
                                                    value={row.product_id}
                                                    onChange={(e) => {
                                                        const items = [...data.items];
                                                        items[idx].product_id = e.target.value;
                                                        setData('items', items);
                                                    }}
                                                    className="rounded border p-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                                >
                                                    <option value="">اختر...</option>
                                                    {products?.map((p) => (
                                                        <option key={p.id} value={p.id}>
                                                            {p.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="p-2">
                                                <input
                                                    type="number"
                                                    step="0.001"
                                                    value={row.counted_quantity}
                                                    onChange={(e) => {
                                                        const items = [...data.items];
                                                        items[idx].counted_quantity = Number(e.target.value);
                                                        setData('items', items);
                                                    }}
                                                    className="rounded border p-2"
                                                />
                                            </td>
                                            <td className="p-2">
                                                <button
                                                    type="button"
                                                    className="rounded bg-red-600 px-3 py-1.5 text-white"
                                                    onClick={() => removeRow(idx)}
                                                >
                                                    احذف
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {errors['items'] && <p className="text-sm text-red-600">{String(errors['items'])}</p>}
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
(StockCountsCreate as any).layout = (page: any) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;
