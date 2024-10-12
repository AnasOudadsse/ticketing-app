<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LocalisationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        foreach ($this->getLocalisationsData() as $localisation) {
            DB::table('localisations')->insert($localisation);
        }
    }

    /**
     * Get an array of localisation data.
     *
     * @return array
     */
    private function getLocalisationsData()
    {
        return [
            [
                'name' => 'New York',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Paris',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Tokyo',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Berlin',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'London',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];
    }
}
