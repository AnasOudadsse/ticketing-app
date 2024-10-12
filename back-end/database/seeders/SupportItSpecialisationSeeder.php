<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SupportItSpecialisationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        foreach ($this->getSupportItSpecialisationsData() as $data) {
            DB::table('support_its_specialisations')->insert($data);
        }
    }

    /**
     * Get an array of support_it_specialisations data.
     *
     * @return array
     */
    private function getSupportItSpecialisationsData()
    {
        return [
            [
                'specialisation_id' => 1, // Assurez-vous que cette valeur existe dans la table `specialisations`
                'support_it_id' => 1, // Assurez-vous que cette valeur existe dans la table `support_its`
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'specialisation_id' => 2,
                'support_it_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'specialisation_id' => 3,
                'support_it_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];
    }
}
