<?php

namespace Database\Factories;

use App\Models\Customer;
use App\Models\Sale;
use App\Models\Warehouse;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Sale>
 */
class SaleFactory extends Factory
{
    protected $model = Sale::class;

    public function definition(): array
    {
        $subtotal = $this->faker->randomFloat(2, 100, 5000);
        $discount = $this->faker->randomFloat(2, 0, $subtotal * 0.1);
        $tax = $this->faker->randomFloat(2, 0, $subtotal * 0.15);
        $total = $subtotal - $discount + $tax;

        return [
            'invoice_number' => 'SO-' . $this->faker->unique()->numerify('########'),
            'customer_id' => Customer::query()->inRandomOrder()->value('id'),
            'warehouse_id' => Warehouse::query()->inRandomOrder()->value('id'),
            'invoice_date' => $this->faker->dateTimeBetween('-6 months', 'now')->format('Y-m-d'),
            'subtotal' => $subtotal,
            'discount' => $discount,
            'tax' => $tax,
            'total' => $total,
            'notes' => $this->faker->optional()->sentence(),
        ];
    }
}


