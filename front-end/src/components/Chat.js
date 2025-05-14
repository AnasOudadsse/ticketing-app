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
            setHistory([...newHistory, { 
                role: 'assistant', 
                content: 'Sorry, I encountered an error while processing your request. Please try again.'
            }]);
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
                                color: msg.role === 'user' ? 'white' : 'black',
                                maxWidth: '80%'
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
                    disabled={loading}
                />
                <Button 
                    variant="contained" 
                    onClick={sendMessage}
                    disabled={loading || !message.trim()}
                >
                    Send
                </Button>
            </Box>
        </Box>
    );
};

export default Chat; 