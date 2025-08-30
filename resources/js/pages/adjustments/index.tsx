import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'التعديلات', href: '/adjustments' }];

type Adjustment = {
    id: number;
    quantity: number;
    adjusted_at: string;
    reason?: string | null;
    product: { id: number; name: string };
    warehouse: { id: number; name: string };
};

export default function AdjustmentsIndex() {
    const { adjustments, auth } = usePage().props as unknown as { adjustments: { data: Adjustment[] }, auth?: { user?: { roles?: string[] } } };
    const roles = auth?.user?.roles ?? [];
    const canManage = roles.includes('admin') || roles.includes('manager');
    return (
        <>
            <Head title="التعديلات" />
            <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-xl font-semibold">التعديلات</h1>
                    {canManage && (
                        <Link href="/adjustments/create" className="rounded bg-blue-600 px-3 py-2 text-white">
                            إظافة تعديل
                        </Link>
                    )}
                </div>
                <div className="overflow-x-auto rounded border">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-100 dark:bg-slate-800">
                            <tr>
                                <th className="p-2 text-start">ID</th>
                                <th className="p-2 text-start">المنتج</th>
                                <th className="p-2 text-start">المخزن</th>
                                <th className="p-2 text-start">الكمية</th>
                                <th className="p-2 text-start">السبب</th>
                                <th className="p-2 text-start">التاريخ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {adjustments?.data?.map((a) => (
                                <tr key={a.id} className="odd:bg-white even:bg-slate-50 dark:odd:bg-slate-900 dark:even:bg-slate-800">
                                    <td className="p-2">{a.id}</td>
                                    <td className="p-2">{a.product?.name}</td>
                                    <td className="p-2">{a.warehouse?.name}</td>
                                    <td className="p-2">{a.quantity}</td>
                                    <td className="p-2">{a.reason ?? '-'}</td>
                                    <td className="p-2">{new Date(a.adjusted_at).toLocaleString('ar-SA')}</td>
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
(AdjustmentsIndex as any).layout = (page: any) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;
