import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'المشتريات', href: route('purchases.index') },
    { title: 'فاتورة جديدة', href: route('purchases.create') },
];

export default function PurchaseCreate() {
    const { props } = usePage<any>();
    const suppliers = props.suppliers ?? [];
    const warehouses = props.warehouses ?? [];
    const products = props.products ?? [];
    const { data, setData, post, processing } = useForm({
        invoice_number: '',
        supplier_id: '',
        warehouse_id: '',
        invoice_date: '',
        discount: 0,
        tax: 0,
        notes: '',
        items: [{ product_id: '', quantity: 1, unit_price: 0 }],
    });

    function addItem() {
        setData('items', [...data.items, { product_id: '', quantity: 1, unit_price: 0 }]);
    }
    function removeItem(i: number) {
        setData(
            'items',
            data.items.filter((_: any, idx: number) => i !== idx),
        );
    }
    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(route('purchases.store'));
    }

    return (
        <>
            <Head title="فاتورة شراء" />
            <div className="max-w-4xl p-6">
                <h1 className="mb-4 text-xl font-semibold">فاتورة شراء</h1>
                <form onSubmit={submit} className="space-y-4">
                    <div className="grid gap-3 md:grid-cols-4">
                        <div className="grid gap-2">
                            <label htmlFor="purchase_invoice_number" className="text-sm font-medium">
                                رقم الفاتورة
                            </label>
                            <input
                                id="purchase_invoice_number"
                                className="border p-2"
                                value={data.invoice_number}
                                onChange={(e) => setData('invoice_number', e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="purchase_supplier" className="text-sm font-medium">
                                المورد
                            </label>
                            <select
                                id="purchase_supplier"
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
                            <label htmlFor="purchase_warehouse" className="text-sm font-medium">
                                المخزن
                            </label>
                            <select
                                id="purchase_warehouse"
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
                            <label htmlFor="purchase_invoice_date" className="text-sm font-medium">
                                تاريخ الفاتورة
                            </label>
                            <input
                                id="purchase_invoice_date"
                                className="border p-2"
                                type="date"
                                value={data.invoice_date}
                                onChange={(e) => setData('invoice_date', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <h2 className="font-medium">العناصر</h2>
                            <button type="button" onClick={addItem} className="rounded border px-3 py-1">
                                + إضافة
                            </button>
                        </div>
                        {data.items.map((it: any, i: number) => (
                            <div key={i} className="grid items-center gap-3 md:grid-cols-4">
                                <div className="grid gap-2">
                                    <label htmlFor={`purchase_item_${i}_product`} className="text-sm font-medium">
                                        المنتج
                                    </label>
                                    <select
                                        id={`purchase_item_${i}_product`}
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
                                    <label htmlFor={`purchase_item_${i}_qty`} className="text-sm font-medium">
                                        الكمية
                                    </label>
                                    <input
                                        id={`purchase_item_${i}_qty`}
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
                                    <label htmlFor={`purchase_item_${i}_price`} className="text-sm font-medium">
                                        سعر الوحدة
                                    </label>
                                    <input
                                        id={`purchase_item_${i}_price`}
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
                                    <button type="button" onClick={() => removeItem(i)} className="rounded border px-2 py-1">
                                        حذف
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid gap-3 md:grid-cols-3">
                        <div className="grid gap-2">
                            <label htmlFor="purchase_discount" className="text-sm font-medium">
                                خصم
                            </label>
                            <input
                                id="purchase_discount"
                                className="border p-2"
                                type="number"
                                step="0.01"
                                value={data.discount}
                                onChange={(e) => setData('discount', Number(e.target.value))}
                            />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="purchase_tax" className="text-sm font-medium">
                                ضريبة
                            </label>
                            <input
                                id="purchase_tax"
                                className="border p-2"
                                type="number"
                                step="0.01"
                                value={data.tax}
                                onChange={(e) => setData('tax', Number(e.target.value))}
                            />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="purchase_notes" className="text-sm font-medium">
                                ملاحظات
                            </label>
                            <input id="purchase_notes" className="border p-2" value={data.notes} onChange={(e) => setData('notes', e.target.value)} />
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button disabled={processing} className="rounded bg-black px-4 py-2 text-white">
                            حفظ
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
(PurchaseCreate as any).layout = (page: any) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;
