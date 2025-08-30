import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

export default function SupplierEdit() {
  const { props } = usePage<any>();
  const supplier = props.supplier;
  const { data, setData, put, processing, errors } = useForm({ name: supplier.name, email: supplier.email ?? '', phone: supplier.phone ?? '', address: supplier.address ?? '', tax_number: supplier.tax_number ?? '' });
  function submit(e: React.FormEvent) {
    e.preventDefault();
    put(route('suppliers.update', supplier.id));
  }
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'الموردون', href: route('suppliers.index') },
    { title: `تعديل #${supplier.id}`, href: route('suppliers.edit', supplier.id) },
  ];

  return (
    <>
    <Head title={`تعديل مورد #${supplier.id}`} />
    <div className="p-6 max-w-2xl">
      <h1 className="text-xl font-semibold mb-4">تعديل مورد</h1>
      <form onSubmit={submit} className="space-y-3">
        <div className="grid gap-2">
          <label htmlFor="supplier_name" className="text-sm font-medium">الاسم</label>
          <input id="supplier_name" className="w-full border p-2" value={data.name} onChange={e => setData('name', e.target.value)} />
          {errors.name && <div className="text-red-600 text-sm">{errors.name}</div>}
        </div>
        <div className="grid gap-2">
          <label htmlFor="supplier_email" className="text-sm font-medium">البريد الإلكتروني</label>
          <input id="supplier_email" className="w-full border p-2" type="email" value={data.email} onChange={e => setData('email', e.target.value)} />
        </div>
        <div className="grid gap-2">
          <label htmlFor="supplier_phone" className="text-sm font-medium">الهاتف</label>
          <input id="supplier_phone" className="w-full border p-2" value={data.phone} onChange={e => setData('phone', e.target.value)} />
        </div>
        <div className="grid gap-2">
          <label htmlFor="supplier_address" className="text-sm font-medium">العنوان</label>
          <input id="supplier_address" className="w-full border p-2" value={data.address} onChange={e => setData('address', e.target.value)} />
        </div>
        <div className="grid gap-2">
          <label htmlFor="supplier_tax_number" className="text-sm font-medium">الرقم الضريبي</label>
          <input id="supplier_tax_number" className="w-full border p-2" value={data.tax_number} onChange={e => setData('tax_number', e.target.value)} />
        </div>
        <div className="flex gap-2">
          <button disabled={processing} className="px-4 py-2 bg-black text-white rounded">تحديث</button>
          <Link href={route('suppliers.index')} className="px-4 py-2 border rounded">إلغاء</Link>
        </div>
      </form>
    </div>
    </>
  );
}


// Apply app layout
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(SupplierEdit as any).layout = (page: any) => {
  const { supplier } = page.props;
  const crumbs: BreadcrumbItem[] = [
    { title: 'الموردون', href: route('suppliers.index') },
    { title: `تعديل #${supplier.id}`, href: route('suppliers.edit', supplier.id) },
  ];
  return <AppLayout breadcrumbs={crumbs}>{page}</AppLayout>;
};
