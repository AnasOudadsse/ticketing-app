<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class KonosysService
{
    protected $baseUrl;
    protected $apiKey;

    public function __construct()
    {
        $this->baseUrl = env('KONOSYS_API_URL', 'https://konosys.um6p.ma/api');
        $this->apiKey = env('KONOSYS_API_KEY');
    }

    public function getGrades($studentId)
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Accept' => 'application/json'
            ])->get("{$this->baseUrl}/students/{$studentId}/grades");

            if ($response->successful()) {
                return $response->json();
            }

            Log::error('Konosys API Error: ' . $response->body());
            return null;
        } catch (\Exception $e) {
            Log::error('Konosys Service Error: ' . $e->getMessage());
            return null;
        }
    }

    public function getSchedule($studentId, $semester)
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Accept' => 'application/json'
            ])->get("{$this->baseUrl}/students/{$studentId}/schedule", [
                'semester' => $semester
            ]);

            if ($response->successful()) {
                return $response->json();
            }

            Log::error('Konosys API Error: ' . $response->body());
            return null;
        } catch (\Exception $e) {
            Log::error('Konosys Service Error: ' . $e->getMessage());
            return null;
        }
    }

    public function getDocuments($studentId)
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Accept' => 'application/json'
            ])->get("{$this->baseUrl}/students/{$studentId}/documents");

            if ($response->successful()) {
                return $response->json();
            }

            Log::error('Konosys API Error: ' . $response->body());
            return null;
        } catch (\Exception $e) {
            Log::error('Konosys Service Error: ' . $e->getMessage());
            return null;
        }
    }

    public function requestDocument($studentId, $documentType)
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Accept' => 'application/json'
            ])->post("{$this->baseUrl}/students/{$studentId}/documents/request", [
                'type' => $documentType
            ]);

            if ($response->successful()) {
                return $response->json();
            }

            Log::error('Konosys API Error: ' . $response->body());
            return null;
        } catch (\Exception $e) {
            Log::error('Konosys Service Error: ' . $e->getMessage());
            return null;
        }
    }
} 