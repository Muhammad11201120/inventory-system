<?php

namespace App\Notifications;

use App\Models\Product;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class LowStockNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Product $product,
        public int $currentStock
    ) {}

    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('تنبيه: مخزون منخفض')
            ->greeting('مرحباً ' . $notifiable->name)
            ->line('المنتج ' . $this->product->name . ' وصل إلى حد إعادة الطلب.')
            ->line('المخزون الحالي: ' . $this->currentStock)
            ->line('حد إعادة الطلب: ' . $this->product->reorder_level)
            ->action('عرض المنتج', route('products.show', $this->product))
            ->line('يرجى مراجعة المخز وإعادة الطلب إذا لزم الأمر.');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'product_id' => $this->product->id,
            'product_name' => $this->product->name,
            'current_stock' => $this->currentStock,
            'reorder_level' => $this->product->reorder_level,
            'message' => 'المنتج ' . $this->product->name . ' وصل إلى حد إعادة الطلب',
        ];
    }
}
