import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'التصنيفات', href: route('categories.index') },
  { title: 'إضافة', href: route('categories.create') },
];

export default function CategoryCreate() {
  const { props } = usePage<any>();
  const parents = props.parents ?? [];
  const { data, setData, post, processing, errors } = useForm({ name: '', parent_id: '' });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    post(route('categories.store'));
  }

  return (
    <>
    <Head title="إضافة تصنيف" />
    <div className="p-6 max-w-2xl">
      <h1 className="text-xl font-semibold mb-4">إضافة تصنيف</h1>
      <form onSubmit={submit} className="space-y-3">
        <div className="grid gap-1">
          <Label htmlFor="category_name">الاسم</Label>
          <input id="category_name" className="w-full border p-2" value={data.name} onChange={e => setData('name', e.target.value)} />
          {errors.name && <div className="text-red-600 text-sm">{errors.name}</div>}
        </div>
        <div className="grid gap-1">
          <Label htmlFor="category_parent">التصنيف الأب</Label>
          <select id="category_parent" className="w-full border p-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300" value={data.parent_id} onChange={e => setData('parent_id', e.target.value)}>
            <option value="">بدون أب</option>
            {parents.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className="flex gap-2">
          <button disabled={processing} className="px-4 py-2 bg-black text-white rounded">حفظ</button>
          <Link href={route('categories.index')} className="px-4 py-2 border rounded">إلغاء</Link>
        </div>
      </form>
    </div>
    </>
  );
}


// Apply app layout
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(CategoryCreate as any).layout = (page: any) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;
