const startButton = document.getElementById('startButton');
const youtubeUrlInput = document.getElementById('youtubeUrl');
const statusDisplay = document.getElementById('status');
const audioOnlyModeCheckbox = document.getElementById('audioOnlyMode');

startButton.addEventListener('click', () => {
    const url = youtubeUrlInput.value;
    if (url) {
        const mode = audioOnlyModeCheckbox.checked ? 'audio' : 'video';
        statusDisplay.textContent = `Status: Requesting ${mode} download...`;

        fetch('http://localhost:8001/download', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: url, mode: mode }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                statusDisplay.textContent = `Status: ${data.message}`;
            } else {
                statusDisplay.textContent = `Status: Error - ${data.message}`;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            statusDisplay.textContent = 'Status: Error - Could not connect to server.';
        });
    } else {
        statusDisplay.textContent = 'Status: Please enter a URL.';
    }
});

// Optional: Listen for status updates from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'STATUS_UPDATE') {
        statusDisplay.textContent = `Status: ${message.status}`;
    }
});
