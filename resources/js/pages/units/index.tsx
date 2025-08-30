import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'الوحدات', href: route('units.index') }];

export default function UnitsIndex() {
    const { props } = usePage<any>();
    const units = props.units?.data ?? [];
    const authUser = props.auth?.user;
    const roles: string[] = authUser?.roles ?? [];
    const permissions: string[] = authUser?.permissions ?? [];
    const canManageUnits = permissions.includes('units.manage') || roles.includes('admin') || roles.includes('manager');
    return (
        <>
            <Head title="الوحدات" />
            <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-xl font-semibold">الوحدات</h1>
                    {canManageUnits && (
                        <Link href={route('units.create')} className="rounded bg-black px-3 py-2 text-white">
                            وحدة جديدة
                        </Link>
                    )}
                </div>
                <table className="min-w-full border text-sm">
                    <thead className="bg-gray-50 dark:bg-slate-800">
                        <tr>
                            <th className="p-2 text-start">الاسم</th>
                            <th className="p-2 text-start">الرمز</th>
                            {canManageUnits && <th className="p-2 text-start">إجراءات</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {units.map((u: any) => (
                            <tr key={u.id} className="border-t">
                                <td className="p-2">{u.name}</td>
                                <td className="p-2">{u.symbol ?? '-'}</td>
                                {canManageUnits && (
                                    <td className="p-2">
                                        <Link href={route('units.edit', u.id)} className="text-blue-600">
                                            تعديل
                                        </Link>
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
(UnitsIndex as any).layout = (page: any) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;
