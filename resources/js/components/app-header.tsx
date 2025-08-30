import AppearanceToggleDropdown from '@/components/appearance-dropdown';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Icon } from '@/components/icon';
import LanguageDropdown from '@/components/language-dropdown';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem, type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, Home, LayoutGrid, LogOut, Menu, Search, User } from 'lucide-react';
import AppLogo from './app-logo';
import AppLogoIcon from './app-logo-icon';

const mainNavItems: NavItem[] = [
    {
        title: 'Home',
        href: '/',
        icon: Home,
    },
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
];

const rightNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

const activeItemStyles = 'text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100';

interface AppHeaderProps {
    breadcrumbs?: BreadcrumbItem[];
    /**
     * When true, show the burger icon on desktop screens too (not only mobile).
     */
    showBurgerOnDesktop?: boolean;
}

export function AppHeader({ breadcrumbs = [], showBurgerOnDesktop = false }: AppHeaderProps) {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const getInitials = useInitials();
    const isBurgerOnlyPage = page.url === '/' || page.url.startsWith('/dashboard');
    const showBurgerOnDesktopFinal = showBurgerOnDesktop || isBurgerOnlyPage;
    return (
        <>
            <div className="border-b border-sidebar-border/80">
                <div className="mx-auto grid h-16 grid-cols-3 items-center px-4 md:max-w-7xl">
                    {/* Left: Mobile Menu + Logo */}
                    <div className="flex items-center gap-2">
                        {/* Burger / Mobile Menu */}
                        <Sheet>
                            {/* Mobile-only trigger */}
                            <div className="lg:hidden">
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="mr-2 h-[34px] w-[34px]">
                                        <Menu className="h-5 w-5" />
                                    </Button>
                                </SheetTrigger>
                            </div>
                            {/* Optional desktop trigger */}
                            {showBurgerOnDesktopFinal && (
                                <div className="hidden lg:block">
                                    <SheetTrigger asChild>
                                        <Button variant="ghost" size="icon" className="mr-2 h-[34px] w-[34px]">
                                            <Menu className="h-5 w-5" />
                                        </Button>
                                    </SheetTrigger>
                                </div>
                            )}
                            <SheetContent
                                side="left"
                                className="flex h-full w-72 flex-col items-stretch justify-between border-r border-slate-200 bg-white sm:w-80 dark:border-slate-700 dark:bg-slate-900"
                            >
                                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                                <SheetHeader className="flex justify-start text-left">
                                    <AppLogoIcon className="h-6 w-6 fill-current text-black dark:text-white" />
                                </SheetHeader>
                                <div className="flex h-full flex-1 flex-col space-y-4 p-4">
                                    <div className="flex h-full flex-col justify-between text-sm">
                                        <div className="flex flex-col space-y-2">
                                            <div className="px-2 text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                                القائمة الرئيسية
                                            </div>
                                            {mainNavItems.map((item) => (
                                                <SheetClose asChild key={item.title}>
                                                    <Link
                                                        href={item.href}
                                                        className="flex items-center gap-3 rounded-md px-2 py-2.5 font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
                                                    >
                                                        {item.icon && <Icon iconNode={item.icon} className="h-5 w-5 text-slate-500" />}
                                                        <span>{item.title}</span>
                                                    </Link>
                                                </SheetClose>
                                            ))}
                                        </div>

                                        <div className="flex flex-col space-y-2">
                                            <div className="px-2 text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                                روابط خارجية
                                            </div>
                                            {rightNavItems.map((item) => (
                                                <SheetClose asChild key={item.title}>
                                                    <a
                                                        href={item.href}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-3 rounded-md px-2 py-2.5 font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
                                                    >
                                                        {item.icon && <Icon iconNode={item.icon} className="h-5 w-5 text-slate-500" />}
                                                        <span>{item.title}</span>
                                                    </a>
                                                </SheetClose>
                                            ))}
                                        </div>

                                        <div className="flex flex-col space-y-2">
                                            <div className="px-2 text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                                الحساب
                                            </div>

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
                                                    <LayoutGrid className="h-5 w-5 text-slate-500" />
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
                                        </div>

                                        <div className="flex flex-col space-y-2">
                                            <div className="px-2 text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                                الإعدادات
                                            </div>
                                            <div className="flex items-center gap-2 rounded-md px-2 py-1.5">
                                                <LanguageDropdown />
                                            </div>
                                            <div className="flex items-center gap-2 rounded-md px-2 py-1.5">
                                                <AppearanceToggleDropdown />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>

                        <Link href="/dashboard" prefetch className="flex items-center space-x-2">
                            <AppLogo />
                        </Link>
                    </div>

                    {/* Center: Desktop Navigation */}
                    {!isBurgerOnlyPage && (
                        <div className="hidden h-full items-center justify-center space-x-6 lg:flex">
                            <NavigationMenu className="flex h-full items-stretch">
                                <NavigationMenuList className="flex h-full items-stretch space-x-2">
                                    {mainNavItems.map((item, index) => (
                                        <NavigationMenuItem key={index} className="relative flex h-full items-center">
                                            <Link
                                                href={item.href}
                                                className={cn(
                                                    navigationMenuTriggerStyle(),
                                                    page.url === item.href && activeItemStyles,
                                                    'h-9 cursor-pointer px-3',
                                                )}
                                            >
                                                {item.icon && <Icon iconNode={item.icon} className="mr-2 h-4 w-4" />}
                                                {item.title}
                                            </Link>
                                            {page.url === item.href && (
                                                <div className="absolute bottom-0 left-0 h-0.5 w-full translate-y-px bg-black dark:bg-white"></div>
                                            )}
                                        </NavigationMenuItem>
                                    ))}
                                </NavigationMenuList>
                            </NavigationMenu>
                        </div>
                    )}

                    {/* Right: Actions */}
                    <div className="flex items-center justify-end space-x-2">
                        <LanguageDropdown className="hidden lg:flex" />
                        <AppearanceToggleDropdown className="hidden lg:flex" />
                        <div className="relative flex items-center space-x-1">
                            <Button variant="ghost" size="icon" className="group h-9 w-9 cursor-pointer">
                                <Search className="!size-5 opacity-80 group-hover:opacity-100" />
                            </Button>
                            {!isBurgerOnlyPage && (
                                <div className="hidden lg:flex">
                                    {rightNavItems.map((item) => (
                                        <TooltipProvider key={item.title} delayDuration={0}>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <a
                                                        href={item.href}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="group ml-1 inline-flex h-9 w-9 items-center justify-center rounded-md bg-transparent p-0 text-sm font-medium text-accent-foreground ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                                                    >
                                                        <span className="sr-only">{item.title}</span>
                                                        {item.icon && (
                                                            <Icon iconNode={item.icon} className="size-5 opacity-80 group-hover:opacity-100" />
                                                        )}
                                                    </a>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{item.title}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    ))}
                                </div>
                            )}
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="size-10 rounded-full p-1">
                                    <Avatar className="size-8 overflow-hidden rounded-full">
                                        <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                                        <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                            {getInitials(auth.user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                                <UserMenuContent user={auth.user} />
                                <div className="mt-1 border-t border-slate-200 dark:border-slate-700" />
                                <div className="p-1">
                                    <Link
                                        href={route('home')}
                                        className="flex items-center gap-2 rounded px-2 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700"
                                    >
                                        <Home className="h-4 w-4" /> Home
                                    </Link>
                                    <Link
                                        href={route('profile.edit')}
                                        className="mt-1 flex items-center gap-2 rounded px-2 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700"
                                    >
                                        <User className="h-4 w-4" /> Profile
                                    </Link>
                                    <Link
                                        method="post"
                                        href={route('logout')}
                                        as="button"
                                        className="mt-1 flex w-full items-center gap-2 rounded px-2 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700"
                                    >
                                        <LogOut className="h-4 w-4" /> Logout
                                    </Link>
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
            {breadcrumbs.length > 1 && (
                <div className="flex w-full border-b border-sidebar-border/70">
                    <div className="mx-auto flex h-12 w-full items-center justify-start px-4 text-neutral-500 md:max-w-7xl">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}
        </>
    );
}
