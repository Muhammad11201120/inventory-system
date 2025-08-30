<?php

namespace Database\Factories;

use App\Models\Adjustment;
use App\Models\Product;
use App\Models\Warehouse;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Adjustment>
 */
class AdjustmentFactory extends Factory
{
    protected $model = Adjustment::class;

    public function definition(): array
    {
        return [
            'product_id' => Product::query()->inRandomOrder()->value('id'),
            'warehouse_id' => Warehouse::query()->inRandomOrder()->value('id'),
            'quantity' => $this->faker->randomFloat(3, -10, 10),
            'reason' => $this->faker->randomElement(['Damage', 'Shrinkage', 'Correction', 'Expiration']),
            'adjusted_at' => $this->faker->dateTimeBetween('-3 months', 'now'),
        ];
    }
}


