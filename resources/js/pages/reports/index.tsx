import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'التقارير', href: route('reports.index') }];

export default function ReportsIndex() {
    return (
        <>
            <Head title="التقارير" />
            <div className="space-y-4 p-6">
                <h1 className="text-xl font-semibold">التقارير</h1>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    <Link href={route('reports.sales.daily')} className="rounded border p-4">
                        مبيعات يومية
                    </Link>
                    <Link href={route('reports.sales.monthly')} className="rounded border p-4">
                        مبيعات شهرية
                    </Link>
                    <Link href={route('reports.product-movement.index')} className="rounded border p-4">
                        حركة صنف
                    </Link>
                    <Link href={route('reports.profit-loss.index')} className="rounded border p-4">
                        الأرباح والخسائر
                    </Link>
                </div>
            </div>
        </>
    );
}

// Apply app layout
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(ReportsIndex as any).layout = (page: any) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;
