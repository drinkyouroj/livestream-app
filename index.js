// Initialize the Datagram client
const client = new Datagram.Client({
    apiKey: 'YOUR_ACTUAL_API_KEY', // Your Datagram API key goes here
    environment: 'development' // or 'production' for live environment
});

// Elements
let localStream;
let remoteStream;
let peerConnection;

// Check if we're on the broadcaster or viewer page
const isBroadcaster = document.getElementById('localVideo') !== null;

if (isBroadcaster) {
    // Broadcaster setup
    const localVideo = document.getElementById('localVideo');
    const startButton = document.getElementById('startButton');
    const stopButton = document.getElementById('stopButton');
    const statusElement = document.getElementById('status');
    
    let streamId = `stream-${Math.random().toString(36).substr(2, 9)}`;
    
    startButton.addEventListener('click', async () => {
        try {
            // Get user media
            localStream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });
            
            localVideo.srcObject = localStream;
            
            // Create a new stream
            const stream = await client.streams.create({
                id: streamId,
                name: 'My Livestream',
                video: true,
                audio: true
            });
            
            // Publish the stream
            await stream.publish(localStream);
            
            statusElement.textContent = `Streaming with ID: ${streamId}`;
            startButton.disabled = true;
            stopButton.disabled = false;
            
            // Handle stream end
            stopButton.addEventListener('click', async () => {
                await stream.unpublish();
                localStream.getTracks().forEach(track => track.stop());
                localVideo.srcObject = null;
                statusElement.textContent = 'Stream ended';
                startButton.disabled = false;
                stopButton.disabled = true;
            });
            
        } catch (error) {
            console.error('Error starting stream:', error);
            statusElement.textContent = `Error: ${error.message}`;
        }
    });
    
} else {
    // Viewer setup
    const remoteVideo = document.getElementById('remoteVideo');
    const watchButton = document.getElementById('watchButton');
    const leaveButton = document.getElementById('leaveButton');
    const streamIdInput = document.getElementById('streamId');
    const statusElement = document.getElementById('status');
    
    let currentStream = null;
    
    watchButton.addEventListener('click', async () => {
        const streamId = streamIdInput.value.trim();
        if (!streamId) {
            statusElement.textContent = 'Please enter a stream ID';
            return;
        }
        
        try {
            // Get the stream by ID
            currentStream = await client.streams.get(streamId);
            
            // Subscribe to the stream
            const stream = await currentStream.subscribe();
            
            // Play the remote stream
            remoteVideo.srcObject = stream;
            
            statusElement.textContent = `Watching stream: ${streamId}`;
            watchButton.disabled = true;
            leaveButton.disabled = false;
            streamIdInput.disabled = true;
            
        } catch (error) {
            console.error('Error watching stream:', error);
            statusElement.textContent = `Error: ${error.message}`;
        }
    });
    
    leaveButton.addEventListener('click', () => {
        if (currentStream) {
            currentStream.unsubscribe();
            remoteVideo.srcObject = null;
            statusElement.textContent = 'Left the stream';
            watchButton.disabled = false;
            leaveButton.disabled = true;
            streamIdInput.disabled = false;
            currentStream = null;
        }
    });
}
