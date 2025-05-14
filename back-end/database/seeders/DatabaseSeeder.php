<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // \App\Models\User::factory(10)->create();
        $this->call(DepartementSeeder::class);
        $this->call(FonctionSeeder::class);
        $this->call(LocalisationSeeder::class);
        $this->call(SpecialisationSeeder::class);
        $this->call(ProblemsSeeder::class);
        $this->call(UserSeeder::class);
        $this->call(SupportItSeeder::class);
        $this->call(SupportItSpecialisationSeeder::class);
        // $this->call(TicketsTableSeeder::class);
    }
}
