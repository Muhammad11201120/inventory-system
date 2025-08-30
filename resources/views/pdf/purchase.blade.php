<!doctype html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="utf-8">
    @php
        $notoReg = str_replace('\\', '/', resource_path('fonts/NotoNaskhArabic-Regular.ttf'));
        $notoBold = str_replace('\\', '/', resource_path('fonts/NotoNaskhArabic-Bold.ttf'));
    @endphp
    <style>
        @font-face {
            font-family: 'Noto Naskh Arabic';
            src: url('file://{{ $notoReg }}') format('truetype');
            font-weight: normal;
            font-style: normal;
        }
        @font-face {
            font-family: 'Noto Naskh Arabic';
            src: url('file://{{ $notoBold }}') format('truetype');
            font-weight: bold;
            font-style: normal;
        }
        @page { margin: 20mm 15mm; }
        body { font-family: 'Noto Naskh Arabic', 'Amiri', DejaVu Sans, sans-serif; direction: rtl; unicode-bidi: embed; text-align: right; color: #111; }
        table { width: 100%; border-collapse: collapse; direction: rtl; unicode-bidi: embed; }
        th, td { border: 1px solid #ccc; padding: 6px; font-size: 12px; text-align: right; white-space: nowrap; }
        .ltr { direction: ltr; unicode-bidi: embed; }
    </style>
    <title>فاتورة شراء</title>
    </head>
<body>
    <h2>فاتورة شراء <span class="ltr">#{{ $purchase->invoice_number }}</span></h2>
    @if(!empty($barcodeSvg))
        <div>{!! $barcodeSvg !!}</div>
    @endif
    <p>المورد: {{ $purchase->supplier->name ?? '-' }} | المخزن: {{ $purchase->warehouse->name }}</p>
    <p>التاريخ: <span class="ltr">{{ $purchase->invoice_date }}</span></p>

    <table>
        <thead>
            <tr>
                <th>المنتج</th>
                <th>الكمية</th>
                <th>سعر الوحدة</th>
                <th>الإجمالي</th>
            </tr>
        </thead>
        <tbody>
        @foreach($purchase->items as $item)
            <tr>
                <td>{{ $item->product->name }}</td>
                <td class="ltr">{{ $item->quantity }}</td>
                <td class="ltr">{{ number_format($item->unit_price, 2) }}</td>
                <td class="ltr">{{ number_format($item->line_total, 2) }}</td>
            </tr>
        @endforeach
        </tbody>
    </table>
    <p>الإجمالي: <span class="ltr">{{ number_format($purchase->total, 2) }}</span></p>
</body>
</html>


