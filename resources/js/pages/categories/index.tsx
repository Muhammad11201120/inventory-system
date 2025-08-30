import AppLayout from '@/layouts/app-layout';
import type { SharedData } from '@/types';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'التصنيفات', href: route('categories.index') }];

type CategoryListItem = {
    id: number;
    name: string;
    parent?: { name?: string } | null;
};

type CategoriesPageProps = {
    categories?: { data: CategoryListItem[] };
};

type AuthUserWithAccess = SharedData['auth']['user'] & { roles?: string[]; permissions?: string[] };

export default function CategoriesIndex() {
    const page = usePage<SharedData & CategoriesPageProps>();
    const { auth, ...props } = page.props as SharedData & CategoriesPageProps;
    const categories = props.categories?.data ?? [];
    const authUser = auth?.user as AuthUserWithAccess | undefined;
    const roles: string[] = authUser?.roles ?? [];
    const canManage = roles.includes('admin') || roles.includes('manager');

    return (
        <>
            <Head title="التصنيفات" />
            <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-xl font-semibold">التصنيفات</h1>
                    {canManage && (
                        <Link href={route('categories.create')} className="rounded bg-black px-3 py-2 text-white">
                            تصنيف جديد
                        </Link>
                    )}
                </div>
                <table className="min-w-full border text-sm">
                    <thead className="bg-gray-50 dark:bg-slate-800">
                        <tr>
                            <th className="p-2 text-start">الاسم</th>
                            <th className="p-2 text-start">الأب</th>
                            {canManage && <th className="p-2 text-start">إجراءات</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((c: CategoryListItem) => (
                            <tr key={c.id} className="border-t">
                                <td className="p-2">{c.name}</td>
                                <td className="p-2">{c.parent?.name ?? '-'}</td>
                                {canManage && (
                                    <td className="p-2">
                                        <Link href={route('categories.edit', c.id)} className="text-blue-600">
                                            تعديل
                                        </Link>
                                    </td>
                                )}
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
(CategoriesIndex as any).layout = (page: any) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;
