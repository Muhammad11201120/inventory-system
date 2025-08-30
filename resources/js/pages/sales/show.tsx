import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

interface SaleItemDto {
    id: number;
    product?: { id: number; name: string } | null;
    quantity: number;
    unit_price: number;
    line_total: number;
}

interface SaleDto {
    id: number;
    invoice_number: string;
    customer?: { id: number; name: string } | null;
    warehouse?: { id: number; name: string } | null;
    invoice_date: string;
    subtotal: number;
    discount?: number | null;
    tax?: number | null;
    total: number;
    items?: SaleItemDto[];
}

interface InertiaPageProps {
    sale?: SaleDto;
    [key: string]: unknown;
}

export default function SaleShow() {
    const { props } = usePage<InertiaPageProps & { auth?: { user?: { roles?: string[] } } }>();
    const sale = props.sale;
    const roles = props.auth?.user?.roles ?? [];
    const canManage = roles.includes('admin') || roles.includes('manager');

    if (!sale) {
        return <div className="p-6">لا توجد بيانات</div>;
    }

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'المبيعات', href: route('sales.index') },
        { title: `عرض #${sale.invoice_number}`, href: route('sales.show', sale.id) },
    ];

    return (
        <>
            <Head title={`عرض فاتورة بيع #${sale.invoice_number}`} />
            <div className="space-y-4 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">عرض فاتورة بيع #{sale.invoice_number}</h1>
                    <div className="space-x-2 rtl:space-x-reverse">
                        <a
                            href={route('sales.print', sale.id)}
                            target="_blank"
                            rel="noopener"
                            className="rounded border bg-blue-500 px-3 py-2 text-sm text-white"
                        >
                            طباعة
                        </a>
                        {canManage && (
                            <Link href={route('sales.edit', sale.id)} className="ml-2 rounded border bg-green-500 px-3 py-2 text-sm text-white">
                                تعديل
                            </Link>
                        )}
                        <Link href={route('sales.index')} className="rounded border bg-red-500 px-3 py-2 text-sm text-white">
                            رجوع
                        </Link>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded border p-4">
                        <div className="text-sm text-gray-500">العميل</div>
                        <div>{sale.customer?.name ?? '-'}</div>
                    </div>
                    <div className="rounded border p-4">
                        <div className="text-sm text-gray-500">المخزن</div>
                        <div>{sale.warehouse?.name ?? '-'}</div>
                    </div>
                    <div className="rounded border p-4">
                        <div className="text-sm text-gray-500">التاريخ</div>
                        <div>{sale.invoice_date}</div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full border text-sm">
                        <thead className="bg-gray-50 dark:bg-slate-800">
                            <tr>
                                <th className="p-2 text-start">المنتج</th>
                                <th className="p-2 text-start">الكمية</th>
                                <th className="p-2 text-start">السعر</th>
                                <th className="p-2 text-start">الإجمالي</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(sale.items ?? []).map((i: SaleItemDto) => (
                                <tr key={i.id} className="border-t">
                                    <td className="p-2">{i.product?.name ?? '-'}</td>
                                    <td className="p-2">{i.quantity}</td>
                                    <td className="p-2">{i.unit_price}</td>
                                    <td className="p-2">{i.line_total}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-end gap-4">
                    <div className="min-w-52 rounded border p-4">
                        <div className="flex justify-between">
                            <span>الإجمالي قبل الخصم</span>
                            <span>{sale.subtotal}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>الخصم</span>
                            <span>{sale.discount ?? 0}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>الضريبة</span>
                            <span>{sale.tax ?? 0}</span>
                        </div>
                        <div className="flex justify-between font-semibold">
                            <span>الإجمالي</span>
                            <span>{sale.total}</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

// Apply app layout
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(SaleShow as any).layout = (page: any) => {
    const { sale } = page.props;
    const crumbs: BreadcrumbItem[] = [
        { title: 'المبيعات', href: route('sales.index') },
        { title: `عرض #${sale.invoice_number}`, href: route('sales.show', sale.id) },
    ];
    return <AppLayout breadcrumbs={crumbs}>{page}</AppLayout>;
};
