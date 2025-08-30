import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { useI18n } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
    ArrowLeftRight,
    BarChart3,
    Building2,
    ClipboardList,
    CreditCard,
    FileText,
    LayoutGrid,
    Package,
    Plus,
    Ruler,
    Settings,
    ShoppingCart,
    Tags,
    TrendingUp,
    Users,
    Warehouse,
} from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        i18nKey: 'common.dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Warehouses',
        i18nKey: 'common.warehouses',
        href: '/warehouses',
        icon: Warehouse,
    },
    {
        title: 'Products',
        i18nKey: 'common.products',
        href: '/products',
        icon: Package,
    },
    {
        title: 'Categories',
        i18nKey: 'common.categories',
        href: '/categories',
        icon: Tags,
    },
    {
        title: 'Units',
        i18nKey: 'common.units',
        href: '/units',
        icon: Ruler,
    },

    {
        title: 'Suppliers',
        i18nKey: 'common.suppliers',
        href: '/suppliers',
        icon: Building2,
    },
    {
        title: 'Customers',
        i18nKey: 'common.customers',
        href: '/customers',
        icon: Users,
    },
    {
        title: 'Purchases',
        i18nKey: 'common.purchases',
        href: '/purchases',
        icon: ShoppingCart,
    },
    {
        title: 'Sales',
        i18nKey: 'common.sales',
        href: '/sales',
        icon: CreditCard,
    },
    {
        title: 'Transfers',
        i18nKey: 'common.transfers',
        href: '/transfers',
        icon: ArrowLeftRight,
    },
    {
        title: 'Stock Counts',
        i18nKey: 'common.stockCounts',
        href: '/stock-counts',
        icon: ClipboardList,
    },
    {
        title: 'Adjustments',
        i18nKey: 'common.adjustments',
        href: '/adjustments',
        icon: Plus,
    },
    {
        title: 'Reports',
        i18nKey: 'common.reports',
        href: '/reports',
        icon: BarChart3,
    },
    {
        title: 'Users',
        i18nKey: 'common.users',
        href: '/users',
        icon: Users,
    },
    {
        title: 'Settings',
        i18nKey: 'common.settings',
        href: '/settings',
        icon: Settings,
    },
];

const reportsNavItems: NavItem[] = [
    {
        title: 'Daily Sales',
        i18nKey: 'common.dailySales',
        href: '/reports/sales/daily',
        icon: TrendingUp,
    },
    {
        title: 'Monthly Sales',
        i18nKey: 'common.monthlySales',
        href: '/reports/sales/monthly',
        icon: BarChart3,
    },
    {
        title: 'Profit & Loss',
        i18nKey: 'common.profitLoss',
        href: '/reports/profit-loss',
        icon: FileText,
    },
    {
        title: 'Product Movement',
        i18nKey: 'common.productMovement',
        href: '/reports/product-movement',
        icon: ArrowLeftRight,
    },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
    const { t } = useI18n();
    const isRtl = typeof window !== 'undefined' && document?.documentElement?.dir === 'rtl';
    const side: 'left' | 'right' = isRtl ? 'right' : 'left';
    const sideBorderClass = side === 'left' ? 'border-r-0 border-l' : 'border-l-0 border-r';
    const { className, side: sideProp, ...rest } = props;
    const finalSide = (sideProp as 'left' | 'right' | undefined) ?? side;
    return (
        <Sidebar
            side={finalSide}
            collapsible="icon"
            variant="inset"
            className={cn(`${sideBorderClass} bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800`, className)}
            {...rest}
        >
            <SidebarHeader className="border-b border-slate-200 dark:border-slate-700">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="transition-colors hover:bg-slate-100 dark:hover:bg-slate-700">
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="px-3 py-4">
                <div className="space-y-6">
                    {/* القائمة الرئيسية */}
                    <div>
                        <h3 className="mb-3 px-3 text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                            {t('common.mainMenu')}
                        </h3>
                        <NavMain items={mainNavItems} />
                    </div>

                    {/* تقارير متقدمة */}
                    <div>
                        <h3 className="mb-3 px-3 text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                            {t('common.reports')}
                        </h3>
                        <NavMain items={reportsNavItems} />
                    </div>
                </div>
            </SidebarContent>

            <SidebarFooter className="border-t border-slate-200 dark:border-slate-700">
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
