import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'الموردون', href: route('suppliers.index') },
];

export default function SuppliersIndex() {
  const { props } = usePage<any>();
  const suppliers = props.suppliers?.data ?? [];
  const roles: string[] = props.auth?.user?.roles ?? [];
  const canManage = roles.includes('admin') || roles.includes('manager');
  return (
    <>
    <Head title="الموردون" />
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">الموردون</h1>
        {canManage && (
          <Link href={route('suppliers.create')} className="px-3 py-2 bg-black text-white rounded">مورد جديد</Link>
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
          {suppliers.map((s: any) => (
            <tr key={s.id} className="border-t">
              <td className="p-2">{s.name}</td>
              <td className="p-2">{s.phone ?? '-'}</td>
              {canManage && (
                <td className="p-2">
                  <Link href={route('suppliers.edit', s.id)} className="text-blue-600">تعديل</Link>
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
(SuppliersIndex as any).layout = (page: any) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;
