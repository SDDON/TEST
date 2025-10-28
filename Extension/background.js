let socket;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'START_SUBTITLES') {
        const { url } = message;
        
        // Disconnect previous socket if it exists
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.close();
        }

        // Connect to the WebSocket server
        socket = new WebSocket('ws://localhost:8000/ws');

        socket.onopen = () => {
            console.log('WebSocket connection established.');
            socket.send(url); // Send the YouTube URL to the server
            sendResponse({ status: 'Connecting...' });
            chrome.runtime.sendMessage({ type: 'STATUS_UPDATE', status: 'Connected' });
        };

        socket.onmessage = (event) => {
            console.log('Message from server: ', event.data);
            // Forward the subtitle to the content script
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs[0]) {
                    chrome.tabs.sendMessage(tabs[0].id, { type: 'SUBTITLE_CHUNK', chunk: event.data });
                }
            });
        };

        socket.onclose = () => {
            console.log('WebSocket connection closed.');
            chrome.runtime.sendMessage({ type: 'STATUS_UPDATE', status: 'Disconnected' });
            socket = null;
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
            chrome.runtime.sendMessage({ type: 'STATUS_UPDATE', status: 'Error' });
            socket = null;
        };

        // Indicate that the response will be sent asynchronously
        return true; 
    }
});
