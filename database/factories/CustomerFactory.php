<?php

namespace Database\Factories;

use App\Models\Customer;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Customer>
 */
class CustomerFactory extends Factory
{
    protected $model = Customer::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->name('ar_SA'),
            'email' => $this->faker->unique()->safeEmail(),
            'phone' => $this->faker->numerify('05########'),
            'address' => $this->faker->city() . ' - ' . $this->faker->streetAddress(),
        ];
    }
}


