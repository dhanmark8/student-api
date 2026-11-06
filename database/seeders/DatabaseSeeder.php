<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $accounts = [
            [
                'name' => 'Admin User',
                'email' => env('SEED_ADMIN_EMAIL', 'admin@example.com'),
                'password' => env('SEED_ADMIN_PASSWORD'),
                'role' => 'administrator',
            ],
            [
                'name' => 'Regular User',
                'email' => env('SEED_USER_EMAIL', 'user@example.com'),
                'password' => env('SEED_USER_PASSWORD'),
                'role' => 'regular_user',
            ],
        ];

        foreach ($accounts as $account) {
            if (empty($account['password'])) {
                throw new \RuntimeException(
                    'Set SEED_ADMIN_PASSWORD and SEED_USER_PASSWORD in .env before seeding.'
                );
            }

            User::updateOrCreate(
                ['email' => $account['email']],
                $account
            );
        }
    }
}
