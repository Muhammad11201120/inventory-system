import AppearanceToggleDropdown from '@/components/appearance-dropdown';
import { Breadcrumbs } from '@/components/breadcrumbs';
import LanguageDropdown from '@/components/language-dropdown';
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type BreadcrumbItem as BreadcrumbItemType, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Home, LayoutDashboardIcon, LogOut, Menu, User } from 'lucide-react';

export function AppSidebarHeader({ breadcrumbs = [], showSidebarTrigger = true }: { breadcrumbs?: BreadcrumbItemType[]; showSidebarTrigger?: boolean }) {
    const { auth } = usePage<SharedData>().props;
    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-slate-200 bg-white px-6 shadow-sm transition-all duration-300 ease-in-out group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4 dark:border-slate-700 dark:bg-slate-800">
            <div className="flex w-full items-center gap-3">
                {showSidebarTrigger && (
                    <SidebarTrigger className="-ml-1 rounded-lg p-1 transition-colors hover:bg-slate-100 dark:hover:bg-slate-700" />
                )}
                <div className="flex-1">
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
                {auth?.user && (
                    <div className="hidden flex-1 items-center justify-center gap-1 md:flex">
                        <Link
                            href={route('home')}
                            className="inline-flex items-center gap-1 rounded px-2 py-1.5 text-sm hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                            <Home className="h-4 w-4" /> الرئيسية
                        </Link>
                        <Link
                            href={route('dashboard')}
                            className="inline-flex items-center gap-1 rounded px-2 py-1.5 text-sm hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                            <LayoutDashboardIcon className="h-4 w-4" /> لوحة التحكم
                        </Link>
                        <Link
                            href={route('profile.edit')}
                            className="inline-flex items-center gap-1 rounded px-2 py-1.5 text-sm hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                            <User className="h-4 w-4" /> الملف الشخصي
                        </Link>
                        <Link
                            method="post"
                            href={route('logout')}
                            as="button"
                            className="inline-flex items-center gap-1 rounded px-2 py-1.5 text-sm hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                            <LogOut className="h-4 w-4" /> تسجيل الخروج
                        </Link>
                    </div>
                )}
                <div className="flex flex-1 items-center justify-end gap-2">
                    {/* Header controls */}
                    <div className="flex items-center gap-2">
                        <LanguageDropdown />
                        <AppearanceToggleDropdown />
                    </div>
                    {/* Mobile combined menu */}
                    <div className="md:hidden">
                        <Sheet>
                            <SheetTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-slate-100 dark:hover:bg-slate-700">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Open menu</span>
                            </SheetTrigger>
                            <SheetContent
                                side="left"
                                className="flex h-full w-72 flex-col justify-between border-r border-slate-200 bg-white sm:w-80 dark:border-slate-700 dark:bg-slate-900"
                            >
                                <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                                <SheetHeader className="px-2 text-left">
                                    <div className="text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">الحساب</div>
                                </SheetHeader>
                                <div className="flex flex-1 flex-col gap-2 px-2 py-2 text-sm">
                                    <SheetClose asChild>
                                        <Link
                                            href={route('home')}
                                            className="flex items-center gap-3 rounded-md px-2 py-2.5 font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
                                        >
                                            <Home className="h-5 w-5 text-slate-500" />
                                            <span>الرئيسية</span>
                                        </Link>
                                    </SheetClose>
                                    <SheetClose asChild>
                                        <Link
                                            href={route('dashboard')}
                                            className="flex items-center gap-3 rounded-md px-2 py-2.5 font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
                                        >
                                            <LayoutDashboardIcon className="h-5 w-5 text-slate-500" />
                                            <span>لوحة التحكم</span>
                                        </Link>
                                    </SheetClose>
                                    <SheetClose asChild>
                                        <Link
                                            href={route('profile.edit')}
                                            className="flex items-center gap-3 rounded-md px-2 py-2.5 font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
                                        >
                                            <User className="h-5 w-5 text-slate-500" />
                                            <span>الملف الشخصي</span>
                                        </Link>
                                    </SheetClose>
                                    <SheetClose asChild>
                                        <Link
                                            method="post"
                                            href={route('logout')}
                                            as="button"
                                            className="flex items-center gap-3 rounded-md px-2 py-2.5 text-left font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
                                        >
                                            <LogOut className="h-5 w-5 text-slate-500" />
                                            <span>تسجيل الخروج</span>
                                        </Link>
                                    </SheetClose>
                                    <div className="mt-3 px-0.5 text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                        الإعدادات
                                    </div>
                                    <div className="flex items-center gap-2 rounded-md px-1 py-1.5">
                                        <span className="text-sm text-slate-600 dark:text-slate-300">اللغة</span>
                                        <LanguageDropdown />
                                    </div>
                                    <div className="flex items-center gap-2 rounded-md px-1 py-1.5">
                                        <span className="text-sm text-slate-600 dark:text-slate-300">المظهر</span>
                                        <AppearanceToggleDropdown />
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    );
}
