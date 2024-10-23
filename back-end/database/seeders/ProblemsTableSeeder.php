<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProblemsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        foreach ($this->getProblemsData() as $problemData) {
            DB::table('problems')->insert($problemData);
        }
    }

    /**
     * Get an array of problems data.
     *
     * @return array
     */
    private function getProblemsData()
    {
        return [
            [
                'name' => 'Network Connectivity Issues',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Software Installation Problems',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Hardware Malfunction',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Account Access Issues',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Data Recovery Requests',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Email Configuration Problems',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Performance Issues',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'System Updates and Upgrades',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Virus or Malware Infections',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Backup and Restore Issues',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];
    }
}
