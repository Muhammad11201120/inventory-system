<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $permissions = [
            'products.view',
            'products.create',
            'products.update',
            'products.delete',
            'categories.manage',
            'units.manage',
            'suppliers.manage',
            'customers.manage',
            'purchases.manage',
            'sales.manage',
            'stock.view',
            'stock.adjust',
            'stock.count',
            'stock.transfer',
            'reports.view',
            'settings.manage',
            'users.manage',
        ];

        foreach ($permissions as $name) {
            Permission::firstOrCreate(['name' => $name, 'guard_name' => 'web']);
        }

        $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $adminRole->syncPermissions(Permission::all());

        // Manager: all permissions except managing users
        $managerRole = Role::firstOrCreate(['name' => 'manager', 'guard_name' => 'web']);
        $managerAllowed = Permission::whereNotIn('name', ['users.manage'])->get();
        $managerRole->syncPermissions($managerAllowed);

        // Read-only user role (primarily routed via role in routes for GET access)
        $userRole = Role::firstOrCreate(['name' => 'user', 'guard_name' => 'web']);
        $userRole->syncPermissions(Permission::whereIn('name', ['products.view', 'stock.view', 'reports.view'])->get());

        $user = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Administrator',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]
        );
        $user->assignRole($adminRole);

        // Seed inventory-related data
        $this->call([
            InventorySeeder::class,
        ]);
    }
}
