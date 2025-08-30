<?php

namespace Database\Factories;

use App\Models\Unit;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Unit>
 */
class UnitFactory extends Factory
{
    protected $model = Unit::class;

    public function definition(): array
    {
        $name = $this->faker->randomElement(['كيلوغرام', 'غرام', 'لتر', 'قطعة', 'صندوق', 'متر']);
        $symbolMap = [
            'كيلوغرام' => 'كغ',
            'غرام' => 'غ',
            'لتر' => 'ل',
            'قطعة' => 'قط',
            'صندوق' => 'صن',
            'متر' => 'م',
        ];

        return [
            'name' => $name,
            'symbol' => $symbolMap[$name] ?? null,
        ];
    }
}


