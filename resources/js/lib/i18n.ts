import { usePage } from '@inertiajs/react';

import ar from '@/locales/ar';
import en from '@/locales/en';

type Dictionary = Record<string, string | Dictionary>;

const dictionaries: Record<string, Dictionary> = { ar, en };

function getValue(obj: Dictionary, path: string): string | Dictionary | undefined {
  return path.split('.').reduce<any>((acc, part) => (acc && typeof acc === 'object' ? acc[part] : undefined), obj);
}

export function translate(locale: string, key: string, params?: Record<string, string | number>): string {
  const dict = dictionaries[locale] || dictionaries.ar;
  let val = getValue(dict, key);
  if (typeof val !== 'string') return key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      val = val.replace(new RegExp(`:{${k}}`, 'g'), String(v));
    }
  }
  return val;
}

export function useI18n() {
  const { props } = usePage<{ locale?: string }>();
  const locale = props.locale || 'ar';
  return {
    locale,
    t: (key: string, params?: Record<string, string | number>) => translate(locale, key, params),
  } as const;
}


