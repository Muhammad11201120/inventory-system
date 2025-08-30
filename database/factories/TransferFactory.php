<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\Transfer;
use App\Models\Warehouse;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Transfer>
 */
class TransferFactory extends Factory
{
    protected $model = Transfer::class;

    public function definition(): array
    {
        $from = Warehouse::query()->inRandomOrder()->first();
        $to = Warehouse::query()->whereKeyNot($from?->id)->inRandomOrder()->first() ?? $from;

        return [
            'product_id' => Product::query()->inRandomOrder()->value('id'),
            'from_warehouse_id' => $from?->id,
            'to_warehouse_id' => $to?->id,
            'quantity' => $this->faker->randomFloat(3, 1, 50),
            'transferred_at' => $this->faker->dateTimeBetween('-3 months', 'now'),
        ];
    }
}


