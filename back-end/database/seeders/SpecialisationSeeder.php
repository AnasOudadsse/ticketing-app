<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SpecialisationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('specialisations')->insert([
            ['name' => 'konosys', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'canvas', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'infrastructure', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'demarage_cours', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'evalbox', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'biostar', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'catia', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'office', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'materiel', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
