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
        foreach ($this->getSpecialisationsData() as $data) {
            DB::table('specialisations')->insert($data);
        }
    }

    /**
     * Get an array of specialisations data.
     *
     * @return array
     */
    private function getSpecialisationsData()
    {
        return [
            [
                'name' => 'Informatique',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Gestion',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Médecine',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Ingénierie',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Économie',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Droit',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Psychologie',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Biologie',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Chimie',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Mathématiques',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

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
