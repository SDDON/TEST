from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request
from fastapi.middleware.cors import CORSMiddleware
from .services.websocket_manager import WebSocketManager
import logging
import yt_dlp
import os
from pydantic import BaseModel

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# CORS 미들웨어 추가
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 모든 오리진 허용
    allow_credentials=True,
    allow_methods=["*"],  # 모든 메소드 허용
    allow_headers=["*"],  # 모든 헤더 허용
)

manager = WebSocketManager()

DOWNLOAD_DIR = "e:\\TEST\\Server\\downloads"
if not os.path.exists(DOWNLOAD_DIR):
    os.makedirs(DOWNLOAD_DIR)

class VideoRequest(BaseModel):
    url: str
    mode: str = 'video'  # 'video' or 'audio'

@app.get("/")
def read_root():
    return {"Project": "YouTube Live Subtitles"}

@app.post("/download")
async def download_video(request: VideoRequest):
    logger.info(f"Received download request for URL: {request.url} with mode: {request.mode}")
    
    # 음성 추출은 ffmpeg가 필요합니다.
    if request.mode == 'audio':
        ydl_opts = {
            'format': 'bestaudio/best',
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }],
            'outtmpl': os.path.join(DOWNLOAD_DIR, '%(title)s.%(ext)s'),
            'ffmpeg_location': 'C:\\ProgramData\\chocolatey\\bin',
        }
        message = "Audio extracted successfully."
    else: # video mode
        ydl_opts = {
            'outtmpl': os.path.join(DOWNLOAD_DIR, '%(title)s.%(ext)s'),
            'format': 'mp4'
        }
        message = "Video downloaded successfully."

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([request.url])
        return {"status": "success", "message": message}
    except Exception as e:
        logger.error(f"Error processing video: {e}")
        return {"status": "error", "message": str(e)}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # 클라이언트로부터 메시지 수신 대기 (예: 유튜브 URL)
            data = await websocket.receive_text()
            logger.info(f"Received data: {data}")
            
            # 여기에 YouTube 처리, 음성 추출, STT 변환 로직을 추가합니다.
            # 예시로, 받은 데이터를 다시 클라이언트로 에코합니다.
            await manager.send_personal_message(f"Processing URL: {data}", websocket)
            
            # 변환된 자막을 스트리밍하는 로직이 필요합니다.
            # for subtitle_chunk in stream_subtitles(data):
            #     await manager.send_personal_message(subtitle_chunk, websocket)

    except WebSocketDisconnect:
        manager.disconnect(websocket)
        logger.info("Client disconnected")
    except Exception as e:
        logger.error(f"An error occurred: {e}")
        manager.disconnect(websocket)

