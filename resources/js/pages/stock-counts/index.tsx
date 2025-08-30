import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'الجرد', href: '/stock-counts' }];

type StockCount = {
    id: number;
    count_date: string;
    status: string;
    warehouse: { id: number; name: string };
};

export default function StockCountsIndex() {
    const { stockCounts, auth } = usePage().props as unknown as { stockCounts: { data: StockCount[] }, auth?: { user?: { roles?: string[] } } };
    const roles = auth?.user?.roles ?? [];
    const canManage = roles.includes('admin') || roles.includes('manager');
    return (
        <>
            <Head title="الجرد" />
            <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-xl font-semibold">الجرد</h1>
                    {canManage && (
                        <Link href="/stock-counts/create" className="rounded bg-blue-600 px-3 py-2 text-white">
                            جرد جديد
                        </Link>
                    )}
                </div>
                <div className="overflow-x-auto rounded border">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-100 dark:bg-slate-800">
                            <tr>
                                <th className="p-2 text-start">ID</th>
                                <th className="p-2 text-start">المخزن</th>
                                <th className="p-2 text-start">التاريخ</th>
                                <th className="p-2 text-start">الحالة</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stockCounts?.data?.map((c) => (
                                <tr key={c.id} className="odd:bg-white even:bg-slate-50 dark:odd:bg-slate-900 dark:even:bg-slate-800">
                                    <td className="p-2">{c.id}</td>
                                    <td className="p-2">{c.warehouse?.name}</td>
                                    <td className="p-2">{new Date(c.count_date).toLocaleDateString('ar-SA')}</td>
                                    <td className="p-2">{c.status}</td>
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
(StockCountsIndex as any).layout = (page: any) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;
