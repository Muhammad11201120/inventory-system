<?php

namespace Database\Factories;

use App\Models\Notification;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Notification>
 */
class NotificationFactory extends Factory
{
    protected $model = Notification::class;

    public function definition(): array
    {
        return [
            'type' => $this->faker->randomElement(['low_stock', 'purchase_created', 'sale_created', 'transfer_completed']),
            'data' => json_encode(['message' => $this->faker->sentence()]),
            'read' => $this->faker->boolean(20),
            'notified_at' => $this->faker->dateTimeBetween('-1 months', 'now'),
        ];
    }
}


