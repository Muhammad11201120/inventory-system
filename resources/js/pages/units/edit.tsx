import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

export default function UnitEdit() {
  const { props } = usePage<any>();
  const unit = props.unit;
  const { data, setData, put, processing, errors } = useForm({ name: unit.name, symbol: unit.symbol ?? '' });
  function submit(e: React.FormEvent) {
    e.preventDefault();
    put(route('units.update', unit.id));
  }
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'الوحدات', href: route('units.index') },
    { title: `تعديل #${unit.id}`, href: route('units.edit', unit.id) },
  ];

  return (
    <>
    <Head title={`تعديل وحدة #${unit.id}`} />
    <div className="p-6 max-w-2xl">
      <h1 className="text-xl font-semibold mb-4">تعديل وحدة</h1>
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
          <button disabled={processing} className="px-4 py-2 bg-black text-white rounded">تحديث</button>
          <Link href={route('units.index')} className="px-4 py-2 border rounded">إلغاء</Link>
        </div>
      </form>
    </div>
    </>
  );
}


// Apply app layout
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(UnitEdit as any).layout = (page: any) => {
  const { unit } = page.props;
  const crumbs: BreadcrumbItem[] = [
    { title: 'الوحدات', href: route('units.index') },
    { title: `تعديل #${unit.id}`, href: route('units.edit', unit.id) },
  ];
  return <AppLayout breadcrumbs={crumbs}>{page}</AppLayout>;
};
