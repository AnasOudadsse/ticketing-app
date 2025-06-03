# Implementing a Chatbot with Laravel, React, and Google Gemini API

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Backend Setup (Laravel)](#backend-setup)
3. [Frontend Setup (React)](#frontend-setup)
4. [API Integration](#api-integration)
5. [Testing](#testing)
6. [Troubleshooting](#troubleshooting)

## Prerequisites

- PHP 8.1 or higher
- Composer
- Node.js and npm
- Laravel 10.x
- React 18.x
- Google Cloud account with Gemini API access
- API key from Google AI Studio

## Backend Setup

### 1. Create a New Laravel Project
```bash
composer create-project laravel/laravel chatbot-app
cd chatbot-app
```

### 2. Install Required Dependencies
```bash
composer require guzzlehttp/guzzle
```

### 3. Create ChatService
Create a new service class at `app/Services/ChatService.php`:

```php
<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class ChatService
{
    protected $apiKey;
    protected $apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
    
    // System context for the chatbot
    protected $systemContext = [
        'role' => 'system',
        'content' => 'You are a helpful assistant for UM6SS students and staff. You have extensive knowledge about:
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
           - Student services
           
        Always provide clear, step-by-step instructions when explaining processes.
        If you are unsure about specific information, acknowledge the limitation and suggest contacting the relevant department.'
    ];

    public function __construct()
    {
        $this->apiKey = env('GOOGLE_AI_STUDIO_API_KEY');
    }

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

            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
            ])->post($this->apiUrl . '?key=' . $this->apiKey, $requestData);

            if ($response->successful()) {
                $data = $response->json();
                if (isset($data['candidates'][0]['content']['parts'][0]['text'])) {
                    return $data['candidates'][0]['content']['parts'][0]['text'];
                }
                throw new \Exception('Unexpected response format');
            }

            throw new \Exception('API request failed: ' . $response->body());
        } catch (\Exception $e) {
            return 'Sorry, I encountered an error while processing your request. Error: ' . $e->getMessage();
        }
    }
}
```

### 4. Create API Controller
Create a new controller at `app/Http/Controllers/ChatController.php`:

```php
<?php

namespace App\Http\Controllers;

use App\Services\ChatService;
use App\Data\ChatExamples;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    protected $chatService;
    protected $examples;

    public function __construct(ChatService $chatService)
    {
        $this->chatService = $chatService;
        $this->examples = ChatExamples::getExamples();
    }

    public function sendMessage(Request $request)
    {
        $request->validate([
            'message' => 'required|string',
            'history' => 'required|array'
        ]);

        // Check if the question matches any examples
        foreach ($this->examples as $example) {
            if (stripos($request->message, $example['question']) !== false) {
                return response()->json(['response' => $example['answer']]);
            }
        }

        $response = $this->chatService->diagnose($request->history);
        return response()->json(['response' => $response]);
    }
}
```

### 5. Add API Routes
Add the following to `routes/api.php`:

```php
Route::post('/chat', [ChatController::class, 'sendMessage']);
```

### 6. Configure Environment
Add to your `.env` file:
```
GOOGLE_AI_STUDIO_API_KEY=your_api_key_here
```

## Frontend Setup

### 1. Create React Project
```bash
npx create-react-app frontend
cd frontend
npm install axios @mui/material @emotion/react @emotion/styled
```

### 2. Create Chat Component
Create `src/components/Chat.js`:

```jsx
import React, { useState } from 'react';
import { 
    Box, 
    TextField, 
    Button, 
    Paper, 
    Typography,
    CircularProgress
} from '@mui/material';
import axios from 'axios';
import CommonQuestions from './CommonQuestions';

const Chat = () => {
    const [message, setMessage] = useState('');
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!message.trim()) return;

        const newHistory = [...history, { role: 'user', content: message }];
        setHistory(newHistory);
        setMessage('');
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:8000/api/chat', {
                message,
                history: newHistory
            });

            setHistory([...newHistory, { 
                role: 'assistant', 
                content: response.data.response 
            }]);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleQuestionClick = (question) => {
        setMessage(question);
    };

    return (
        <Box sx={{ maxWidth: 800, margin: 'auto', p: 2 }}>
            <CommonQuestions onQuestionClick={handleQuestionClick} />
            <Paper sx={{ p: 2, mb: 2, height: 400, overflow: 'auto' }}>
                {history.map((msg, index) => (
                    <Box 
                        key={index} 
                        sx={{ 
                            mb: 2,
                            textAlign: msg.role === 'user' ? 'right' : 'left'
                        }}
                    >
                        <Typography 
                            sx={{ 
                                display: 'inline-block',
                                p: 1,
                                borderRadius: 1,
                                bgcolor: msg.role === 'user' ? 'primary.main' : 'grey.200',
                                color: msg.role === 'user' ? 'white' : 'black'
                            }}
                        >
                            {msg.content}
                        </Typography>
                    </Box>
                ))}
                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <CircularProgress />
                    </Box>
                )}
            </Paper>
            <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                    fullWidth
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type your message..."
                />
                <Button 
                    variant="contained" 
                    onClick={sendMessage}
                    disabled={loading}
                >
                    Send
                </Button>
            </Box>
        </Box>
    );
};

export default Chat;
```

### 3. Update App.js
Update `src/App.js`:

```jsx
import React from 'react';
import { Container, CssBaseline } from '@mui/material';
import Chat from './components/Chat';

function App() {
  return (
    <>
      <CssBaseline />
      <Container>
        <Chat />
      </Container>
    </>
  );
}

export default App;
```

## API Integration

### 1. CORS Configuration
Update `config/cors.php` in Laravel:

```php
return [
    'paths' => ['api/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:3000'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];
```

### 2. Start the Servers
Backend:
```bash
php artisan serve
```

Frontend:
```bash
npm start
```

## Testing

1. Open your browser to `http://localhost:3000`
2. Type a message in the chat input
3. Press Enter or click Send
4. Verify that you receive a response from the Gemini API

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure CORS is properly configured in Laravel
   - Check that the frontend URL is correctly set in CORS configuration

2. **API Key Issues**
   - Verify the API key is correctly set in `.env`
   - Check if the API key has the necessary permissions

3. **Rate Limiting**
   - The free tier of Gemini API has rate limits
   - Implement retry logic for 429 responses
   - Consider upgrading to a paid plan for higher limits

4. **Response Format Issues**
   - Ensure the message format matches Gemini API requirements
   - Check the response structure in the browser console

### Debugging Tips

1. Enable detailed logging in Laravel:
```php
Log::debug('Request data:', $requestData);
Log::debug('Response:', $response->json());
```

2. Use browser developer tools to monitor network requests
3. Check Laravel logs in `storage/logs/laravel.log`

## Security Considerations

1. Never expose API keys in frontend code
2. Implement proper input validation
3. Use HTTPS in production
4. Implement rate limiting on your API endpoints
5. Sanitize user input before sending to Gemini API

## Production Deployment

1. Set up proper environment variables
2. Configure proper CORS settings for production domain
3. Implement error monitoring
4. Set up proper logging
5. Configure SSL certificates
6. Set up proper backup procedures

## Additional Resources

- [Laravel Documentation](https://laravel.com/docs)
- [React Documentation](https://reactjs.org/docs)
- [Google Gemini API Documentation](https://ai.google.dev/docs)
- [Material-UI Documentation](https://mui.com/getting-started/usage/)

## UM6SS System-Specific Implementation

### 1. System Knowledge Base

The chatbot is configured with specific knowledge about UM6SS systems:

#### Konosys Integration
- Student portal access and navigation
- Course registration and management
- Grade checking and academic records
- Schedule viewing and management
- Document requests and submissions

#### Canvas LMS Integration
- Course access and navigation
- Assignment submission
- Discussion participation
- Grade viewing
- Course materials access

#### General UM6SS Information
- Academic calendar
- Important deadlines
- Campus facilities
- Student services

### 2. Predefined Responses

The system includes a set of predefined responses for common questions:

```php
// app/Data/ChatExamples.php
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
            // ... more examples
        ];
    }
}
```

### 3. Common Questions Interface

The frontend includes a "Common Questions" component that displays frequently asked questions:

```jsx
// front-end/src/components/CommonQuestions.js
const CommonQuestions = ({ onQuestionClick }) => {
    const questions = [
        'How do I access Konosys?',
        'How do I check my grades?',
        'How do I submit an assignment on Canvas?',
        'How do I view my course schedule?',
        'How do I request official documents?'
    ];
    // ... component implementation
};
```

### 4. Response Handling

The system uses a two-tier response system:

1. **Predefined Responses**: For common questions, the system checks against a predefined list of questions and answers.

2. **AI-Generated Responses**: For unique questions, the system uses the Gemini API with specific context about UM6SS systems.

```php
// app/Http/Controllers/ChatController.php
public function sendMessage(Request $request)
{
    // Check for predefined responses
    foreach ($this->examples as $example) {
        if (stripos($request->message, $example['question']) !== false) {
            return response()->json(['response' => $example['answer']]);
        }
    }

    // Fall back to AI-generated response
    $response = $this->chatService->diagnose($request->history);
    return response()->json(['response' => $response]);
}
```

### 5. User Interface Features

The chat interface includes:

1. **Common Questions Panel**
   - Clickable list of frequent questions
   - Auto-fills the chat input
   - Visual feedback on hover

2. **Message Display**
   - User messages aligned to the right
   - Assistant messages aligned to the left
   - Loading indicator during responses
   - Error handling with user-friendly messages

3. **Input Controls**
   - Text input with placeholder
   - Send button
   - Enter key support
   - Disabled state during loading

### 6. Testing the Implementation

1. **Basic Functionality**
   ```bash
   # Start the Laravel server
   php artisan serve

   # Start the React development server
   cd front-end
   npm start
   ```

2. **Test Cases**
   - Access Konosys
   - Check grades
   - Submit assignments
   - View schedules
   - Request documents

3. **Error Scenarios**
   - Invalid credentials
   - System downtime
   - Network issues
   - Rate limiting

### 7. Maintenance and Updates

1. **Adding New Questions**
   - Update `ChatExamples.php` with new Q&A pairs
   - Add new questions to the `CommonQuestions` component
   - Update system context in `ChatService`

2. **Updating System Information**
   - Modify the system context in `ChatService`
   - Update URLs and procedures
   - Add new features and capabilities

3. **Monitoring and Analytics**
   - Track frequently asked questions
   - Monitor response accuracy
   - Identify areas for improvement

### 8. Security Considerations

1. **API Key Protection**
   - Store API keys in `.env`
   - Never expose keys in frontend code
   - Use environment-specific configurations

2. **Input Validation**
   - Validate all user inputs
   - Sanitize messages before processing
   - Implement rate limiting

3. **Error Handling**
   - Log errors appropriately
   - Provide user-friendly error messages
   - Implement retry mechanisms

### 9. Future Enhancements

1. **Planned Features**
   - Multi-language support
   - File attachment handling
   - Rich text formatting
   - User authentication integration

2. **System Integration**
   - Direct Konosys API integration
   - Canvas API integration
   - Calendar system integration

3. **Analytics and Reporting**
   - Usage statistics
   - Response accuracy metrics
   - User satisfaction tracking

## Additional Resources

- [Laravel Documentation](https://laravel.com/docs)
- [React Documentation](https://reactjs.org/docs)
- [Google Gemini API Documentation](https://ai.google.dev/docs)
- [Material-UI Documentation](https://mui.com/getting-started/usage/) 