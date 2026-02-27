document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const voiceInput = document.getElementById('voice-input');
    const imageUpload = document.getElementById('image-upload');
    const themeIcon = document.getElementById('theme-icon');
    const themeToggle = document.querySelector('.theme-toggle');
    const moodOptions = document.querySelectorAll('.mood');
    const resourceCards = document.querySelectorAll('.resource-card');

    // Check for saved theme preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-theme');
        themeIcon.className = 'fas fa-sun';
    }

    // Auto-resize textarea
    userInput.addEventListener('input', () => {
        userInput.style.height = 'auto';
        userInput.style.height = (userInput.scrollHeight) + 'px';
        if (userInput.scrollHeight > 150) {
            userInput.style.overflowY = 'auto';
        } else {
            userInput.style.overflowY = 'hidden';
        }
    });

    // Send message on Enter key (without Shift)
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Send message on button click
    sendButton.addEventListener('click', sendMessage);

    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);

    // Mood selection
    moodOptions.forEach(mood => {
        mood.addEventListener('click', () => {
            moodOptions.forEach(m => m.classList.remove('active'));
            mood.classList.add('active');
            
            // Show a thank you message
            const thankYou = document.createElement('div');
            thankYou.className = 'message bot-message';
            thankYou.innerHTML = `
                <div class="avatar">
                    <i class="fas fa-brain"></i>
                </div>
                <div class="message-content">
                    <p>Thanks for sharing how you're feeling today! 😊</p>
                    <span class="timestamp">Just now</span>
                </div>
            `;
            chatMessages.appendChild(thankYou);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        });
    });

    // Resource card click
    resourceCards.forEach(card => {
        card.addEventListener('click', () => {
            const title = card.querySelector('h3').textContent;
            let message = '';
            
            switch(title) {
                case 'Self-Care Tips':
                    message = "Here are some simple self-care tips:\n• Take short breaks during your day\n• Stay hydrated\n• Practice deep breathing when stressed\n• Get some sunlight daily\n• Listen to music you enjoy\n• Connect with a friend";
                    break;
                case 'Mindfulness Guide':
                    message = "Try this simple mindfulness exercise:\n1. Find a comfortable position\n2. Close your eyes or soften your gaze\n3. Focus on your breathing for 2 minutes\n4. Notice the sensation of air entering and leaving your body\n5. When your mind wanders, gently bring it back to your breath";
                    break;
                case 'Sleep Better':
                    message = "Tips for better sleep:\n• Maintain a consistent sleep schedule\n• Avoid screens 1 hour before bed\n• Keep your bedroom cool and dark\n• Try a relaxing bedtime routine\n• Limit caffeine after noon\n• Use your bed only for sleep";
                    break;
                case 'Community Support':
                    message = "Connecting with others is important for mental wellness. Consider:\n• Joining online support groups\n• Participating in community activities\n• Volunteering for a cause you care about\n• Reaching out to a friend or family member\n• Joining a class or workshop to meet like-minded people";
                    break;
            }
            
            if (message) {
                const resourceMessage = document.createElement('div');
                resourceMessage.className = 'message bot-message';
                resourceMessage.innerHTML = `
                    <div class="avatar">
                        <i class="fas fa-brain"></i>
                    </div>
                    <div class="message-content">
                        <p>${message.replace(/\n/g, '<br>')}</p>
                        <span class="timestamp">Just now</span>
                    </div>
                `;
                chatMessages.appendChild(resourceMessage);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        });
    });

    // Voice input functionality
    let recognition;
    let isListening = false;

    // Check if browser supports speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.continuous = true; // Changed to true to keep listening
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        recognition.maxAlternatives = 1;

        recognition.onresult = (event) => {
            const last = event.results.length - 1;
            const transcript = event.results[last][0].transcript;
            
            // Update the input field with the transcript
            userInput.value = transcript;
            userInput.style.height = 'auto';
            userInput.style.height = (userInput.scrollHeight) + 'px';
            
            // Only send message when recognition is final
            if (event.results[last].isFinal) {
                // Add a small delay before sending
                setTimeout(() => {
                    if (userInput.value.trim() !== '') {
                        sendMessage();
                    }
                }, 1000);
            }
        };

        recognition.onend = () => {
            // If still in listening mode but recognition ended, restart it
            if (isListening) {
                try {
                    recognition.start();
                } catch (e) {
                    console.error('Error restarting recognition:', e);
                    isListening = false;
                    voiceInput.className = 'fas fa-microphone';
                }
            } else {
                voiceInput.className = 'fas fa-microphone';
            }
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            isListening = false;
            voiceInput.className = 'fas fa-microphone';
            
            // Show more specific error message based on the error type
            if (event.error === 'not-allowed') {
                addMessageToChat("Microphone access was denied. Please check your browser settings and ensure microphone permissions are enabled for this site.", 'bot');
                showMicrophoneInstructions();
            } else if (event.error === 'no-speech') {
                addMessageToChat("No speech was detected. Please try again and speak clearly.", 'bot');
            } else {
                addMessageToChat(`Speech recognition error: ${event.error}. Please try again.`, 'bot');
            }
        };
    }

    voiceInput.addEventListener('click', () => {
        if (!recognition) {
            alert('Sorry, your browser does not support speech recognition.');
            return;
        }

        if (!isListening) {
            // Request microphone permission explicitly
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    // Permission granted, start recognition
                    stream.getTracks().forEach(track => track.stop()); // Stop the stream as we don't need it anymore
                    
                    // Start listening
                    try {
                        recognition.start();
                        isListening = true;
                        voiceInput.className = 'fas fa-microphone-slash listening';
                        
                        // Add a message to indicate listening
                        addMessageToChat("I'm listening... Please speak now.", 'bot');
                    } catch (e) {
                        console.error('Error starting recognition:', e);
                        addMessageToChat("There was an error starting the speech recognition. Please try again.", 'bot');
                    }
                })
                .catch(err => {
                    console.error('Microphone permission denied:', err);
                    addMessageToChat("Microphone access was denied. Please check your browser settings and ensure microphone permissions are enabled for this site.", 'bot');
                    showMicrophoneInstructions();
                });
        } else {
            // Stop listening
            try {
                recognition.stop();
            } catch (e) {
                console.error('Error stopping recognition:', e);
            }
            isListening = false;
            voiceInput.className = 'fas fa-microphone';
        }
    });

    // Image upload functionality (placeholder)
    imageUpload.addEventListener('click', () => {
        alert('Image upload feature coming soon!');
    });

    // Function to send message
    function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        // Add user message to chat
        addMessageToChat(message, 'user');
        
        // Clear input
        userInput.value = '';
        userInput.style.height = 'auto';
        
        // Show typing indicator and store its reference
        const typingIndicator = showTypingIndicator();
        
        // Send to API and get response
        fetchChatResponse(message, typingIndicator);
    }

    // Function to add message to chat
    function addMessageToChat(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}-message`;
        
        const avatar = document.createElement('div');
        avatar.className = 'avatar';
        
        const icon = document.createElement('i');
        icon.className = sender === 'user' ? 'fas fa-user' : 'fas fa-brain';
        avatar.appendChild(icon);
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        const messageText = document.createElement('p');
        messageText.innerHTML = message.replace(/\n/g, '<br>');
        
        const timestamp = document.createElement('span');
        timestamp.className = 'timestamp';
        timestamp.textContent = 'Just now';
        
        messageContent.appendChild(messageText);
        messageContent.appendChild(timestamp);
        
        messageElement.appendChild(avatar);
        messageElement.appendChild(messageContent);
        
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Function to show typing indicator
    function showTypingIndicator() {
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'message bot-message typing-indicator';
        typingIndicator.innerHTML = `
            <div class="avatar">
                <i class="fas fa-brain"></i>
            </div>
            <div class="message-content">
                <p>Typing<span class="dot">.</span><span class="dot">.</span><span class="dot">.</span></p>
            </div>
        `;
        chatMessages.appendChild(typingIndicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Animate dots
        const dots = typingIndicator.querySelectorAll('.dot');
        let i = 0;
        const dotAnimation = setInterval(() => {
            dots.forEach(dot => dot.style.opacity = '0.2');
            dots[i].style.opacity = '1';
            i = (i + 1) % dots.length;
        }, 300);
        
        return { element: typingIndicator, animation: dotAnimation };
    }

    // Function to fetch chat response from API
    async function fetchChatResponse(message, typingIndicator) {
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
            });
            
            const data = await response.json();
            
            // Remove typing indicator
            clearInterval(typingIndicator.animation);
            typingIndicator.element.remove();
            
            // Add bot response
            if (data.response) {
                // Simulate typing delay for natural feel
                setTimeout(() => {
                    addMessageToChat(data.response, 'bot');
                }, 500);
            } else if (data.error) {
                addMessageToChat(`Sorry, I encountered an error: ${data.error}`, 'bot');
            }
        } catch (error) {
            console.error('Error:', error);
            
            // Remove typing indicator
            clearInterval(typingIndicator.animation);
            typingIndicator.element.remove();
            
            // Add error message
            addMessageToChat("Sorry, I'm having trouble connecting right now. Please try again later.", 'bot');
        }
    }

    // Function to toggle theme
    function toggleTheme() {
        document.body.classList.toggle('dark-theme');
        
        const isDarkMode = document.body.classList.contains('dark-theme');
        localStorage.setItem('darkMode', isDarkMode);
        
        if (isDarkMode) {
            themeIcon.className = 'fas fa-sun';
        } else {
            themeIcon.className = 'fas fa-moon';
        }
        
        console.log('Theme toggled:', isDarkMode ? 'dark' : 'light');
    }

    // No need for additional initial message as it's already in the chat history
});