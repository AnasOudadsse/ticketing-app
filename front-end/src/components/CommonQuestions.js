import React from 'react';
import { 
    Box, 
    Typography, 
    List, 
    ListItem, 
    ListItemText,
    Paper,
    Divider
} from '@mui/material';

const CommonQuestions = ({ onQuestionClick }) => {
    const questions = [
        'How do I access Konosys?',
        'How do I check my grades?',
        'How do I submit an assignment on Canvas?',
        'How do I view my course schedule?',
        'How do I request official documents?'
    ];

    return (
        <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
                Common Questions
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List>
                {questions.map((question, index) => (
                    <ListItem 
                        button 
                        key={index}
                        onClick={() => onQuestionClick(question)}
                        sx={{
                            '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.04)'
                            }
                        }}
                    >
                        <ListItemText 
                            primary={question}
                            primaryTypographyProps={{
                                color: 'primary',
                                sx: { 
                                    '&:hover': {
                                        textDecoration: 'underline'
                                    }
                                }
                            }}
                        />
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
};

export default CommonQuestions; 