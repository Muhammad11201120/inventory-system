<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Category>
 */
class CategoryFactory extends Factory
{
    protected $model = Category::class;

    public function definition(): array
    {
        $arabicCategories = [
            'إلكترونيات', 'أجهزة منزلية', 'مواد غذائية', 'مشروبات', 'ملابس', 'أحذية', 'إكسسوارات',
            'مستلزمات مكتبية', 'تصنيف عام', 'أدوات بناء', 'مستحضرات تجميل', 'منظفات', 'أدوية',
        ];

        return [
            'name' => $this->faker->randomElement($arabicCategories),
            'parent_id' => null,
        ];
    }
}


