<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Product;
use App\Models\Unit;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        $arabicNames = [
            'هاتف ذكي', 'حاسوب محمول', 'شاحن سريع', 'سماعات لاسلكية', 'سكر أبيض', 'زيت نباتي', 'ماء معدني',
            'قهوة عربية', 'قميص رجالي', 'عباية نسائية', 'حذاء رياضي', 'دفتر ملاحظات', 'قلم حبر',
            'دهان داخلي', 'لوح جبس', 'شامبو للشعر', 'صابون سائل', 'كمامة طبية', 'معقم يدين',
        ];
        $name = $this->faker->randomElement($arabicNames) . ' ' . $this->faker->randomNumber(3);

        return [
            'name' => $name,
            'sku' => strtoupper(Str::random(3)) . '-' . $this->faker->unique()->numerify('#####'),
            'barcode' => $this->faker->optional()->ean13(),
            'category_id' => Category::query()->inRandomOrder()->value('id'),
            'unit_id' => Unit::query()->inRandomOrder()->value('id'),
            'cost_price' => $this->faker->randomFloat(2, 5, 500),
            'sale_price' => $this->faker->randomFloat(2, 10, 800),
            'reorder_level' => $this->faker->numberBetween(5, 50),
            'image_path' => null,
            'is_active' => $this->faker->boolean(95),
        ];
    }
}


