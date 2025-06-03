<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ChatService
{
    protected $apiKey;
    protected $apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
    protected $listModelsUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
    
    // System context for the chatbot
    protected $systemContext = [
        'role' => 'system',
        'content' => 'You are a helpful assistant for UM6SS students and staff. You have extensive knowledge about UM6SS systems and should provide clear, direct, step-by-step instructions for common tasks. Do not ask follow-up questions unless absolutely necessary.

        For common tasks like submitting assignments, checking grades, or accessing systems, provide complete step-by-step instructions immediately.

        Example of good response for "How do I submit an assignment on Canvas?":
        "To submit an assignment on Canvas:
        1. Log in to Canvas at https://um6p.instructure.com
        2. Navigate to your course
        3. Click on "Assignments" in the course menu
        4. Find and click on the assignment
        5. Click "Submit Assignment"
        6. Choose your submission type (file upload, text entry, etc.)
        7. Upload your file or enter your text
        8. Click "Submit Assignment" to complete the submission"

        Always provide complete instructions first. Only ask follow-up questions if the user specifically indicates they are having trouble with a particular step.

        You have extensive knowledge about:
        1. Konosys:
           - Student portal access and navigation
           - Course registration and management
           - Grade checking and academic records
           - Schedule viewing and management
           - Document requests and submissions
           
        2. Canvas LMS:
           - Course access and navigation
           - Assignment submission
           - Discussion participation
           - Grade viewing
           - Course materials access
           
        3. General UM6SS Information:
           - Academic calendar
           - Important deadlines
           - Campus facilities
           - Student services'
    ];

    public function __construct()
    {
        $this->apiKey = env('GOOGLE_AI_STUDIO_API_KEY');
        if (empty($this->apiKey)) {
            error_log('GOOGLE_AI_STUDIO_API_KEY is not set in .env file');
        }
    }

    public function listAvailableModels()
    {
        try {
            $response = Http::get($this->listModelsUrl . '?key=' . $this->apiKey);
            error_log('Available models: ' . $response->body());
            return $response->json();
        } catch (\Exception $e) {
            error_log('Error listing models: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Run a multi‑turn diagnostic conversation.
     *
     * @param  array  $messageHistory  Each item: ['role'=>'system'|'user'|'assistant', 'content'=>string]
     * @return string  The assistant's reply
     */
    public function diagnose(array $messageHistory): string
    {
        try {
            if (empty($this->apiKey)) {
                throw new \Exception('API key is not set');
            }

            // Add system context to the beginning of the conversation
            $contents = [
                [
                    'role' => 'user',
                    'parts' => [
                        ['text' => $this->systemContext['content']]
                    ]
                ]
            ];

            // Add conversation history
            foreach ($messageHistory as $message) {
                $role = $message['role'] === 'assistant' ? 'model' : 'user';
                
                $contents[] = [
                    'role' => $role,
                    'parts' => [
                        ['text' => $message['content']]
                    ]
                ];
            }

            $requestData = [
                'contents' => $contents,
                'generationConfig' => [
                    'temperature' => 0.3, // Lower temperature for more focused responses
                    'maxOutputTokens' => 1000, // Increased for detailed instructions
                    'topP' => 0.8,
                    'topK' => 40
                ]
            ];

            error_log('Sending request to Gemini API: ' . json_encode($requestData));

            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])->post($this->apiUrl . '?key=' . $this->apiKey, $requestData);

            error_log('Response status: ' . $response->status());
            error_log('Response body: ' . $response->body());

            if ($response->successful()) {
                $data = $response->json();
                if (isset($data['candidates'][0]['content']['parts'][0]['text'])) {
                    return $data['candidates'][0]['content']['parts'][0]['text'];
                }
                throw new \Exception('Unexpected response format: ' . json_encode($data));
            }

            // If we hit rate limits, wait and retry once
            if ($response->status() === 429) {
                sleep(15); // Wait 15 seconds as suggested by the API
                $response = Http::withHeaders([
                    'Content-Type' => 'application/json',
                ])->post($this->apiUrl . '?key=' . $this->apiKey, $requestData);

                if ($response->successful()) {
                    $data = $response->json();
                    if (isset($data['candidates'][0]['content']['parts'][0]['text'])) {
                        return $data['candidates'][0]['content']['parts'][0]['text'];
                    }
                }
            }

            throw new \Exception('API request failed: ' . $response->body());
        } catch (\Exception $e) {
            error_log('Gemini API Error: ' . $e->getMessage());
            error_log('Stack trace: ' . $e->getTraceAsString());
            return 'Sorry, I encountered an error while processing your request. Error: ' . $e->getMessage();
        }
    }
}
