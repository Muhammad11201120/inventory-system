import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'المستخدمون', href: '/users' },
  { title: 'إضافة', href: '/users/create' },
];

type Role = { id: number; name: string };

export default function UsersCreate() {
  const { roles } = usePage().props as unknown as { roles: Role[] };
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    roles: [] as string[],
  });

  const toggleRole = (name: string) => {
    setData('roles', data.roles.includes(name) ? data.roles.filter((n) => n !== name) : [...data.roles, name]);
  };

  return (
    <>
      <Head title="مستخدم جديد" />
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">مستخدم جديد</h1>
          <Link href="/users" className="text-blue-600">رجوع</Link>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            post('/users');
          }}
          className="space-y-4 max-w-xl"
        >
          <div className="grid gap-2">
            <label>الاسم</label>
            <input className="rounded border p-2" value={data.name} onChange={(e) => setData('name', e.target.value)} />
            {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
          </div>
          <div className="grid gap-2">
            <label>البريد</label>
            <input className="rounded border p-2" value={data.email} onChange={(e) => setData('email', e.target.value)} />
            {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
          </div>
          <div className="grid gap-2">
            <label>كلمة المرور</label>
            <input type="password" className="rounded border p-2" value={data.password} onChange={(e) => setData('password', e.target.value)} />
            {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
          </div>
          <div className="grid gap-2">
            <label>تأكيد كلمة المرور</label>
            <input type="password" className="rounded border p-2" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} />
          </div>
          <div className="grid gap-2">
            <label>الأدوار</label>
            <div className="flex flex-wrap gap-3">
              {roles?.map((r) => (
                <label key={r.id} className="inline-flex items-center gap-2">
                  <input type="checkbox" checked={data.roles.includes(r.name)} onChange={() => toggleRole(r.name)} />
                  <span>{r.name}</span>
                </label>
              ))}
            </div>
          </div>
          <button type="submit" disabled={processing} className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50">حفظ</button>
        </form>
      </div>
    </>
  );
}

// Apply app layout
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(UsersCreate as any).layout = (page: any) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;


