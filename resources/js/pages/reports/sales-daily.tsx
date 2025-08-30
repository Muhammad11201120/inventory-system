import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

export default function SalesDaily() {
  const { props } = usePage<any>();
  const sales = props.sales ?? [];
  const total = props.total ?? 0;
  const { data, setData } = useForm({ date: props.date ?? '' });

  function applyFilter(e: React.FormEvent) {
    e.preventDefault();
    router.get(route('reports.sales.daily'), data);
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'التقارير', href: route('reports.index') },
    { title: 'مبيعات يومية', href: route('reports.sales.daily') },
  ];

  return (
    <>
    <Head title="تقرير المبيعات اليومي" />
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">تقرير المبيعات اليومي</h1>
      </div>
      <form onSubmit={applyFilter} className="flex gap-3 mb-4 items-end flex-wrap">
        <div className="grid gap-1">
          <Label htmlFor="daily_date">التاريخ</Label>
          <input id="daily_date" type="date" className="border p-2" value={data.date} onChange={e => setData('date', e.target.value)} />
        </div>
        <button className="px-3 py-2 border rounded">تطبيق</button>
      </form>
      <table className="min-w-full border text-sm">
        <thead className="bg-gray-50 dark:bg-slate-800">
          <tr>
            <th className="p-2 text-start">رقم الفاتورة</th>
            <th className="p-2 text-start">التاريخ</th>
            <th className="p-2 text-start">الإجمالي</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((x: any) => (
            <tr key={x.id} className="border-t">
              <td className="p-2">{x.invoice_number}</td>
              <td className="p-2">{x.invoice_date}</td>
              <td className="p-2">{x.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">الإجمالي: {total}</div>
    </div>
    </>
  );
}


// Apply app layout
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(SalesDaily as any).layout = (page: any) => {
  const crumbs: BreadcrumbItem[] = [
    { title: 'التقارير', href: route('reports.index') },
    { title: 'مبيعات يومية', href: route('reports.sales.daily') },
  ];
  return <AppLayout breadcrumbs={crumbs}>{page}</AppLayout>;
};
