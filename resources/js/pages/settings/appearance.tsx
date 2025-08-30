import { Head } from '@inertiajs/react';

import AppearanceTabs from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'إعدادات المظهر',
        href: '/settings/appearance',
    },
];

export default function Appearance() {
    return (
        <>
            <Head title="إعدادات المظهر" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="إعدادات المظهر " description="تحديث إعدادت المظهر" />
                    <AppearanceTabs />
                </div>
            </SettingsLayout>
        </>
    );
}

// Assign layout to prevent double header/sidebar
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(Appearance as any).layout = (page: any) => <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>;
