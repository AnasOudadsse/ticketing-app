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
            ['name' => 'Anfa 1 - Batiment A', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Anfa 1 - Batiment B', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Anfa 1 - Batiment C', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Anfa 1 - Batiment D', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'La ligue arab - Batiment A', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'La ligue arab - Batiment B', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Anfa 2 - FSTS', 'created_at' => now(), 'updated_at' => now()],
        ];
    }
}
