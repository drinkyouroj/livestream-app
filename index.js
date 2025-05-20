// Global client reference
let client;

// Helper function to update status
function updateStatus(message) {
    const statusElement = document.getElementById('status');
    if (statusElement) {
        statusElement.textContent = message;
    }
}

// Main application initialization
function initializeApp() {
    if (!client) {
        console.error('Client not initialized');
        updateStatus('Error: Client not initialized');
        return;
    }
    
    // Application state
    let localStream;
    let currentStream;
    
    // Check if we're on the broadcaster or viewer page
    const isBroadcaster = document.getElementById('localVideo') !== null;
    
    if (isBroadcaster) {
        // Broadcaster-specific code
        const startButton = document.getElementById('startButton');
        const stopButton = document.getElementById('stopButton');
        const localVideo = document.getElementById('localVideo');
        
        startButton.addEventListener('click', async () => {
            try {
                updateStatus('Starting stream...');
                
                // Get user media
                localStream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });
                
                // Display local video
                if (localVideo) {
                    localVideo.srcObject = localStream;
                }
                
                // Create a new stream
                const streamId = 'test-stream-' + Math.random().toString(36).substring(2, 10);
                currentStream = await client.streams.create({
                    id: streamId,
                    name: 'My Livestream',
                    video: true,
                    audio: true
                });
                
                // Publish the stream
                await currentStream.publish(localStream);
                
                updateStatus(`Streaming as ${streamId}`);
                startButton.disabled = true;
                stopButton.disabled = false;
                
            } catch (error) {
                console.error('Error starting stream:', error);
                updateStatus(`Error: ${error.message}`);
            }
        });
        
        stopButton.addEventListener('click', async () => {
            try {
                if (currentStream) {
                    await currentStream.stop();
                    currentStream = null;
                }
                
                if (localStream) {
                    localStream.getTracks().forEach(track => track.stop());
                    localStream = null;
                }
                
                updateStatus('Stream stopped');
                startButton.disabled = false;
                stopButton.disabled = true;
                
            } catch (error) {
                console.error('Error stopping stream:', error);
                updateStatus(`Error: ${error.message}`);
            }
        });
    } else {
        // Viewer-specific code
        const watchButton = document.getElementById('watchButton');
        const streamIdInput = document.getElementById('streamId');
        const remoteVideo = document.getElementById('remoteVideo');
        
        watchButton.addEventListener('click', async () => {
            try {
                const streamId = streamIdInput.value.trim();
                if (!streamId) {
                    updateStatus('Please enter a stream ID');
                    return;
                }
                
                updateStatus(`Connecting to stream ${streamId}...`);
                
                // Get the stream
                const stream = await client.streams.get(streamId);
                
                // Play the stream
                if (remoteVideo) {
                    remoteVideo.srcObject = await stream.play();
                }
                
                updateStatus(`Watching stream: ${streamId}`);
                
            } catch (error) {
                console.error('Error watching stream:', error);
                updateStatus(`Error: ${error.message}`);
            }
        });
    }
}

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded, initializing application...');
    
    // Check if Datagram is available
    if (typeof Datagram === 'undefined') {
        const errorMsg = 'Error: Datagram SDK not loaded. Please check the console for details.';
        console.error(errorMsg);
        console.log('Global objects:');
        console.log('- window.Datagram:', window.Datagram);
        console.log('- window.DatagramSDK:', window.DatagramSDK);
        console.log('- window.datagram:', window.datagram);
        updateStatus(errorMsg);
        return;
    }
    
    // Use configuration from window.DATAGRAM_CONFIG or fallback
    const config = window.DATAGRAM_CONFIG || {
        apiKey: 'org_d0htj1ukn5gs7i9cadk0:T/mGK6isA7ZxCEgvaydOpf8YEBsBStRCqW6VNCQAdFI',
        environment: 'development'
    };

    // Initialize the Datagram client
    try {
        console.log('Initializing Datagram client with config:', config);
        client = new Datagram.Client(config);
        console.log('Datagram client initialized successfully');
        initializeApp();
    } catch (error) {
        console.error('Error initializing Datagram client:', error);
        updateStatus(`Error initializing client: ${error.message}`);
        console.log('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
    }
});
