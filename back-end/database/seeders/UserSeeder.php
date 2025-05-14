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
                'email' => 'admin@gmail.com',
                'email_verified_at' => now(),
                'password' => Hash::make('12345678'), // Mot de passe sécurisé
                'role' => 'admin',
                'role_in_creation' => 'admin',
                'fonction_id' => 1,
                'departement_id' => 1, // Assurez-vous que cette valeur correspond à un département existant
                'localisation_id' => 1, // Assurez-vous que cette valeur correspond à une localisation existante
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Support IT User',
                'email' => 'support@gmail.com',
                'email_verified_at' => now(),
                'password' => Hash::make('12345678'),
                'role' => 'supportIt',
                'role_in_creation' => 'supportIt',
                'fonction_id' => 2,
                'departement_id' => 2,
                'localisation_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Client User',
                'email' => 'client@gmail.com',
                'email_verified_at' => now(),
                'password' => Hash::make('12345678'),
                'role' => 'client',
                'role_in_creation' => 'client',
                'fonction_id' => 3,
                'departement_id' => 3,
                'localisation_id' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // [
            //     'name' => 'Mezrioui Hakim',
            //     'email' => 'hmezrioui@gmail.com',
            //     'email_verified_at' => now(),
            //     'password' => Hash::make('12345678'),
            //     'role' => 'admin',
            //     'role_in_creation' => 'admin',
            //     'fonction_id' => 3,
            //     'departement_id' => 3,
            //     'localisation_id' => 3,
            // ],
        ];
    }
}
