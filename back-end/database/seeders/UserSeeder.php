<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        foreach ($this->getUsersData() as $userData) {
            User::create($userData);
        }
    }

    /**
     * Get an array of users data.
     *
     * @return array
     */
    private function getUsersData()
    {
        return [
            [
                'name' => 'Admin User',
                'email' => 'admin@example.com',
                'email_verified_at' => now(),
                'password' => Hash::make('password'), // Utiliser un mot de passe sécurisé
                'role' => 'admin',
                'fonction_id' => 1, // Assurez-vous que cette valeur correspond à une fonction existante
                'departement_id' => 1, // Assurez-vous que cette valeur correspond à un département existant
                'localisation_id' => 1, // Assurez-vous que cette valeur correspond à une localisation existante
                'remember_token' => Str::random(10),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Support IT User',
                'email' => 'support@example.com',
                'email_verified_at' => now(),
                'password' => Hash::make('123456'),
                'role' => 'supportIt',
                'fonction_id' => 2,
                'departement_id' => 2,
                'localisation_id' => 2,
                'remember_token' => Str::random(10),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Client User',
                'email' => 'client@example.com',
                'email_verified_at' => now(),
                'password' => Hash::make('123456'),
                'role' => 'client',
                'fonction_id' => 3,
                'departement_id' => 3,
                'localisation_id' => 3,
                'remember_token' => Str::random(10),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];
    }
}
