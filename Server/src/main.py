from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from .services.websocket_manager import WebSocketManager
import logging

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()
manager = WebSocketManager()

@app.get("/")
def read_root():
    return {"Project": "YouTube Live Subtitles"}

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

