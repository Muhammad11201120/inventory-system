import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'المستخدمون', href: '/users' },
];

type UserRow = {
  id: number;
  name: string;
  email: string;
  roles: { id: number; name: string }[];
};

export default function UsersIndex() {
  const { users, auth } = usePage().props as unknown as { users: { data: UserRow[] }, auth?: { user?: { roles?: string[] } } };
  const roles = auth?.user?.roles ?? [];
  const canManage = roles.includes('admin') || roles.includes('manager');
  return (
    <>
      <Head title="المستخدمون" />
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">المستخدمون</h1>
          {canManage && (
            <Link href="/users/create" className="rounded bg-blue-600 px-3 py-2 text-white">مستخدم جديد</Link>
          )}
        </div>
        <div className="overflow-x-auto rounded border">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 dark:bg-slate-800">
              <tr>
                <th className="p-2 text-start">ID</th>
                <th className="p-2 text-start">الاسم</th>
                <th className="p-2 text-start">البريد</th>
                <th className="p-2 text-start">الأدوار</th>
                {canManage && <th className="p-2 text-start">إجراءات</th>}
              </tr>
            </thead>
            <tbody>
              {users?.data?.map((u) => (
                <tr key={u.id} className="odd:bg-white even:bg-slate-50 dark:odd:bg-slate-900 dark:even:bg-slate-800">
                  <td className="p-2">{u.id}</td>
                  <td className="p-2">{u.name}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2">{u.roles?.map((r) => r.name).join(', ')}</td>
                  {canManage && (
                    <td className="p-2 space-x-2">
                      <Link href={`/users/${u.id}/edit`} className="text-blue-600">تعديل</Link>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// Apply app layout
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(UsersIndex as any).layout = (page: any) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;


