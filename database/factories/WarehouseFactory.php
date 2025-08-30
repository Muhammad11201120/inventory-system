<?php

namespace Database\Factories;

use App\Models\Warehouse;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Warehouse>
 */
class WarehouseFactory extends Factory
{
    protected $model = Warehouse::class;

    public function definition(): array
    {
        return [
            'name' => 'Warehouse ' . $this->faker->unique()->numerify('#'),
            'location' => $this->faker->city(),
            'is_default' => false,
        ];
    }
}


