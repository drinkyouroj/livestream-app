# Datagram Livestreaming App

A simple web application for broadcasting and watching livestreams using the Datagram SDK.

## Setup

1. Sign up at [Datagram](https://sdk.datagram.network/) to get your API key
2. Replace `YOUR_API_KEY` in `index.js` with your actual Datagram API key

## Running the Application

1. Serve the files using a local web server. You can use Python's built-in server:

```bash
# Python 3
python3 -m http.server 8000
```

2. Open your browser and navigate to:
   - `http://localhost:8000/broadcaster.html` - For the broadcaster (streamer)
   - `http://localhost:8000/viewer.html` - For viewers

## How to Use

### As a Broadcaster
1. Open the broadcaster page
2. Click "Start Streaming" and allow camera/microphone access
3. Share the Stream ID shown on the page with your viewers
4. Click "Stop Streaming" when done

### As a Viewer
1. Open the viewer page
2. Enter the Stream ID provided by the broadcaster
3. Click "Watch Stream"
4. Click "Leave Stream" to stop watching

## Notes
- Make sure to use HTTPS in production for WebRTC to work properly
- Both the broadcaster and viewers need to be on the same network or have proper port forwarding for local development
- For production, you'll need to implement proper authentication and user management

## Dependencies
- [Datagram SDK](https://sdk.datagram.network/)
- Modern web browser with WebRTC support
