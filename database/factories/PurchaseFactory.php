<?php

namespace Database\Factories;

use App\Models\Purchase;
use App\Models\Supplier;
use App\Models\Warehouse;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Purchase>
 */
class PurchaseFactory extends Factory
{
    protected $model = Purchase::class;

    public function definition(): array
    {
        $subtotal = $this->faker->randomFloat(2, 100, 5000);
        $discount = $this->faker->randomFloat(2, 0, $subtotal * 0.1);
        $tax = $this->faker->randomFloat(2, 0, $subtotal * 0.15);
        $total = $subtotal - $discount + $tax;

        return [
            'invoice_number' => 'PO-' . $this->faker->unique()->numerify('########'),
            'supplier_id' => Supplier::query()->inRandomOrder()->value('id'),
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


