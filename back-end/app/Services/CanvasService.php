<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CanvasService
{
    protected $baseUrl;
    protected $apiKey;

    public function __construct()
    {
        $this->baseUrl = env('CANVAS_API_URL', 'https://um6p.instructure.com/api/v1');
        $this->apiKey = env('CANVAS_API_KEY');
    }

    public function getCourses($userId)
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Accept' => 'application/json'
            ])->get("{$this->baseUrl}/users/{$userId}/courses", [
                'enrollment_state' => 'active',
                'include' => ['total_scores', 'term']
            ]);

            if ($response->successful()) {
                return $response->json();
            }

            Log::error('Canvas API Error: ' . $response->body());
            return null;
        } catch (\Exception $e) {
            Log::error('Canvas Service Error: ' . $e->getMessage());
            return null;
        }
    }

    public function getAssignments($courseId)
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Accept' => 'application/json'
            ])->get("{$this->baseUrl}/courses/{$courseId}/assignments");

            if ($response->successful()) {
                return $response->json();
            }

            Log::error('Canvas API Error: ' . $response->body());
            return null;
        } catch (\Exception $e) {
            Log::error('Canvas Service Error: ' . $e->getMessage());
            return null;
        }
    }

    public function getGrades($courseId, $userId)
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Accept' => 'application/json'
            ])->get("{$this->baseUrl}/courses/{$courseId}/enrollments", [
                'user_id' => $userId,
                'type' => ['StudentEnrollment']
            ]);

            if ($response->successful()) {
                return $response->json();
            }

            Log::error('Canvas API Error: ' . $response->body());
            return null;
        } catch (\Exception $e) {
            Log::error('Canvas Service Error: ' . $e->getMessage());
            return null;
        }
    }

    public function submitAssignment($courseId, $assignmentId, $userId, $file)
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Accept' => 'application/json'
            ])->post("{$this->baseUrl}/courses/{$courseId}/assignments/{$assignmentId}/submissions", [
                'user_id' => $userId,
                'submission[submission_type]' => 'online_upload',
                'submission[file_ids][]' => $file
            ]);

            if ($response->successful()) {
                return $response->json();
            }

            Log::error('Canvas API Error: ' . $response->body());
            return null;
        } catch (\Exception $e) {
            Log::error('Canvas Service Error: ' . $e->getMessage());
            return null;
        }
    }
} 