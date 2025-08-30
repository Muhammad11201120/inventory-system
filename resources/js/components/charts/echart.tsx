import type { EChartsOption } from 'echarts';
import EChartsReact from 'echarts-for-react';

type ChartProps = {
    option: EChartsOption;
    height?: number | string;
    className?: string;
};

function isDarkMode(): boolean {
    if (typeof window === 'undefined') return false;
    return document.documentElement.classList.contains('dark');
}

function isRtl(): boolean {
    if (typeof window === 'undefined') return true; // default RTL for Arabic app
    return document.documentElement.dir === 'rtl';
}

export default function EChart({ option, height = 320, className }: ChartProps) {
    const dark = isDarkMode();
    const rtl = isRtl();

    // Base styles for dark/light and RTL layout paddings
    const themedOption: EChartsOption = {
        textStyle: {
            color: dark ? '#e2e8f0' : '#0f172a',
        },
        grid: {
            left: rtl ? 16 : 24,
            right: rtl ? 24 : 16,
            top: 24,
            bottom: 24,
            containLabel: true,
        },
        tooltip: {
            trigger: 'axis',
            backgroundColor: dark ? 'rgba(30,41,59,0.95)' : 'rgba(255,255,255,0.95)',
            borderColor: dark ? '#334155' : '#e2e8f0',
            textStyle: { color: dark ? '#e2e8f0' : '#0f172a' },
            axisPointer: {
                lineStyle: { color: dark ? '#475569' : '#94a3b8' },
            },
            confine: true,
        },
        ...option,
    };

    return <EChartsReact option={themedOption} style={{ height, width: '100%' }} className={className} notMerge={false} lazyUpdate />;
}
