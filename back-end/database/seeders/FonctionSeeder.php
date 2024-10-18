<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Fonction;

class FonctionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        foreach ($this->getFonctionsData() as $fonctionData) {
            Fonction::create($fonctionData);
        }
    }

    /**
     * Get an array of fonctions data.
     *
     * @return array
     */
    private function getFonctionsData()
    {
        return             [
                ['name' => 'SI'],
                ['name' => 'IT'],
                ['name' => 'Planification'],
                ['name' => 'Scolarité'],
                ['name' => 'Audio Visuel'],
                ['name' => 'Communication'],
                ['name' => 'Qualité'],
                ['name' => 'Administration'],
                ['name' => 'Admission'],
                ['name' => 'Achat'],
        ];
    }
}
