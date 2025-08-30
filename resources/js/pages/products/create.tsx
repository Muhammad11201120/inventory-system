import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'المنتجات', href: route('products.index') },
  { title: 'إضافة', href: route('products.create') },
];

export default function ProductCreate() {
  const { props } = usePage<any>();
  const categories = props.categories ?? [];
  const units = props.units ?? [];
  const { data, setData, post, processing, errors } = useForm({
    name: '', sku: '', barcode: '', category_id: '', unit_id: '',
    cost_price: 0, sale_price: 0, reorder_level: 0, image_path: '', is_active: true,
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    post(route('products.store'));
  }

  return (
    <>
    <Head title="إضافة منتج" />
    <div className="p-6 max-w-2xl">
      <h1 className="text-xl font-semibold mb-4">إضافة منتج</h1>
      <form onSubmit={submit} className="space-y-3">
        <div className="grid gap-2">
          <label htmlFor="product_name" className="text-sm font-medium">الاسم</label>
          <input id="product_name" className="w-full border p-2" value={data.name} onChange={e => setData('name', e.target.value)} />
          {errors.name && <div className="text-red-600 text-sm">{errors.name}</div>}
        </div>
        <div className="grid gap-2">
          <label htmlFor="product_sku" className="text-sm font-medium">SKU</label>
          <input id="product_sku" className="w-full border p-2" value={data.sku} onChange={e => setData('sku', e.target.value)} />
        </div>
        <div className="grid gap-2">
          <label htmlFor="product_barcode" className="text-sm font-medium">الباركود</label>
          <input id="product_barcode" className="w-full border p-2" value={data.barcode} onChange={e => setData('barcode', e.target.value)} />
        </div>
        <div className="grid gap-2">
          <label htmlFor="product_category" className="text-sm font-medium">التصنيف</label>
          <select id="product_category" className="w-full border p-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300" value={data.category_id} onChange={e => setData('category_id', e.target.value)}>
            <option value="">اختر التصنيف</option>
            {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="grid gap-2">
          <label htmlFor="product_unit" className="text-sm font-medium">الوحدة</label>
          <select id="product_unit" className="w-full border p-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300" value={data.unit_id} onChange={e => setData('unit_id', e.target.value)}>
            <option value="">اختر الوحدة</option>
            {units.map((u: any) => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="grid gap-2">
            <label htmlFor="product_cost_price" className="text-sm font-medium">سعر التكلفة</label>
            <input id="product_cost_price" className="border p-2" type="number" step="0.01" value={data.cost_price} onChange={e => setData('cost_price', e.target.value)} />
          </div>
          <div className="grid gap-2">
            <label htmlFor="product_sale_price" className="text-sm font-medium">سعر البيع</label>
            <input id="product_sale_price" className="border p-2" type="number" step="0.01" value={data.sale_price} onChange={e => setData('sale_price', e.target.value)} />
          </div>
        </div>
        <div className="grid gap-2">
          <label htmlFor="product_reorder_level" className="text-sm font-medium">حد إعادة الطلب</label>
          <input id="product_reorder_level" className="w-full border p-2" type="number" value={data.reorder_level} onChange={e => setData('reorder_level', e.target.value)} />
        </div>
        <div className="flex items-center gap-2">
          <input id="is_active" type="checkbox" checked={data.is_active} onChange={e => setData('is_active', e.target.checked)} />
          <label htmlFor="is_active">مفعل</label>
        </div>
        <div className="flex gap-2">
          <button disabled={processing} className="px-4 py-2 bg-black text-white rounded">حفظ</button>
          <Link href={route('products.index')} className="px-4 py-2 border rounded">إلغاء</Link>
        </div>
      </form>
    </div>
    </>
  );
}

// Apply app layout
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(ProductCreate as any).layout = (page: any) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;


