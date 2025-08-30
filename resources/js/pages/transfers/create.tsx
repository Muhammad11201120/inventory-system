import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'التحويلات', href: '/transfers' },
  { title: 'إضافة', href: '/transfers/create' },
];

type Option = { id: number; name: string };

export default function TransfersCreate() {
  const { products, warehouses } = usePage().props as unknown as { products: Option[]; warehouses: Option[] };
  const { data, setData, post, processing, errors } = useForm({
    product_id: '',
    from_warehouse_id: '',
    to_warehouse_id: '',
    quantity: 1,
    transferred_at: new Date().toISOString().slice(0, 16),
  });

  return (
    <>
      <Head title="تحويل جديد" />
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">تحويل جديد</h1>
          <Link href="/transfers" className="text-blue-600">رجوع</Link>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            post('/transfers');
          }}
          className="space-y-4 max-w-xl"
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
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            {errors.product_id && <p className="text-sm text-red-600">{errors.product_id}</p>}
          </div>

          <div className="grid gap-2">
            <label>من المخزن</label>
            <select
              value={data.from_warehouse_id}
              onChange={(e) => setData('from_warehouse_id', e.target.value)}
              className="rounded border p-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              <option value="">اختر...</option>
              {warehouses?.map((w) => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
            {errors.from_warehouse_id && <p className="text-sm text-red-600">{errors.from_warehouse_id}</p>}
          </div>

          <div className="grid gap-2">
            <label>إلى المخزن</label>
            <select
              value={data.to_warehouse_id}
              onChange={(e) => setData('to_warehouse_id', e.target.value)}
              className="rounded border p-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              <option value="">اختر...</option>
              {warehouses?.map((w) => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
            {errors.to_warehouse_id && <p className="text-sm text-red-600">{errors.to_warehouse_id}</p>}
          </div>

          <div className="grid gap-2">
            <label>الكمية</label>
            <input
              type="number"
              step="0.001"
              value={data.quantity}
              onChange={(e) => setData('quantity', Number(e.target.value))}
              className="rounded border p-2"
              min={0.001}
            />
            {errors.quantity && <p className="text-sm text-red-600">{errors.quantity}</p>}
          </div>

          <div className="grid gap-2">
            <label>التاريخ/الوقت</label>
            <input
              type="datetime-local"
              value={data.transferred_at}
              onChange={(e) => setData('transferred_at', e.target.value)}
              className="rounded border p-2"
            />
          </div>

          <button type="submit" disabled={processing} className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50">حفظ</button>
        </form>
      </div>
    </>
  );
}

// Apply app layout
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(TransfersCreate as any).layout = (page: any) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;


