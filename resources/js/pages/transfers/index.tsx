import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'التحويلات', href: '/transfers' }];

type Transfer = {
    id: number;
    quantity: number;
    transferred_at: string;
    product: { id: number; name: string };
    from_warehouse: { id: number; name: string };
    to_warehouse: { id: number; name: string };
};

export default function TransfersIndex() {
    const { transfers, auth } = usePage().props as unknown as { transfers: { data: Transfer[] }, auth?: { user?: { roles?: string[] } } };
    const roles = auth?.user?.roles ?? [];
    const canManage = roles.includes('admin') || roles.includes('manager');
    return (
        <>
            <Head title="التحويلات" />
            <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-xl font-semibold">التحويلات</h1>
                    {canManage && (
                        <Link href="/transfers/create" className="rounded bg-blue-600 px-3 py-2 text-white">
                            تحويل جديد
                        </Link>
                    )}
                </div>
                <div className="overflow-x-auto rounded border">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-100 dark:bg-slate-800">
                            <tr>
                                <th className="p-2 text-start">ID</th>
                                <th className="p-2 text-start">المنتج</th>
                                <th className="p-2 text-start">من</th>
                                <th className="p-2 text-start">إلى</th>
                                <th className="p-2 text-start">الكمية</th>
                                <th className="p-2 text-start">التاريخ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transfers?.data?.map((t) => (
                                <tr key={t.id} className="odd:bg-white even:bg-slate-50 dark:odd:bg-slate-900 dark:even:bg-slate-800">
                                    <td className="p-2">{t.id}</td>
                                    <td className="p-2">{t.product?.name}</td>
                                    <td className="p-2">{t.from_warehouse?.name}</td>
                                    <td className="p-2">{t.to_warehouse?.name}</td>
                                    <td className="p-2">{t.quantity}</td>
                                    <td className="p-2">{new Date(t.transferred_at).toLocaleString('ar-SA')}</td>
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
(TransfersIndex as any).layout = (page: any) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;
