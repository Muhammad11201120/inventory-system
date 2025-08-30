<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\StockCount;
use App\Models\StockCountItem;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<StockCountItem>
 */
class StockCountItemFactory extends Factory
{
    protected $model = StockCountItem::class;

    public function definition(): array
    {
        $system = $this->faker->randomFloat(3, 0, 200);
        $counted = $system + $this->faker->randomFloat(3, -5, 5);

        return [
            'stock_count_id' => StockCount::query()->inRandomOrder()->value('id'),
            'product_id' => Product::query()->inRandomOrder()->value('id'),
            'system_quantity' => $system,
            'counted_quantity' => $counted,
            'difference' => round($counted - $system, 3),
        ];
    }
}


