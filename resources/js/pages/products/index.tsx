import AppLayout from '@/layouts/app-layout';
import type { SharedData } from '@/types';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'المنتجات', href: route('products.index') }];

type ProductListItem = {
    id: number;
    name: string;
    sku: string;
    sale_price: number;
    category?: { name?: string } | null;
    unit?: { name?: string } | null;
};

type ProductsPageProps = {
    products?: { data: ProductListItem[] };
};

export default function ProductsIndex() {
    const page = usePage<SharedData & ProductsPageProps>();
    const { auth, ...props } = page.props as SharedData & ProductsPageProps;
    const products = props.products?.data ?? [];

    return (
        <>
            <Head title="المنتجات" />
            <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-xl font-semibold">المنتجات</h1>
                    {(auth?.user as any)?.roles?.includes?.('admin') || (auth?.user as any)?.roles?.includes?.('manager') ? (
                        <Link href={route('products.create')} className="rounded bg-black px-3 py-2 text-white">
                            منتج جديد
                        </Link>
                    ) : null}
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full border text-sm">
                        <thead className="bg-gray-50 dark:bg-slate-800">
                            <tr>
                                <th className="p-2 text-start">الاسم</th>
                                <th className="p-2 text-start">SKU</th>
                                <th className="p-2 text-start">الفئة</th>
                                <th className="p-2 text-start">الوحدة</th>
                                <th className="p-2 text-start">سعر البيع</th>
                                {((auth?.user as any)?.roles?.includes?.('admin') || (auth?.user as any)?.roles?.includes?.('manager')) && (
                                    <th className="p-2 text-start">إجراءات</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((p) => (
                                <tr key={p.id} className="border-t">
                                    <td className="p-2">{p.name}</td>
                                    <td className="p-2">{p.sku}</td>
                                    <td className="p-2">{p.category?.name ?? '-'}</td>
                                    <td className="p-2">{p.unit?.name ?? '-'}</td>
                                    <td className="p-2">{p.sale_price}</td>
                                    {((auth?.user as any)?.roles?.includes?.('admin') || (auth?.user as any)?.roles?.includes?.('manager')) && (
                                        <td className="space-x-2 p-2 rtl:space-x-reverse">
                                            <Link href={route('products.edit', p.id)} className="text-blue-600">
                                                تعديل
                                            </Link>
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
(ProductsIndex as any).layout = (page: any) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;
