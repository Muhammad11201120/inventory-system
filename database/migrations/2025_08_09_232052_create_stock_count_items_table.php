<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('stock_count_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('stock_count_id')->constrained('stock_counts')->cascadeOnDelete();
            $table->foreignId('product_id')->constrained('products');
            $table->decimal('system_quantity', 14, 3)->default(0);
            $table->decimal('counted_quantity', 14, 3)->default(0);
            $table->decimal('difference', 14, 3)->default(0);
            $table->timestamps();
            $table->index(['stock_count_id', 'product_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_count_items');
    }
};
