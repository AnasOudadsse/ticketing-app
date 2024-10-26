<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Ticket;

class TicketsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        foreach ($this->getTicketsData() as $ticketData) {
            Ticket::create($ticketData);
        }
    }

    /**
     * Get an array of tickets data.
     *
     * @return array
     */
    private function getTicketsData()
    {
        return [
            [
                'title' => 'Problème avec le logiciel Biostar',
                'problem_id' => 1, // Assurez-vous que cet ID existe dans la table 'problems'
                'description' => 'Erreur au démarrage du logiciel.',
                'status' => 'opened',
                'created_by' => 1, // Assurez-vous que cet ID existe dans la table 'users'
                'reserved_by' => null,
                'admin_id' => null,
                'attachement' => null,
                'resolution_date' => null,
            ],
            [
                'title' => 'Problème avec Canvas',
                'problem_id' => 2,
                'description' => 'Problème d\'accès à Canvas pour certains utilisateurs.',
                'status' => 'reserved',
                'created_by' => 2,
                'reserved_by' => 3,
                'admin_id' => 1,
                'attachement' => null,
                'resolution_date' => null,
            ],
            [
                'title' => 'Erreur lors de l\'impression',
                'problem_id' => 3,
                'description' => 'L\'imprimante affiche une erreur de bourrage papier.',
                'status' => 'opened',
                'created_by' => 4,
                'reserved_by' => null,
                'admin_id' => null,
                'attachement' => 'document.pdf',
                'resolution_date' => null,
            ],
            [
                'title' => 'Déconnexion fréquente du réseau',
                'problem_id' => 4,
                'description' => 'Les utilisateurs se déconnectent souvent du réseau Wifi.',
                'status' => 'resolved',
                'created_by' => 1,
                'reserved_by' => 5,
                'admin_id' => 1,
                'attachement' => null,
                'resolution_date' => now(),
            ],
            [
                'title' => 'Problème de performance du PC',
                'problem_id' => 5,
                'description' => 'Le PC portable prend trop de temps pour démarrer.',
                'status' => 'closed',
                'created_by' => 3,
                'reserved_by' => 2,
                'admin_id' => 1,
                'attachement' => 'diagnostic_report.docx',
                'resolution_date' => now(),
            ],
        ];
    }
}
