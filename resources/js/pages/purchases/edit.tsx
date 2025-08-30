import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

type PurchaseItem = { id?: number; product_id: string | number; quantity: number; unit_price: number };
type Purchase = {
    id: number;
    invoice_number: string;
    supplier_id?: number | null;
    warehouse_id: number;
    invoice_date: string;
    discount?: number | null;
    tax?: number | null;
    notes?: string | null;
    items: PurchaseItem[];
};

export default function PurchaseEdit() {
    const { props } = usePage<{ purchase: Purchase; suppliers: any[]; warehouses: any[]; products: any[] }>();
    const { purchase, suppliers = [], warehouses = [], products = [] } = props;

    const { data, setData, put, processing } = useForm({
        supplier_id: purchase.supplier_id ?? '',
        warehouse_id: purchase.warehouse_id ?? '',
        invoice_date: purchase.invoice_date ?? '',
        discount: purchase.discount ?? 0,
        tax: purchase.tax ?? 0,
        notes: purchase.notes ?? '',
        items: (purchase.items ?? []).map((it) => ({
            id: it.id,
            product_id: it.product_id ?? '',
            quantity: it.quantity ?? 1,
            unit_price: it.unit_price ?? 0,
        })),
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        put(route('purchases.update', purchase.id));
    }

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'المشتريات', href: route('purchases.index') },
        { title: `تعديل #${purchase.invoice_number}`, href: route('purchases.edit', purchase.id) },
    ];

    return (
        <>
            <Head title={`تعديل فاتورة شراء #${purchase.invoice_number}`} />
            <div className="max-w-4xl space-y-4 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">تعديل فاتورة شراء #{purchase.invoice_number}</h1>
                    <Link href={route('purchases.show', purchase.id)} className="rounded border px-3 py-2">
                        عرض
                    </Link>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    <div className="grid gap-3 md:grid-cols-3">
                        <div className="grid gap-2">
                            <label htmlFor="purchase_edit_supplier" className="text-sm font-medium">
                                المورد
                            </label>
                            <select
                                id="purchase_edit_supplier"
                                className="border p-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                value={data.supplier_id}
                                onChange={(e) => setData('supplier_id', e.target.value)}
                            >
                                <option value="">اختر المورد</option>
                                {suppliers.map((s: any) => (
                                    <option key={s.id} value={s.id}>
                                        {s.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="purchase_edit_warehouse" className="text-sm font-medium">
                                المخزن
                            </label>
                            <select
                                id="purchase_edit_warehouse"
                                className="border p-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                value={data.warehouse_id}
                                onChange={(e) => setData('warehouse_id', e.target.value)}
                            >
                                <option value="">اختر المخزن</option>
                                {warehouses.map((w: any) => (
                                    <option key={w.id} value={w.id}>
                                        {w.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="purchase_edit_invoice_date" className="text-sm font-medium">
                                تاريخ الفاتورة
                            </label>
                            <input
                                id="purchase_edit_invoice_date"
                                className="border p-2"
                                type="date"
                                value={data.invoice_date}
                                onChange={(e) => setData('invoice_date', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h2 className="font-medium">العناصر</h2>
                        {data.items.map((it: any, i: number) => (
                            <div key={i} className="grid items-center gap-3 md:grid-cols-4">
                                <div className="grid gap-2">
                                    <label htmlFor={`purchase_edit_item_${i}_product`} className="text-sm font-medium">
                                        المنتج
                                    </label>
                                    <select
                                        id={`purchase_edit_item_${i}_product`}
                                        className="border p-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                        value={it.product_id}
                                        onChange={(e) =>
                                            setData(
                                                'items',
                                                data.items.map((x: any, idx: number) => (idx === i ? { ...x, product_id: e.target.value } : x)),
                                            )
                                        }
                                    >
                                        <option value="">اختر المنتج</option>
                                        {products.map((p: any) => (
                                            <option key={p.id} value={p.id}>
                                                {p.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="grid gap-2">
                                    <label htmlFor={`purchase_edit_item_${i}_qty`} className="text-sm font-medium">
                                        الكمية
                                    </label>
                                    <input
                                        id={`purchase_edit_item_${i}_qty`}
                                        className="border p-2"
                                        type="number"
                                        step="0.001"
                                        value={it.quantity}
                                        onChange={(e) =>
                                            setData(
                                                'items',
                                                data.items.map((x: any, idx: number) => (idx === i ? { ...x, quantity: Number(e.target.value) } : x)),
                                            )
                                        }
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <label htmlFor={`purchase_edit_item_${i}_price`} className="text-sm font-medium">
                                        سعر الوحدة
                                    </label>
                                    <input
                                        id={`purchase_edit_item_${i}_price`}
                                        className="border p-2"
                                        type="number"
                                        step="0.01"
                                        value={it.unit_price}
                                        onChange={(e) =>
                                            setData(
                                                'items',
                                                data.items.map((x: any, idx: number) =>
                                                    idx === i ? { ...x, unit_price: Number(e.target.value) } : x,
                                                ),
                                            )
                                        }
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm">{(it.quantity || 0) * (it.unit_price || 0)}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid gap-3 md:grid-cols-3">
                        <div className="grid gap-2">
                            <label htmlFor="purchase_edit_discount" className="text-sm font-medium">
                                خصم
                            </label>
                            <input
                                id="purchase_edit_discount"
                                className="border p-2"
                                type="number"
                                step="0.01"
                                value={data.discount}
                                onChange={(e) => setData('discount', Number(e.target.value))}
                            />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="purchase_edit_tax" className="text-sm font-medium">
                                ضريبة
                            </label>
                            <input
                                id="purchase_edit_tax"
                                className="border p-2"
                                type="number"
                                step="0.01"
                                value={data.tax}
                                onChange={(e) => setData('tax', Number(e.target.value))}
                            />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="purchase_edit_notes" className="text-sm font-medium">
                                ملاحظات
                            </label>
                            <input
                                id="purchase_edit_notes"
                                className="border p-2"
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button disabled={processing} className="rounded bg-black px-4 py-2 text-white">
                            تحديث
                        </button>
                        <Link href={route('purchases.index')} className="rounded border px-4 py-2">
                            إلغاء
                        </Link>
                    </div>
                </form>
            </div>
        </>
    );
}

// Apply app layout
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(PurchaseEdit as any).layout = (page: any) => {
    const { purchase } = page.props;
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'المشتريات', href: route('purchases.index') },
        { title: `تعديل #${purchase.invoice_number}`, href: route('purchases.edit', purchase.id) },
    ];
    return <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;
};

