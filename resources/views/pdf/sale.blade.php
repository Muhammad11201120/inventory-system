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

        @page {
            margin: 20mm 15mm;
        }

        body {
            font-family: 'Noto Naskh Arabic', 'Amiri', DejaVu Sans, sans-serif;
            direction: rtl;
            unicode-bidi: embed;
            text-align: right;
            color: #111;
        }

        h1,
        h2,
        h3,
        h4 {
            margin: 0 0 8px;
        }

        .header {
            display: block;
            margin-bottom: 12px;
        }

        .meta {
            font-size: 12px;
            color: #444;
            margin-bottom: 8px;
        }

        .row {
            width: 100%;
            display: table;
        }

        .col {
            display: table-cell;
            vertical-align: top;
        }

        .col-6 {
            width: 50%;
        }

        .badge {
            display: inline-block;
            padding: 2px 6px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 11px;
        }

        .barcode {
            margin: 6px 0 10px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            direction: rtl;
            unicode-bidi: embed;
        }

        thead th {
            background: #f5f5f5;
        }

        th,
        td {
            border: 1px solid #ccc;
            padding: 6px;
            font-size: 12px;
            text-align: right;
            white-space: nowrap;
        }

        .totals {
            width: 260px;
            margin-left: auto;
            border: 1px solid #ccc;
            border-radius: 4px;
        }

        .totals .line {
            display: flex;
            justify-content: space-between;
            padding: 6px 8px;
            border-bottom: 1px solid #eee;
            font-size: 12px;
        }

        .totals .line:last-child {
            border-bottom: 0;
            font-weight: 700;
        }

        /* Ensure numbers and Latin content are LTR */
        .ltr {
            direction: ltr;
            unicode-bidi: embed;
        }
    </style>
    <title>فاتورة بيع</title>
</head>

<body>
    <div class="header">
        <h2>فاتورة بيع <span class="ltr">#{{ $sale->invoice_number }}</span></h2>
        @if(!empty($barcodeSvg))
        <div class="barcode">{!! $barcodeSvg !!}</div>
        @endif
    </div>

    <div class="row meta">
        <div class="col col-6">العميل: <span class="badge">{{ $sale->customer->name ?? '-' }}</span></div>
        <div class="col col-6">المخزن: <span class="badge">{{ $sale->warehouse->name ?? '-' }}</span></div>
    </div>
    <div class="row meta" style="margin-bottom: 12px;">
        <div class="col col-6">التاريخ: <span class="ltr">{{ $sale->invoice_date }}</span></div>
        <div class="col col-6">رقم الفاتورة: <span class="ltr">{{ $sale->invoice_number }}</span></div>
    </div>

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
            @foreach($sale->items as $item)
            <tr>
                <td>{{ $item->product->name }}</td>
                <td class="ltr">{{ $item->quantity }}</td>
                <td class="ltr">{{ number_format($item->unit_price, 2) }}</td>
                <td class="ltr">{{ number_format($item->line_total, 2) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
    <div class="totals">
        <div class="line"><span>الإجمالي قبل الخصم</span><span class="ltr">{{ number_format($sale->subtotal, 2) }}</span></div>
        <div class="line"><span>الخصم</span><span class="ltr">{{ number_format($sale->discount ?? 0, 2) }}</span></div>
        <div class="line"><span>الضريبة</span><span class="ltr">{{ number_format($sale->tax ?? 0, 2) }}</span></div>
        <div class="line"><span>الإجمالي</span><span class="ltr">{{ number_format($sale->total, 2) }}</span></div>
    </div>
</body>

</html>