<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Departement;

class DepartementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        foreach ($this->getDepartementsData() as $departementData) {
            Departement::create($departementData);
        }
    }

    /**
     * Get an array of departements data.
     *
     * @return array
     */
    
    private function getDepartementsData()
    {
        return [
            ['name' => 'UM6SS'],
            ['name' => 'FMC'],
            ['name' => 'MAF'],
            ['name' => 'FMD'],
            ['name' => 'EFM'],
            ['name' => 'FMB'],
            ['name' => 'FM6SIPS'],
            ['name' => 'ESM6ISS'],
            ['name' => 'EIM6P'],
            ['name' => 'EM6SV'],
        ];
    }
}
