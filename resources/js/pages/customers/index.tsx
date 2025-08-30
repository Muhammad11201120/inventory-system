import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'العملاء', href: route('customers.index') },
];

export default function CustomersIndex() {
  const { props } = usePage<any>();
  const customers = props.customers?.data ?? [];
  const roles: string[] = props.auth?.user?.roles ?? [];
  const canManage = roles.includes('admin') || roles.includes('manager');
  return (
    <>
    <Head title="العملاء" />
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">العملاء</h1>
        {canManage && (
          <Link href={route('customers.create')} className="px-3 py-2 bg-black text-white rounded">عميل جديد</Link>
        )}
      </div>
      <table className="min-w-full border text-sm">
        <thead className="bg-gray-50 dark:bg-slate-800">
          <tr>
            <th className="p-2 text-start">الاسم</th>
            <th className="p-2 text-start">الهاتف</th>
            {canManage && <th className="p-2 text-start">إجراءات</th>}
          </tr>
        </thead>
        <tbody>
          {customers.map((c: any) => (
            <tr key={c.id} className="border-t">
              <td className="p-2">{c.name}</td>
              <td className="p-2">{c.phone ?? '-'}</td>
              {canManage && (
                <td className="p-2">
                  <Link href={route('customers.edit', c.id)} className="text-blue-600">تعديل</Link>
                </td>
              )}
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
(CustomersIndex as any).layout = (page: any) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;
