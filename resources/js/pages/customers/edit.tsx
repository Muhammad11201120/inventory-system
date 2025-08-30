import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

type Customer = { id: number; name: string; email?: string | null; phone?: string | null; address?: string | null };

export default function CustomerEdit() {
    const { props } = usePage<{ customer: Customer }>();
    const customer = props.customer;
    const { data, setData, put, processing, errors } = useForm({
        name: customer.name,
        email: customer.email ?? '',
        phone: customer.phone ?? '',
        address: customer.address ?? '',
    });
    function submit(e: React.FormEvent) {
        e.preventDefault();
        put(route('customers.update', customer.id));
    }
    // breadcrumbs are provided via layout below

    return (
        <>
            <Head title={`تعديل عميل #${customer.id}`} />
            <div className="max-w-2xl p-6">
                <h1 className="mb-4 text-xl font-semibold">تعديل عميل</h1>
                <form onSubmit={submit} className="space-y-3">
                    <div className="grid gap-2">
                        <label htmlFor="customer_name" className="text-sm font-medium">الاسم</label>
                        <input id="customer_name" className="w-full border p-2" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                        {errors.name && <div className="text-sm text-red-600">{errors.name}</div>}
                    </div>
                    <div className="grid gap-2">
                        <label htmlFor="customer_email" className="text-sm font-medium">البريد الإلكتروني</label>
                        <input id="customer_email" className="w-full border p-2" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                        <label htmlFor="customer_phone" className="text-sm font-medium">الهاتف</label>
                        <input id="customer_phone" className="w-full border p-2" value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                        <label htmlFor="customer_address" className="text-sm font-medium">العنوان</label>
                        <input id="customer_address" className="w-full border p-2" value={data.address} onChange={(e) => setData('address', e.target.value)} />
                    </div>
                    <div className="flex gap-2">
                        <button disabled={processing} className="rounded bg-black px-4 py-2 text-white">
                            تحديث
                        </button>
                        <Link href={route('customers.index')} className="rounded border px-4 py-2">
                            إلغاء
                        </Link>
                    </div>
                </form>
            </div>
        </>
    );
}

// Apply app layout
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(CustomerEdit as any).layout = (page: any) => {
    const { customer } = page.props;
    const crumbs: BreadcrumbItem[] = [
        { title: 'العملاء', href: route('customers.index') },
        { title: `تعديل #${customer.id}`, href: route('customers.edit', customer.id) },
    ];
    return <AppLayout breadcrumbs={crumbs}>{page}</AppLayout>;
};
