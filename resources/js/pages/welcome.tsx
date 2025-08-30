import { AppShell } from '@/components/app-shell';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import type { SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, BarChart3, CheckCircle2, Package, QrCode, ShieldCheck, Sparkles, Users2, Warehouse } from 'lucide-react';
import type { ReactNode } from 'react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Inventory System" />

            {/* Background */}
            <AppShell variant="header">
                <div className="relative isolate min-h-screen overflow-hidden bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
                    <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(40rem_20rem_at_80%_-10%,theme(colors.amber.300/0.25),transparent),radial-gradient(35rem_25rem_at_-10%_10%,theme(colors.sky.300/0.25),transparent)] dark:bg-[radial-gradient(40rem_20rem_at_80%_-10%,theme(colors.amber.500/0.10),transparent),radial-gradient(35rem_25rem_at_-10%_10%,theme(colors.fuchsia.500/0.10),transparent)]" />

                    {/* Header */}
                    <AppSidebarHeader showSidebarTrigger={false} />

                    {/* Hero */}
                    <section className="container mx-auto px-6 pt-8 pb-8 md:pt-10 md:pb-16">
                        <div className="grid items-center gap-10 md:grid-cols-2">
                            <div className="space-y-6">
                                <div className="inline-flex w-fit items-center gap-2 rounded-full border bg-white/70 px-3 py-1 text-sm text-slate-700 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200">
                                    <Sparkles className="h-4 w-4 text-amber-500" />
                                    <span>حل متكامل للشركات الصغيرة والمتوسطة</span>
                                </div>
                                <h1 className="font-almarai text-3xl leading-tight md:text-5xl">منصة احترافية لإدارة المخزون والمبيعات بسهولة</h1>
                                <p className="text-slate-600 md:text-lg dark:text-slate-300">
                                    تتبع المنتجات، المشتريات، المبيعات، المستودعات، العملاء والموردين. تقارير دقيقة، أمان عالٍ، ودعم RTL كامل.
                                </p>
                                <div className="flex flex-wrap items-center gap-3">
                                    <Link
                                        href={auth.user ? route('dashboard') : route('register')}
                                        className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-5 py-2.5 text-white shadow hover:opacity-90 dark:bg-white dark:text-black"
                                    >
                                        {auth.user ? 'الذهاب إلى لوحة التحكم' : 'إبدأ الآن'}
                                        <ArrowLeft className="h-4 w-4" />
                                    </Link>
                                    {!auth.user && (
                                        <Link
                                            href={route('login')}
                                            className="rounded-lg border px-5 py-2.5 hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-800"
                                        >
                                            تسجيل الدخول
                                        </Link>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-6 text-sm text-slate-600 dark:text-slate-300">
                                    <Stat label="منتجات" value="+5K" />
                                    <Stat label="تقارير" value="+20" />
                                    <Stat label="مخازن" value="متعدد" />
                                </div>
                            </div>
                            <div className="relative" id="hero-image">
                                <img
                                    src="/hero.png"
                                    alt="Inventory system overview"
                                    className="aspect-video w-full rounded-xl border bg-white/70 object-contain shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/60"
                                />
                                <div className="absolute -inset-6 -z-10 rounded-2xl bg-gradient-to-tr from-amber-300/30 via-fuchsia-300/30 to-sky-300/30 blur-2xl dark:from-amber-500/10 dark:via-fuchsia-500/10 dark:to-sky-500/10" />
                            </div>
                        </div>
                    </section>

                    {/* Features */}
                    <section className="container mx-auto px-6 py-10 md:py-14">
                        <div className="mb-6 text-center">
                            <h2 className="font-almarai text-center text-2xl md:text-right md:text-3xl">كل ما تحتاجه لإدارة المخزون</h2>
                            <p className="mt-2 text-center text-slate-600 md:text-right dark:text-slate-300">
                                خصائص قوية مع واجهة عصرية وسهلة الاستخدام
                            </p>
                        </div>
                        <div className="grid w-full items-center gap-6 md:grid-cols-2 lg:grid-cols-4">
                            <Feature icon={<Warehouse className="h-6 w-6" />} title="إدارة المستودعات" desc="مستودعات متعددة وتحويلات دقيقة" />
                            <Feature icon={<Package className="h-6 w-6" />} title="المنتجات والمخزون" desc="وحدات، باركود، تنبيهات إعادة الطلب" />
                            <Feature icon={<BarChart3 className="h-6 w-6" />} title="تقارير ولوحة" desc="مبيعات يومية/شهرية وأرباح وخسائر" />
                            <Feature icon={<ShieldCheck className="h-6 w-6" />} title="أمان وصلاحيات" desc="أدوار وصلاحيات، سجل نشاط" />
                        </div>
                    </section>

                    {/* Highlights */}
                    <section className="container mx-auto px-6 py-6 md:py-10">
                        <div className="grid items-center gap-8 md:grid-cols-2">
                            <div className="order-2 space-y-4 md:order-1">
                                <h3 className="font-almarai text-center text-xl md:text-right md:text-2xl">تتبع دقيق وسريع لحركة الأصناف</h3>
                                <ul className="space-y-3 text-slate-600 dark:text-slate-300">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-500" /> تنبيهات حد إعادة الطلب
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-500" /> دعم الباركود و QR{' '}
                                        <QrCode className="ml-1 inline h-4 w-4 opacity-70" />
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-500" /> صلاحيات مرنة للمستخدمين
                                    </li>
                                </ul>
                            </div>
                            <div className="relative order-1 md:order-2">
                                <img
                                    src="/dashboard-preview.png"
                                    alt="لوحة التحكم"
                                    className="w-full rounded-xl border border-slate-800 bg-white/70 object-cover shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/60"
                                />
                                <div className="pointer-events-none absolute -inset-5 -z-10 rounded-2xl bg-gradient-to-tr from-sky-300/30 via-amber-300/30 to-fuchsia-300/30 blur-2xl dark:from-sky-500/10 dark:via-amber-500/10 dark:to-fuchsia-500/10" />
                            </div>
                        </div>
                    </section>

                    {/* How it works */}
                    <section className="container mx-auto px-6 py-8 md:py-12">
                        <div className="mb-8 text-center">
                            <h3 className="font-almarai text-center text-xl md:text-right md:text-2xl">كيف تعمل المنصة؟</h3>
                            <p className="mt-2 text-slate-600 dark:text-slate-300">3 خطوات للانطلاق بسرعة</p>
                        </div>
                        <div className="grid gap-6 md:grid-cols-3">
                            <Step number={1} title="أضف بياناتك" desc="المنتجات، الوحدات، الموردين والعملاء" />
                            <Step number={2} title="ابدأ العمليات" desc="المشتريات، المبيعات، التحويلات والجرد" />
                            <Step number={3} title="حلل النتائج" desc="تقارير يومية/شهرية وأرباح وخسائر" />
                        </div>
                    </section>

                    {/* CTA */}
                    <section className="container mx-auto px-6 pb-20">
                        <div className="rounded-2xl bg-gradient-to-r from-slate-800 via-slate-800 to-gray-800 p-6 text-white shadow-lg dark:from-white dark:to-slate-100 dark:text-black">
                            <div className="flex flex-col items-center justify-between gap-4 md:flex-row md:items-center">
                                <div>
                                    <h3 className="font-almarai text-2xl">ابدأ الآن وأطلق العنان لمخزونك</h3>
                                    <p className="opacity-90">إعداد سريع، تقارير قوية، وتجربة استخدام مريحة</p>
                                </div>
                                <div className="flex gap-3">
                                    <Link
                                        href={auth.user ? route('dashboard') : route('register')}
                                        className="rounded-lg bg-white px-5 py-2.5 text-sm text-black hover:opacity-90 md:text-base dark:bg-black dark:text-white"
                                    >
                                        {auth.user ? 'الذهاب إلى لوحة التحكم' : 'تسجيل حساب جديد'}
                                    </Link>
                                    {!auth.user && (
                                        <Link
                                            href={route('login')}
                                            className="rounded-lg border border-white/30 px-5 py-2.5 text-sm hover:bg-white/10 md:text-base dark:border-black/20 dark:hover:bg-black/10"
                                        >
                                            تسجيل الدخول
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Footer */}
                    <footer className="container mx-auto px-6 pb-10 text-center text-sm text-slate-500 dark:text-slate-400">
                        © {new Date().getFullYear()} Inventory System by Muhammed Issa. All rights reserved.
                    </footer>
                </div>
            </AppShell>
        </>
    );
}

function Feature({ icon, title, desc }: { icon: ReactNode; title: string; desc: string }) {
    return (
        <div className="group rounded-xl border bg-white/70 p-5 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/60">
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-tr from-amber-300/60 to-sky-300/60 text-slate-900 dark:from-amber-500/20 dark:to-sky-500/20 dark:text-white">
                {icon}
            </div>
            <h3 className="font-almarai text-center text-lg">{title}</h3>
            <p className="mt-1 text-center text-sm text-slate-600 dark:text-slate-300">{desc}</p>
        </div>
    );
}

function Stat({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center gap-2">
            <Users2 className="h-4 w-4 opacity-60" />
            <span className="font-medium text-black dark:text-white">{value}</span>
            <span className="opacity-70">{label}</span>
        </div>
    );
}

function Step({ number, title, desc }: { number: number; title: string; desc: string }) {
    return (
        <div className="rounded-xl border bg-white/70 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
            <div className="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white dark:bg-white dark:text-black">
                {number}
            </div>
            <h4 className="font-almarai text-center text-lg">{title}</h4>
            <p className="mt-1 text-center text-sm text-slate-600 dark:text-slate-300">{desc}</p>
        </div>
    );
}
