<?php

namespace Database\Factories;

use App\Models\Supplier;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Supplier>
 */
class SupplierFactory extends Factory
{
    protected $model = Supplier::class;

    public function definition(): array
    {
        $arabicSuppliers = ['شركة الأفق للتوريد', 'مؤسسة النور التجارية', 'السلام للتوزيع', 'الهدى للمستلزمات', 'الصفا للأغذية'];
        return [
            'name' => $this->faker->randomElement($arabicSuppliers),
            'email' => $this->faker->unique()->safeEmail(),
            'phone' => $this->faker->numerify('05########'),
            'address' => $this->faker->city() . ' - ' . $this->faker->streetAddress(),
            'tax_number' => $this->faker->optional()->numerify('ضريبة-#######'),
        ];
    }
}


