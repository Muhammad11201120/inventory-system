import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';

type MovementPageProps = {
    products: { id: number; name: string; category?: { name?: string } | null }[];
    selectedProduct?: string | number | null;
    transactions?: {
        data?: Array<{
            id: number;
            product_id: number;
            warehouse?: { name?: string } | null;
            type: string;
            quantity: number;
            transacted_at: string;
            reference_type?: string | null;
            reference_id?: number | null;
            reference_invoice_number?: string | null;
        }>;
    };
};

export default function ProductMovementIndex() {
    const { props } = usePage<MovementPageProps>();
    const { products, selectedProduct, transactions } = props;
    const { data, setData } = useForm({ product_id: selectedProduct || '' });

    function applyFilter(e: React.FormEvent) {
        e.preventDefault();
        router.get(route('reports.product-movement.index'), data);
    }

    // breadcrumbs handled by layout

    return (
        <>
            <Head title="تقرير حركة المنتجات" />
            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">تقرير حركة المنتجات</h1>
                    <Link href={route('reports.index')} className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600">
                        العودة للتقارير
                    </Link>
                </div>

                <div className="mb-6 rounded-lg bg-white p-6 shadow dark:bg-slate-800">
                    <h2 className="mb-4 text-lg font-semibold">اختر المنتج</h2>
                    <form onSubmit={applyFilter} className="flex flex-wrap items-end gap-3">
                        <div className="grid min-w-56 gap-1">
                            <Label htmlFor="movement_product">المنتج</Label>
                            <select
                                id="movement_product"
                                className="flex-1 rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                value={data.product_id}
                                onChange={(e) => setData('product_id', e.target.value)}
                            >
                                <option value="">اختر منتج...</option>
                                {products.map((product) => (
                                    <option key={product.id} value={product.id}>
                                        {product.name} - {product.category?.name || 'غير محدد'}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
                            عرض الحركة
                        </button>
                    </form>
                </div>

                {selectedProduct && transactions && (
                    <div className="rounded-lg bg-white shadow">
                        <div className="border-b p-6">
                            <h2 className="text-lg font-semibold">حركة المنتج المحدد</h2>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gray-50 dark:bg-slate-800">
                                    <tr>
                                        <th className="px-6 py-3 text-start text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-slate-300">
                                            التاريخ
                                        </th>
                                        <th className="px-6 py-3 text-start text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-slate-300">
                                            النوع
                                        </th>
                                        <th className="px-6 py-3 text-start text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-slate-300">
                                            الكمية
                                        </th>
                                        <th className="px-6 py-3 text-start text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-slate-300">
                                            المخزن
                                        </th>
                                        <th className="px-6 py-3 text-start text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-slate-300">
                                            المرجع
                                        </th>
                                        <th className="px-6 py-3 text-start text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-slate-300">
                                            الإجراءات
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {transactions.data?.map((transaction) => (
                                        <tr key={transaction.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                                                {new Date(transaction.transacted_at).toLocaleDateString('ar-SA')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                                                        ['purchase', 'transfer_in', 'stock_count', 'adjustment'].includes(transaction.type)
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                    }`}
                                                >
                                                    {['purchase', 'transfer_in', 'stock_count', 'adjustment'].includes(transaction.type)
                                                        ? 'وارد'
                                                        : 'صادر'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">{transaction.quantity}</td>
                                            <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                                                {transaction.warehouse?.name || 'غير محدد'}
                                            </td>
                                            <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                                                {(() => {
                                                    const type = transaction.reference_type;
                                                    const id = transaction.reference_id;
                                                    if (!type || !id) return '—';
                                                    // Normalize model names
                                                    if (type.includes('Purchase')) {
                                                        return (
                                                            <Link className="text-blue-600 hover:text-blue-800" href={route('purchases.show', id)}>
                                                                فاتورة شراء #{transaction.reference_invoice_number ?? id}
                                                            </Link>
                                                        );
                                                    }
                                                    if (type.includes('Sale')) {
                                                        return (
                                                            <Link className="text-blue-600 hover:text-blue-800" href={route('sales.show', id)}>
                                                                فاتورة بيع #{transaction.reference_invoice_number ?? id}
                                                            </Link>
                                                        );
                                                    }
                                                    if (type.includes('StockCount')) {
                                                        return (
                                                            <Link className="text-blue-600 hover:text-blue-800" href={route('stock-counts.show', id)}>
                                                                جرد مخزون #{id}
                                                            </Link>
                                                        );
                                                    }
                                                    if (type.includes('Adjustment')) {
                                                        return (
                                                            <Link className="text-blue-600 hover:text-blue-800" href={route('adjustments.show', id)}>
                                                                تسوية #{id}
                                                            </Link>
                                                        );
                                                    }
                                                    if (type.includes('Transfer')) {
                                                        return (
                                                            <Link className="text-blue-600 hover:text-blue-800" href={route('transfers.show', id)}>
                                                                تحويل #{id}
                                                            </Link>
                                                        );
                                                    }
                                                    return `${type} #${id}`;
                                                })()}
                                            </td>
                                            <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                                                {(() => {
                                                    const type = transaction.reference_type;
                                                    const id = transaction.reference_id;
                                                    if (type && id) {
                                                        if (type.includes('Purchase')) {
                                                            return (
                                                                <Link
                                                                    className="text-blue-600 hover:text-blue-800"
                                                                    href={route('purchases.show', id)}
                                                                >
                                                                    عرض التفاصيل
                                                                </Link>
                                                            );
                                                        }
                                                        if (type.includes('Sale')) {
                                                            return (
                                                                <Link className="text-blue-600 hover:text-blue-800" href={route('sales.show', id)}>
                                                                    عرض التفاصيل
                                                                </Link>
                                                            );
                                                        }
                                                        if (type.includes('StockCount')) {
                                                            return (
                                                                <Link
                                                                    className="text-blue-600 hover:text-blue-800"
                                                                    href={route('stock-counts.show', id)}
                                                                >
                                                                    عرض التفاصيل
                                                                </Link>
                                                            );
                                                        }
                                                        if (type.includes('Adjustment')) {
                                                            return (
                                                                <Link
                                                                    className="text-blue-600 hover:text-blue-800"
                                                                    href={route('adjustments.show', id)}
                                                                >
                                                                    عرض التفاصيل
                                                                </Link>
                                                            );
                                                        }
                                                        if (type.includes('Transfer')) {
                                                            return (
                                                                <Link
                                                                    className="text-blue-600 hover:text-blue-800"
                                                                    href={route('transfers.show', id)}
                                                                >
                                                                    عرض التفاصيل
                                                                </Link>
                                                            );
                                                        }
                                                    }
                                                    return (
                                                        <Link
                                                            className="text-blue-600 hover:text-blue-800"
                                                            href={route('reports.product-movement.show', transaction.product_id)}
                                                        >
                                                            عرض التفاصيل
                                                        </Link>
                                                    );
                                                })()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {transactions.data?.length === 0 && <div className="py-8 text-center text-gray-500">لا توجد حركة لهذا المنتج</div>}
                    </div>
                )}
            </div>
        </>
    );
}

// Apply app layout
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(ProductMovementIndex as any).layout = (page: any) => {
    const crumbs: BreadcrumbItem[] = [
        { title: 'التقارير', href: route('reports.index') },
        { title: 'حركة المنتجات', href: route('reports.product-movement.index') },
    ];
    return <AppLayout breadcrumbs={crumbs}>{page}</AppLayout>;
};
