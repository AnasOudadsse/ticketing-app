<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProblemsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('problems')->insert([
            [
                'name' => 'Cablage',
                'type' => 'Infrastructure',
                'specification' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Commutateur',
                'type' => 'Infrastructure',
                'specification' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Point d\'access',
                'type' => 'Infrastructure',
                'specification' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Routeur',
                'type' => 'Infrastructure',
                'specification' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Biostar',
                'type' => 'Logiciel',
                'specification' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Canvas',
                'type' => 'Logiciel',
                'specification' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Catia',
                'type' => 'Logiciel',
                'specification' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Evalbox',
                'type' => 'Logiciel',
                'specification' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Smooth-Support',
                'type' => 'Logiciel',
                'specification' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Konosys',
                'type' => 'Logiciel',
                'specification' => 'Konosys Finance',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Konosys',
                'type' => 'Logiciel',
                'specification' => 'Konosys Planification',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Konosys',
                'type' => 'Logiciel',
                'specification' => 'Konosys Scolarité',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Konosys',
                'type' => 'Logiciel',
                'specification' => 'Konosys Autre',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Pc Portable',
                'type' => 'Materiel',
                'specification' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => ' Data Show',
                'type' => 'Materiel',
                'specification' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Imprimante',
                'type' => 'Materiel',
                'specification' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Pc Bureau',
                'type' => 'Materiel',
                'specification' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Scanner',
                'type' => 'Materiel',
                'specification' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Tablette',
                'type' => 'Materiel',
                'specification' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],

        ]);
    }
}
