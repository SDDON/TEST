# YouTube Live Real-time Subtitles

This project provides real-time subtitles for YouTube Live streams via a Python backend and a Chrome Extension.

## Setup

### Backend

1.  Navigate to the `Server` directory.
2.  Create a virtual environment and activate it:
    ```bash
    uv venv
    source .venv/Scripts/activate
    ```
3.  Install dependencies:
    ```bash
    uv pip install -e .
    ```
4.  Set up your environment variables:
    ```bash
    copy .env.example .env
    # Add your API keys to the .env file
    ```
5.  Run the server:
    ```bash
    uvicorn src.main:app --reload
    ```

### Frontend

1.  Open Chrome and navigate to `chrome://extensions`.
2.  Enable "Developer mode".
3.  Click "Load unpacked" and select the `e:\TEST\Extension` directory.

