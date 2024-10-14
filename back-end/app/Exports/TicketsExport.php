<?php

namespace App\Exports;

use App\Models\Ticket;
use Maatwebsite\Excel\Concerns\FromCollection;

class TicketsExport implements FromCollection
{
    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        return Ticket::with('problem')
        ->get()
        ->map(function ($ticket) {
            return [
                'ID' => $ticket->id,
                'Problem Name' => $ticket->problem->name, // Assurez-vous que 'name' est la colonne du nom du problème
                'Description' => $ticket->description,
                'Status' => $ticket->status,
                'Attachment' => $ticket->attachement,
                'Support IT ID' => $ticket->supportItID,
                'Admin ID' => $ticket->adminID,
                'Client ID' => $ticket->clientID,
                'Created At' => $ticket->created_at,
                'Updated At' => $ticket->updated_at,
            ];
        });
    }
        /**
     * En-têtes des colonnes pour l'exportation.
     *
     * @return array
     */
    public function headings(): array
    {
        return [
            'ID',
            'Problem Name',
            'Description',
            'Status',
            'Attachment',
            'Support IT ID',
            'Admin ID',
            'Client ID',
            'Created At',
            'Updated At'
        ];
    }
}
