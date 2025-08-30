import AppLayout from '@/layouts/app-layout';
import type { SharedData } from '@/types';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'المشتريات', href: route('purchases.index') }];

type PurchaseListItem = {
    id: number;
    invoice_number: string;
    supplier?: { name?: string } | null;
    warehouse?: { name?: string } | null;
    invoice_date: string;
    total: number;
};

type PurchasesPageProps = {
    purchases?: { data: PurchaseListItem[] };
};

export default function PurchasesIndex() {
    const page = usePage<SharedData & PurchasesPageProps>();
    const { auth, ...props } = page.props as SharedData & PurchasesPageProps;
    const purchases = props.purchases?.data ?? [];
    const roles: string[] = (auth?.user as unknown as { roles?: string[] })?.roles ?? [];
    const canManage = roles.includes('admin') || roles.includes('manager');
    return (
        <>
            <Head title="المشتريات" />
            <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-xl font-semibold">المشتريات</h1>
                    {canManage && (
                        <Link href={route('purchases.create')} className="rounded bg-black px-3 py-2 text-white">
                            فاتورة شراء
                        </Link>
                    )}
                </div>
                <table className="min-w-full border text-sm">
                    <thead className="bg-gray-50 dark:bg-slate-800">
                        <tr>
                            <th className="p-2 text-start">رقم الفاتورة</th>
                            <th className="p-2 text-start">المورد</th>
                            <th className="p-2 text-start">المخزن</th>
                            <th className="p-2 text-start">التاريخ</th>
                            <th className="p-2 text-start">الإجمالي</th>
                            <th className="p-2 text-start">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {purchases.map((x: PurchaseListItem) => (
                            <tr key={x.id} className="border-t">
                                <td className="p-2">{x.invoice_number}</td>
                                <td className="p-2">{x.supplier?.name ?? '-'}</td>
                                <td className="p-2">{x.warehouse?.name ?? '-'}</td>
                                <td className="p-2">{x.invoice_date}</td>
                                <td className="p-2">{x.total}</td>
                                <td className="p-2">
                                    <Link href={route('purchases.show', x.id)} className="text-blue-600">
                                        عرض
                                    </Link>
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
(PurchasesIndex as any).layout = (page: any) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;
