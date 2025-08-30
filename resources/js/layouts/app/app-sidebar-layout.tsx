import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { type BreadcrumbItem } from '@/types';
import { type PropsWithChildren } from 'react';

export default function AppSidebarLayout({ children, breadcrumbs = [] }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    const isRtl = typeof window !== 'undefined' && document?.documentElement?.dir === 'rtl';

    return (
        <AppShell variant="sidebar">
            {/* عندما RTL: الشريط يمين => نعرض الشريط أولاً ثم المحتوى */}
            {isRtl ? (
                <>
                    <AppSidebar className="order-1" />
                    <AppContent variant="sidebar" className="order-2 overflow-x-hidden">
                        <AppSidebarHeader breadcrumbs={breadcrumbs} />
                        {children}
                    </AppContent>
                </>
            ) : (
                <>
                    <AppContent variant="sidebar" className="order-1 overflow-x-hidden">
                        <AppSidebarHeader breadcrumbs={breadcrumbs} />
                        {children}
                    </AppContent>
                    <AppSidebar className="order-2" />
                </>
            )}
        </AppShell>
    );
}
