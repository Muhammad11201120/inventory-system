import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'المبيعات', href: route('sales.index') },
  { title: 'فاتورة جديدة', href: route('sales.create') },
];

export default function SaleCreate() {
  const { props } = usePage<any>();
  const customers = props.customers ?? [];
  const warehouses = props.warehouses ?? [];
  const products = props.products ?? [];
  const { data, setData, post, processing } = useForm({
    invoice_number: '', customer_id: '', warehouse_id: '', invoice_date: '', discount: 0, tax: 0, notes: '',
    items: [{ product_id: '', quantity: 1, unit_price: 0 }],
  });

  function addItem() {
    setData('items', [...data.items, { product_id: '', quantity: 1, unit_price: 0 }]);
  }
  function removeItem(i: number) {
    setData('items', data.items.filter((_: any, idx: number) => i !== idx));
  }
  function submit(e: React.FormEvent) {
    e.preventDefault();
    post(route('sales.store'));
  }

  return (
    <>
    <Head title="فاتورة بيع" />
    <div className="p-6 max-w-4xl">
      <h1 className="text-xl font-semibold mb-4">فاتورة بيع</h1>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid md:grid-cols-4 gap-3">
          <div className="grid gap-2">
            <label htmlFor="sale_invoice_number" className="text-sm font-medium">رقم الفاتورة</label>
            <input id="sale_invoice_number" className="border p-2" value={data.invoice_number} onChange={e => setData('invoice_number', e.target.value)} />
          </div>
          <div className="grid gap-2">
            <label htmlFor="sale_customer" className="text-sm font-medium">العميل</label>
            <select id="sale_customer" className="border p-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300" value={data.customer_id} onChange={e => setData('customer_id', e.target.value)}>
              <option value="">اختر العميل</option>
              {customers.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="grid gap-2">
            <label htmlFor="sale_warehouse" className="text-sm font-medium">المخزن</label>
            <select id="sale_warehouse" className="border p-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300" value={data.warehouse_id} onChange={e => setData('warehouse_id', e.target.value)}>
              <option value="">اختر المخزن</option>
              {warehouses.map((w: any) => <option key={w.id} value={w.id}>{w.name}</option>)}
            </select>
          </div>
          <div className="grid gap-2">
            <label htmlFor="sale_invoice_date" className="text-sm font-medium">تاريخ الفاتورة</label>
            <input id="sale_invoice_date" className="border p-2" type="date" value={data.invoice_date} onChange={e => setData('invoice_date', e.target.value)} />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">العناصر</h2>
            <button type="button" onClick={addItem} className="px-3 py-1 border rounded">+ إضافة</button>
          </div>
          {data.items.map((it: any, i: number) => (
            <div key={i} className="grid md:grid-cols-4 gap-3 items-center">
              <div className="grid gap-2">
                <label htmlFor={`sale_item_${i}_product`} className="text-sm font-medium">المنتج</label>
                <select id={`sale_item_${i}_product`} className="border p-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300" value={it.product_id} onChange={e => setData('items', data.items.map((x: any, idx: number) => idx===i ? { ...x, product_id: e.target.value } : x))}>
                  <option value="">اختر المنتج</option>
                  {products.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="grid gap-2">
                <label htmlFor={`sale_item_${i}_qty`} className="text-sm font-medium">الكمية</label>
                <input id={`sale_item_${i}_qty`} className="border p-2" type="number" step="0.001" value={it.quantity} onChange={e => setData('items', data.items.map((x: any, idx: number) => idx===i ? { ...x, quantity: Number(e.target.value) } : x))} />
              </div>
              <div className="grid gap-2">
                <label htmlFor={`sale_item_${i}_price`} className="text-sm font-medium">سعر الوحدة</label>
                <input id={`sale_item_${i}_price`} className="border p-2" type="number" step="0.01" value={it.unit_price} onChange={e => setData('items', data.items.map((x: any, idx: number) => idx===i ? { ...x, unit_price: Number(e.target.value) } : x))} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">{(it.quantity || 0) * (it.unit_price || 0)}</span>
                <button type="button" onClick={() => removeItem(i)} className="px-2 py-1 border rounded">حذف</button>
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-3">
          <div className="grid gap-2">
            <label htmlFor="sale_discount" className="text-sm font-medium">خصم</label>
            <input id="sale_discount" className="border p-2" type="number" step="0.01" value={data.discount} onChange={e => setData('discount', Number(e.target.value))} />
          </div>
          <div className="grid gap-2">
            <label htmlFor="sale_tax" className="text-sm font-medium">ضريبة</label>
            <input id="sale_tax" className="border p-2" type="number" step="0.01" value={data.tax} onChange={e => setData('tax', Number(e.target.value))} />
          </div>
          <div className="grid gap-2">
            <label htmlFor="sale_notes" className="text-sm font-medium">ملاحظات</label>
            <input id="sale_notes" className="border p-2" value={data.notes} onChange={e => setData('notes', e.target.value)} />
          </div>
        </div>

        <div className="flex gap-2">
          <button disabled={processing} className="px-4 py-2 bg-black text-white rounded">حفظ</button>
          <Link href={route('sales.index')} className="px-4 py-2 border rounded">إلغاء</Link>
        </div>
      </form>
    </div>
    </>
  );
}


// Apply app layout
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(SaleCreate as any).layout = (page: any) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;
