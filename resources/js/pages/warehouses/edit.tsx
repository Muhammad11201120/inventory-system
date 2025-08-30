import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

export default function WarehouseEdit() {
  const { props } = usePage<any>();
  const warehouse = props.warehouse;
  const { data, setData, put, processing } = useForm({ name: warehouse.name, location: warehouse.location ?? '', is_default: !!warehouse.is_default });
  function submit(e: React.FormEvent) {
    e.preventDefault();
    put(route('warehouses.update', warehouse.id));
  }
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'المخازن', href: route('warehouses.index') },
    { title: `تعديل #${warehouse.id}`, href: route('warehouses.edit', warehouse.id) },
  ];

  return (
    <>
    <Head title={`تعديل مخزن #${warehouse.id}`} />
    <div className="p-6 max-w-2xl">
      <h1 className="text-xl font-semibold mb-4">تعديل مخزن</h1>
      <form onSubmit={submit} className="space-y-3">
        <div className="grid gap-1">
          <Label htmlFor="warehouse_name">الاسم</Label>
          <input id="warehouse_name" className="w-full border p-2" value={data.name} onChange={e => setData('name', e.target.value)} />
        </div>
        <div className="grid gap-1">
          <Label htmlFor="warehouse_location">الموقع</Label>
          <input id="warehouse_location" className="w-full border p-2" value={data.location} onChange={e => setData('location', e.target.value)} />
        </div>
        <div className="flex items-center gap-2">
          <input id="is_default" type="checkbox" checked={data.is_default} onChange={e => setData('is_default', e.target.checked)} />
          <label htmlFor="is_default">افتراضي</label>
        </div>
        <div className="flex gap-2">
          <button disabled={processing} className="px-4 py-2 bg-black text-white rounded">تحديث</button>
          <Link href={route('warehouses.index')} className="px-4 py-2 border rounded">إلغاء</Link>
        </div>
      </form>
    </div>
    </>
  );
}


// Apply app layout
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(WarehouseEdit as any).layout = (page: any) => {
  const { warehouse } = page.props;
  const crumbs: BreadcrumbItem[] = [
    { title: 'المخازن', href: route('warehouses.index') },
    { title: `تعديل #${warehouse.id}`, href: route('warehouses.edit', warehouse.id) },
  ];
  return <AppLayout breadcrumbs={crumbs}>{page}</AppLayout>;
};
