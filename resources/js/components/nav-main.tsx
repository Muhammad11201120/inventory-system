import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { useI18n } from '@/lib/i18n';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    const { t } = useI18n();
    const { isMobile, setOpenMobile } = useSidebar();
    return (
        <SidebarGroup className="px-0 py-0">
            <SidebarMenu className="space-y-1">
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={page.url.startsWith(item.href)}
                            tooltip={{ children: item.title }}
                            className="group w-full justify-start rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-700 dark:hover:text-slate-100"
                        >
                            <Link
                                href={item.href}
                                prefetch
                                className="flex w-full items-center space-x-3 rtl:space-x-reverse"
                                onClick={() => {
                                    if (isMobile) setOpenMobile(false);
                                }}
                            >
                                <div className="h-5 w-5 flex-shrink-0 text-slate-500 transition-colors group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-300">
                                    {item.icon && <item.icon size={20} />}
                                </div>
                                <span className="flex-1 text-start">
                                    {item.i18nKey
                                        ? t(item.i18nKey)
                                        : t(`common.${(item.title as string).toLowerCase().replace(/\s+/g, '')}`) || item.title}
                                </span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
