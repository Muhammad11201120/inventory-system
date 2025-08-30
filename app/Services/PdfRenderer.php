<?php

namespace App\Services;

class PdfRenderer
{
    /**
     * Render a Blade view to a downloadable PDF with Arabic shaping and RTL support.
     */
    public function downloadView(string $view, array $data, string $filename)
    {
        $html = view($view, $data)->render();

        $mpdf = $this->createMpdfInstance();

        // Default direction RTL for Arabic documents (if supported)
        if (method_exists($mpdf, 'SetDirectionality')) {
            $mpdf->SetDirectionality('rtl');
        }

        if (method_exists($mpdf, 'SetTitle')) {
            $mpdf->SetTitle('PDF');
        }

        $mpdf->WriteHTML($html, 2);
        $content = $mpdf->Output('', 'S');

        return response($content, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }

    /**
     * Create an mPDF instance compatible with both v6 and v7+.
     */
    private function createMpdfInstance()
    {
        if (class_exists('Mpdf\\Mpdf')) {
            // mPDF v7+: configure options including Arabic fonts and shaping
            $options = [
                'mode' => 'utf-8',
                'format' => 'A4',
                'margin_top' => 20,
                'margin_bottom' => 20,
                'margin_left' => 15,
                'margin_right' => 15,
                'tempDir' => storage_path('app/mpdf'),
                'default_font' => 'dejavusans',
                'autoScriptToLang' => true,
                'autoLangToFont' => true,
                'useOTL' => 0xFF,
                'useKashida' => 75,
            ];

            $notoRegular = resource_path('fonts/NotoNaskhArabic-Regular.ttf');
            $notoBold = resource_path('fonts/NotoNaskhArabic-Bold.ttf');
            $amiriRegular = resource_path('fonts/Amiri/Amiri-Regular.ttf');
            $amiriBold = resource_path('fonts/Amiri/Amiri-Bold.ttf');

            if (file_exists($notoRegular)) {
                $options['fontdata'] = [
                    'notonaskharabic' => [
                        'R' => $notoRegular,
                        'B' => file_exists($notoBold) ? $notoBold : $notoRegular,
                    ],
                ];
                $options['default_font'] = 'notonaskharabic';
            } elseif (file_exists($amiriRegular)) {
                $options['fontdata'] = [
                    'amiri' => [
                        'R' => $amiriRegular,
                        'B' => file_exists($amiriBold) ? $amiriBold : $amiriRegular,
                    ],
                ];
                $options['default_font'] = 'amiri';
            }

            $class = 'Mpdf\\Mpdf';
            return new $class($options);
        }

        // mPDF v6 fallback (global namespace class name mPDF)
        $class = '\\mPDF';
        $mpdf = new $class('utf-8', 'A4', 0, 'dejavusans', 15, 15, 20, 20);
        if (property_exists($mpdf, 'autoScriptToLang')) {
            $mpdf->autoScriptToLang = true;
        }
        if (property_exists($mpdf, 'autoLangToFont')) {
            $mpdf->autoLangToFont = true;
        }
        return $mpdf;
    }
}
