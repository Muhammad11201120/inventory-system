import { Head, Link, useForm } from '@inertiajs/react';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'الوحدات', href: route('units.index') },
  { title: 'إضافة', href: route('units.create') },
];

export default function UnitCreate() {
  const { data, setData, post, processing, errors } = useForm({ name: '', symbol: '' });
  function submit(e: React.FormEvent) {
    e.preventDefault();
    post(route('units.store'));
  }
  return (
    <>
    <Head title="إضافة وحدة" />
    <div className="p-6 max-w-2xl">
      <h1 className="text-xl font-semibold mb-4">إضافة وحدة</h1>
      <form onSubmit={submit} className="space-y-3">
        <div className="grid gap-1">
          <Label htmlFor="unit_name">الاسم</Label>
          <input id="unit_name" className="w-full border p-2" value={data.name} onChange={e => setData('name', e.target.value)} />
          {errors.name && <div className="text-red-600 text-sm">{errors.name}</div>}
        </div>
        <div className="grid gap-1">
          <Label htmlFor="unit_symbol">الرمز</Label>
          <input id="unit_symbol" className="w-full border p-2" value={data.symbol} onChange={e => setData('symbol', e.target.value)} />
        </div>
        <div className="flex gap-2">
          <button disabled={processing} className="px-4 py-2 bg-black text-white rounded">حفظ</button>
          <Link href={route('units.index')} className="px-4 py-2 border rounded">إلغاء</Link>
        </div>
      </form>
    </div>
    </>
  );
}


// Apply app layout
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(UnitCreate as any).layout = (page: any) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;
