let subtitleContainer;

function createSubtitleContainer() {
    if (document.getElementById('live-subtitle-container')) return;

    subtitleContainer = document.createElement('div');
    subtitleContainer.id = 'live-subtitle-container';
    subtitleContainer.textContent = 'Waiting for subtitles...';
    
    // Append to the YouTube player
    const player = document.getElementById('movie_player');
    if (player) {
        player.appendChild(subtitleContainer);
    } else {
        document.body.appendChild(subtitleContainer); // Fallback
    }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'SUBTITLE_CHUNK') {
        if (!subtitleContainer) {
            createSubtitleContainer();
        }
        // Update the text content of the subtitle container
        subtitleContainer.textContent = message.chunk;
    }
});

createSubtitleContainer();
