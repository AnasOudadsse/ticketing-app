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
        return [
            ['name' => 'Directeur'],
            ['name' => 'Chef de projet'],
            ['name' => 'Développeur'],
            ['name' => 'Technicien IT'],
            ['name' => 'Responsable RH'],
            ['name' => 'Comptable'],
        ];
    }
}
