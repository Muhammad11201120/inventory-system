import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'المخازن', href: route('warehouses.index') },
];

export default function WarehousesIndex() {
  const { props } = usePage<any>();
  const warehouses = props.warehouses?.data ?? [];
  const roles: string[] = props.auth?.user?.roles ?? [];
  const canManage = roles.includes('admin') || roles.includes('manager');
  return (
    <>
    <Head title="المخازن" />
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">المخازن</h1>
        {canManage && (
          <Link href={route('warehouses.create')} className="px-3 py-2 bg-black text-white rounded">مخزن جديد</Link>
        )}
      </div>
      <table className="min-w-full border text-sm">
        <thead className="bg-gray-50 dark:bg-slate-800">
          <tr>
            <th className="p-2 text-start">الاسم</th>
            <th className="p-2 text-start">الموقع</th>
            <th className="p-2 text-start">افتراضي</th>
            {canManage && <th className="p-2 text-start">إجراءات</th>}
          </tr>
        </thead>
        <tbody>
          {warehouses.map((w: any) => (
            <tr key={w.id} className="border-t">
              <td className="p-2">{w.name}</td>
              <td className="p-2">{w.location ?? '-'}</td>
              <td className="p-2">{w.is_default ? 'نعم' : 'لا'}</td>
              {canManage && (
                <td className="p-2">
                  <Link href={route('warehouses.edit', w.id)} className="text-blue-600">تعديل</Link>
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
(WarehousesIndex as any).layout = (page: any) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;
