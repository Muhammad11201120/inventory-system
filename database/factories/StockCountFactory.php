<?php

namespace Database\Factories;

use App\Models\StockCount;
use App\Models\Warehouse;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<StockCount>
 */
class StockCountFactory extends Factory
{
    protected $model = StockCount::class;

    public function definition(): array
    {
        return [
            'warehouse_id' => Warehouse::query()->inRandomOrder()->value('id'),
            'count_date' => $this->faker->dateTimeBetween('-3 months', 'now')->format('Y-m-d'),
            'status' => $this->faker->randomElement(['draft', 'in_progress', 'completed']),
            'notes' => $this->faker->optional()->sentence(),
        ];
    }
}


