import '../css/app.css';

import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import AppLayout from './layouts/app-layout';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

function applyDocumentDirection(locale: string | undefined) {
    const isArabic = locale === 'ar';
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
    document.documentElement.lang = isArabic ? 'ar' : 'en';
}

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) => {
        const pages = import.meta.glob('./pages/**/*.tsx');
        const component = resolvePageComponent(`./pages/${name}.tsx`, pages);
        return component.then((module: any) => {
            const pageComponent = module.default;
            // Apply default app layout (header + sidebar) to all pages except auth/* and welcome
            if (!pageComponent.layout && !name.startsWith('auth/') && name !== 'welcome') {
                pageComponent.layout = (page: any) => <AppLayout>{page}</AppLayout>;
            }
            return module;
        });
    },
    setup({ el, App, props }) {
        // Apply on first render
        const initialLocale = (props.initialPage.props as any)?.locale ?? 'ar';
        applyDocumentDirection(initialLocale);

        // Update on each Inertia navigation finish
        router.on('finish', (event: any) => {
            try {
                const nextLocale = (event?.detail?.page?.props as any)?.locale;
                if (nextLocale) applyDocumentDirection(nextLocale);
            } catch {}
        });

        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
