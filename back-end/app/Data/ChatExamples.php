<?php

namespace App\Data;

class ChatExamples
{
    public static function getExamples(): array
    {
        return [
            [
                'question' => 'How do I check my grades on Konosys?',
                'answer' => 'To check your grades on Konosys:
                1. Log in to your Konosys account at https://konosys.um6p.ma
                2. Click on "Academic Records" in the main menu
                3. Select "Grade Report"
                4. Choose the current semester
                5. Your grades will be displayed by course'
            ],
            [
                'question' => 'How do I submit an assignment on Canvas?',
                'answer' => 'To submit an assignment on Canvas:
                1. Log in to Canvas at https://um6p.instructure.com
                2. Navigate to your course
                3. Click on "Assignments" in the course menu
                4. Find and click on the assignment
                5. Click "Submit Assignment"
                6. Choose your submission type (file upload, text entry, etc.)
                7. Upload your file or enter your text
                8. Click "Submit Assignment" to complete the submission'
            ],
            [
                'question' => 'How do I access Konosys?',
                'answer' => 'To access Konosys:
                1. Go to https://konosys.um6p.ma
                2. Enter your student ID number
                3. Enter your password
                4. Click "Login"
                
                If you have forgotten your password:
                1. Click on "Forgot Password"
                2. Enter your student ID
                3. Follow the instructions sent to your registered email'
            ],
            [
                'question' => 'How do I view my course schedule?',
                'answer' => 'To view your course schedule on Konosys:
                1. Log in to Konosys
                2. Click on "Schedule" in the main menu
                3. Select the current semester
                4. Your schedule will be displayed with:
                   - Course names
                   - Class times
                   - Room numbers
                   - Professor names'
            ],
            [
                'question' => 'How do I request official documents?',
                'answer' => 'To request official documents through Konosys:
                1. Log in to Konosys
                2. Go to "Student Services"
                3. Select "Document Requests"
                4. Choose the type of document you need:
                   - Transcript
                   - Enrollment Certificate
                   - Degree Certificate
                5. Fill out the request form
                6. Submit your request
                7. Pay any applicable fees
                8. Documents will be available for pickup or sent to your address'
            ]
        ];
    }
} 