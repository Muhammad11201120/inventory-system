import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

type ProductDto = {
    id: number;
    name: string;
    category?: { name?: string } | null;
    barcode?: string | null;
    sale_price?: number | null;
};

type TransactionDto = {
    id: number;
    type: 'purchase' | 'transfer_in' | 'stock_count' | 'adjustment' | 'sale' | 'transfer_out' | string;
    transacted_at: string;
    quantity: number;
    warehouse?: { name?: string } | null;
    reference_type?: string | null;
    reference_id?: number | string | null;
    product_id?: number;
};

type ProductMovementPageProps = {
    product: ProductDto;
    transactions: { data: TransactionDto[] };
};

export default function ProductMovement() {
    const { props } = usePage<ProductMovementPageProps>();
    const { product, transactions } = props;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'التقارير', href: route('reports.index') },
        { title: 'حركة المنتجات', href: route('reports.product-movement.index') },
        { title: product.name, href: route('reports.product-movement.show', product.id) },
    ];

    return (
        <>
        <Head title={`حركة المنتج: ${product.name}`} />
        <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold">حركة المنتج: {product.name}</h1>
                <Link href={route('reports.product-movement.index')} className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600">
                    العودة للتقارير
                </Link>
            </div>

            <div className="mb-6 rounded-lg bg-white p-6 shadow dark:bg-slate-800">
                <h2 className="mb-4 text-lg font-semibold">معلومات المنتج</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <span className="font-medium">الاسم:</span> {product.name}
                    </div>
                    <div>
                        <span className="font-medium">التصنيف:</span> {product.category?.name || 'غير محدد'}
                    </div>
                    <div>
                        <span className="font-medium">الباركود:</span> {product.barcode || 'غير محدد'}
                    </div>
                    <div>
                        <span className="font-medium">سعر البيع:</span> {product.sale_price}
                    </div>
                </div>
            </div>

            <div className="rounded-lg bg-white shadow">
                <div className="border-b p-6">
                    <h2 className="text-lg font-semibold">سجل الحركة</h2>
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
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {transactions.data?.map((transaction: TransactionDto) => (
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
                                            {['purchase', 'transfer_in', 'stock_count', 'adjustment'].includes(transaction.type) ? 'وارد' : 'صادر'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">{transaction.quantity}</td>
                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">{transaction.warehouse?.name || 'غير محدد'}</td>
                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                                        {transaction.reference_type} #{transaction.reference_id}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {transactions.data?.length === 0 && <div className="py-8 text-center text-gray-500">لا توجد حركة لهذا المنتج</div>}
            </div>
        </div>
        </>
    );
}

// Apply app layout
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(ProductMovement as any).layout = (page: any) => {
    const { product } = page.props;
    const crumbs: BreadcrumbItem[] = [
        { title: 'التقارير', href: route('reports.index') },
        { title: 'حركة المنتجات', href: route('reports.product-movement.index') },
        { title: product.name, href: route('reports.product-movement.show', product.id) },
    ];
    return <AppLayout breadcrumbs={crumbs}>{page}</AppLayout>;
};
