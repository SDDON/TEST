const startButton = document.getElementById('startButton');
const youtubeUrlInput = document.getElementById('youtubeUrl');
const statusDisplay = document.getElementById('status');

startButton.addEventListener('click', () => {
    const url = youtubeUrlInput.value;
    if (url) {
        // Send the URL to the background script
        chrome.runtime.sendMessage({ type: 'START_SUBTITLES', url: url }, (response) => {
            if (response && response.status) {
                statusDisplay.textContent = `Status: ${response.status}`;
            }
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
