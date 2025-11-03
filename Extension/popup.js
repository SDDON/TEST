const startButton = document.getElementById('startButton');
const youtubeUrlInput = document.getElementById('youtubeUrl');
const statusDisplay = document.getElementById('status');

startButton.addEventListener('click', () => {
    const url = youtubeUrlInput.value;
    if (url) {
        statusDisplay.textContent = 'Status: Downloading...';
        fetch('http://localhost:8001/download', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: url }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                statusDisplay.textContent = 'Status: Download successful!';
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
