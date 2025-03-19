document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const apiKeyInput = document.getElementById('api-key');
    const modelSelect = document.getElementById('model-select');
    const temperatureSlider = document.getElementById('temperature');
    const temperatureValue = document.getElementById('temperature-value');
    const topPSlider = document.getElementById('top-p');
    const topPValue = document.getElementById('top-p-value');
    const topKSlider = document.getElementById('top-k');
    const topKValue = document.getElementById('top-k-value');
    const maxTokensInput = document.getElementById('max-tokens');
    const startChatButton = document.getElementById('start-chat');
    const chatSection = document.querySelector('.chat-section');
    const setupSection = document.querySelector('.setup-section');
    const chatHistory = document.getElementById('chat-history');
    const userInput = document.getElementById('user-input');
    const sendMessageButton = document.getElementById('send-message');
    const resetChatButton = document.getElementById('reset-chat');

    // Chat history array
    let messages = [];
    let chatSession = null;

    // Update slider values display
    temperatureSlider.addEventListener('input', () => {
        temperatureValue.textContent = temperatureSlider.value;
    });

    topPSlider.addEventListener('input', () => {
        topPValue.textContent = topPSlider.value;
    });

    topKSlider.addEventListener('input', () => {
        topKValue.textContent = topKSlider.value;
    });

    // Start chat button click handler
    startChatButton.addEventListener('click', () => {
        const apiKey = apiKeyInput.value.trim();
        if (!apiKey) {
            alert('Please enter your Gemini API key');
            return;
        }

        // Initialize Gemini API with the provided key
        initializeGeminiAPI(apiKey);
    });

    // Send message button click handler
    sendMessageButton.addEventListener('click', sendMessage);

    // User input keypress handler (send on Enter)
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Reset chat button click handler
    resetChatButton.addEventListener('click', () => {
        // Reset chat history
        messages = [];
        chatHistory.innerHTML = '';
        
        // Reset chat session
        chatSession = null;
        
        // Switch back to setup section
        chatSection.style.display = 'none';
        setupSection.style.display = 'block';
    });

    // Initialize Gemini API
    function initializeGeminiAPI(apiKey) {
        try {
            // Get model parameters
            const modelName = modelSelect.value;
            const temperature = parseFloat(temperatureSlider.value);
            const topP = parseFloat(topPSlider.value);
            const topK = parseInt(topKSlider.value);
            const maxOutputTokens = parseInt(maxTokensInput.value);

            // Create generation config
            const generationConfig = {
                temperature: temperature,
                topP: topP,
                topK: topK,
                maxOutputTokens: maxOutputTokens,
                responseMimeType: 'text/plain',
            };

            // Initialize Gemini API
            window.geminiAPI = {
                apiKey: apiKey,
                modelName: modelName,
                generationConfig: generationConfig
            };

            // Show chat section and hide setup section
            setupSection.style.display = 'none';
            chatSection.style.display = 'block';

            // Add welcome message
            addMessage('AI', `Hello! I'm ${modelName}. How can I help you today?`);
        } catch (error) {
            console.error('Error initializing Gemini API:', error);
            alert('Error initializing Gemini API. Please check your API key and try again.');
        }
    }

    // Send message function
    async function sendMessage() {
        const userMessage = userInput.value.trim();
        if (!userMessage) return;

        // Add user message to chat
        addMessage('user', userMessage);
        userInput.value = '';

        // Show loading indicator
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'message ai-message';
        loadingDiv.textContent = 'Thinking...';
        chatHistory.appendChild(loadingDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight;

        try {
            // Call Gemini API
            const response = await callGeminiAPI(userMessage);

            // Remove loading indicator
            chatHistory.removeChild(loadingDiv);

            // Add AI response to chat
            addMessage('AI', response);
        } catch (error) {
            console.error('Error calling Gemini API:', error);
            
            // Remove loading indicator
            chatHistory.removeChild(loadingDiv);
            
            // Add error message to chat instead of showing an alert
            const errorMessage = `Error: ${error.message || 'An unknown error occurred. Please check your connection and try again.'}`;
            addMessage('AI', errorMessage);
        }
    }

    // Call Gemini API function
    async function callGeminiAPI(message) {
        try {
            const { apiKey, modelName, generationConfig } = window.geminiAPI;

            // Validate API key
            if (!apiKey || apiKey.trim() === '') {
                throw new Error('API key is missing. Please provide a valid Gemini API key.');
            }
            
            // Ensure API key is properly formatted (remove any whitespace)
            const formattedApiKey = apiKey.trim();

            // Create headers for the API request
            const headers = {
                'Content-Type': 'application/json'
                // Note: For API key auth, we don't need Authorization header as the key is in the URL
            };

            // Prepare the request body
            let requestBody;
            
            if (!chatSession) {
                // First message - start a new chat
                requestBody = {
                    contents: [{
                        role: 'user',
                        parts: [{ text: message }]
                    }],
                    generationConfig: generationConfig
                };
            } else {
                // Continue existing chat
                messages.push({
                    role: 'user',
                    parts: [{ text: message }]
                });
                
                requestBody = {
                    contents: messages,
                    generationConfig: generationConfig
                };
            }

            console.log('Sending request to Gemini API:', JSON.stringify(requestBody, null, 2));
            console.log('Request URL:', `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${formattedApiKey.substring(0, 5)}...`);
            console.log('Request headers:', headers);

            // Make the API request
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${formattedApiKey}`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error Response:', errorData);
                
                // Handle specific authentication errors
                if (errorData.error && (errorData.error.code === 401 || errorData.error.status === 'UNAUTHENTICATED')) {
                    throw new Error('Authentication failed. Please check your API key and try again. Make sure you are using a valid Gemini API key.');
                } else if (errorData.error && errorData.error.code === 403) {
                    throw new Error('Access denied. Your API key may not have permission to use this model or service.');
                } else if (errorData.error && errorData.error.message) {
                    throw new Error(`API Error: ${errorData.error.message}`);
                } else {
                    throw new Error('Unknown API error. Please check your connection and try again.');
                }
            }

            const data = await response.json();
            console.log('Received response from Gemini API:', data);
            
            // Check if we have a valid response with candidates
            if (!data.candidates || data.candidates.length === 0) {
                console.error('No candidates in response:', data);
                throw new Error('No response generated. The model did not return any content.');
            }
            
            // Check for finish reason other than STOP
            if (data.candidates[0].finishReason && data.candidates[0].finishReason !== 'STOP') {
                console.warn('Response finish reason:', data.candidates[0].finishReason);
            }
            
            // Check if content exists and has parts
            if (!data.candidates[0].content || !data.candidates[0].content.parts || data.candidates[0].content.parts.length === 0) {
                console.error('Invalid content structure in response:', data.candidates[0]);
                throw new Error('Invalid response structure from the model.');
            }
            
            // Extract the response text
            const responseText = data.candidates[0].content.parts[0].text || 'No text response received';
            
            // Update messages array with AI response
            messages.push({
                role: 'model',
                parts: [{ text: responseText }]
            });
            
            // If this is the first message, set chatSession to true
            if (!chatSession) {
                chatSession = true;
            }
            
            return responseText;
        } catch (error) {
            console.error('Error in callGeminiAPI:', error);
            // Return a user-friendly error message that can be displayed in the chat
            return `Error: ${error.message || 'An unknown error occurred while communicating with the AI model.'}`;
        }
    }

    // Add message to chat history
    function addMessage(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender.toLowerCase() === 'user' ? 'user-message' : 'ai-message'}`;
        
        // Format the text (handle newlines)
        const formattedText = text.replace(/\n/g, '<br>');
        messageDiv.innerHTML = formattedText;
        
        // Add timestamp
        const timeDiv = document.createElement('div');
        timeDiv.className = 'message-time';
        const now = new Date();
        timeDiv.textContent = `${now.toLocaleTimeString()}`;
        messageDiv.appendChild(timeDiv);
        
        chatHistory.appendChild(messageDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }
});