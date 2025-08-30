import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'المبيعات', href: route('sales.index') },
];

export default function SalesIndex() {
  const { props } = usePage<any>();
  const sales = props.sales?.data ?? [];
  const roles: string[] = props.auth?.user?.roles ?? [];
  const canManage = roles.includes('admin') || roles.includes('manager');
  return (
    <>
    <Head title="المبيعات" />
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">المبيعات</h1>
        {canManage && (
          <Link href={route('sales.create')} className="px-3 py-2 bg-black text-white rounded">فاتورة بيع</Link>
        )}
      </div>
      <table className="min-w-full border text-sm">
        <thead className="bg-gray-50 dark:bg-slate-800">
          <tr>
            <th className="p-2 text-start">رقم الفاتورة</th>
            <th className="p-2 text-start">العميل</th>
            <th className="p-2 text-start">المخزن</th>
            <th className="p-2 text-start">التاريخ</th>
            <th className="p-2 text-start">الإجمالي</th>
            <th className="p-2 text-start">إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((x: any) => (
            <tr key={x.id} className="border-t">
              <td className="p-2">{x.invoice_number}</td>
              <td className="p-2">{x.customer?.name ?? '-'}</td>
              <td className="p-2">{x.warehouse?.name ?? '-'}</td>
              <td className="p-2">{x.invoice_date}</td>
              <td className="p-2">{x.total}</td>
              <td className="p-2">
                <Link href={route('sales.show', x.id)} className="text-blue-600">عرض</Link>
                {canManage && (
                  <>
                    <span className="mx-1">|</span>
                    <Link href={route('sales.edit', x.id)} className="text-blue-600">تعديل</Link>
                  </>
                )}
               </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
}


// Apply app layout
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(SalesIndex as any).layout = (page: any) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;
