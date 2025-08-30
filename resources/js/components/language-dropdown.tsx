import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { usePage, router } from '@inertiajs/react';
import { Languages } from 'lucide-react';

export default function LanguageDropdown({ className = '' }: { className?: string }) {
  const page = usePage<{ locale?: string }>();
  const current = (page.props.locale as string) || 'ar';

  function switchTo(locale: 'ar' | 'en') {
    if (locale === current) return;
    router.visit(route('locale.switch', { locale }), {
      preserveScroll: true,
      preserveState: false,
      replace: true,
    });
  }

  return (
    <div className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-md">
            <Languages className="h-5 w-5" />
            <span className="sr-only">Change language</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => switchTo('ar')} data-active={current === 'ar'}>
            <span className="flex items-center gap-2">
              العربية
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => switchTo('en')} data-active={current === 'en'}>
            <span className="flex items-center gap-2">
              English
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}


