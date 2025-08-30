<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\Warehouse;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ArabicDemoSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function () {
            // Temporarily disable FK constraints for safe truncation
            Schema::disableForeignKeyConstraints();

            // Remove dependent records to satisfy FK constraints
            DB::table('sale_items')->delete();
            DB::table('purchase_items')->delete();
            DB::table('inventory_transactions')->delete();
            DB::table('stock_count_items')->delete();
            DB::table('stock_counts')->delete();
            DB::table('sales')->delete();
            DB::table('purchases')->delete();
            DB::table('transfers')->delete();
            DB::table('adjustments')->delete();
            DB::table('stock_levels')->delete();

            // Now clear customers and warehouses
            DB::table('customers')->delete();
            DB::table('warehouses')->delete();

            // Seed Arabic warehouses
            Warehouse::insert([
                ['name' => 'المستودع الرئيسي', 'location' => 'الرياض', 'is_default' => true],
                ['name' => 'مستودع جدة', 'location' => 'جدة', 'is_default' => false],
                ['name' => 'مستودع الدمام', 'location' => 'الدمام', 'is_default' => false],
            ]);

            // Seed Arabic customers
            Customer::insert([
                ['name' => 'شركة الهدى للتجارة', 'email' => 'alhuda@example.com', 'phone' => '0551234567', 'address' => 'الرياض - حي النرجس'],
                ['name' => 'مؤسسة السالم', 'email' => 'alsalem@example.com', 'phone' => '0559876543', 'address' => 'جدة - حي الروضة'],
                ['name' => 'متجر الأمانة', 'email' => 'amanah@example.com', 'phone' => '0561122334', 'address' => 'الدمام - حي الشاطئ'],
                ['name' => 'بيت العطور', 'email' => 'perfumehouse@example.com', 'phone' => '0579988776', 'address' => 'مكة - العوالي'],
                ['name' => 'أسواق الخير', 'email' => 'khair@example.com', 'phone' => '0586655443', 'address' => 'المدينة - قرب الحرم'],
            ]);

            // Re-enable FK constraints
            Schema::enableForeignKeyConstraints();
        });
    }
}


