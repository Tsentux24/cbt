<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class RoleAndSuperAdminSeeder extends Seeder
{
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $roles = [
            'SUPERADMIN',
            'SCHOOL ADMIN',
            'GURU',
            'PENGAWAS',
            'OPERATOR',
            'SISWA'
        ];

        foreach ($roles as $role) {
            Role::firstOrCreate(['name' => $role]);
        }

        $superadmin = User::firstOrCreate(
            ['username' => 'superadmin'],
            [
                'name' => 'Super Administrator',
                'email' => 'admin@apexcbt.local',
                'password' => Hash::make('password123'),
            ]
        );

        $superadmin->assignRole('SUPERADMIN');
    }
}
