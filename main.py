from fastapi import FastAPI, Request, UploadFile, File
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
import os
from dotenv import load_dotenv

# openai client 생성 함수
client = None
OPENAI_API_KEY = None
def get_openai_client():
    global client, OPENAI_API_KEY
    load_dotenv(override=True)
    current_api_key = os.environ.get("OPENAI_API_KEY")

    if OPENAI_API_KEY != current_api_key:
        OPENAI_API_KEY = current_api_key
        client = OpenAI() if OPENAI_API_KEY else None
    return client

# workflow id
def get_workflow_id():
    load_dotenv(override=True)
    return os.getenv("WORKFLOW_ID")


client = get_openai_client()
app = FastAPI()

# CORS - 모든 출처 허용
app.add_middleware(CORSMiddleware, allow_origins=["*"])

class SessionRequest(BaseModel):
    device_id: str

@app.post("/api/chatkit/session")
def create_chatkit_session(req: SessionRequest):
    client = get_openai_client()
    session = client.beta.chatkit.sessions.create(
        workflow={"id": get_workflow_id()},
        user=req.device_id,
    )
    return {"client_secret": session.client_secret}

@app.get("/api/chatkit/config")
def get_chatkit_config():
    load_dotenv(override=True)
    return {
        "placeholder": os.getenv("CHATKIT_PLACEHOLDER", "궁금한 것이 있으면 여기에 메시지를 입력하세요."),
        "greeting": os.getenv("CHATKIT_GREETING", "안녕하세요! 무엇을 도와드릴까요?")
    }

# 정적 파일 제공: build 폴더 안의 정적 React 파일들 제공
app.mount("/", StaticFiles(directory="frontend/build", html=True), name="client")

# React 라우팅 대응: 비-API 경로 요청일 경우 index.html 반환
@app.get("/{full_path:path}", response_class=HTMLResponse)
async def serve_spa(request: Request, full_path: str):
    index_path = os.path.join("frontend/build", "index.html")
    with open(index_path, "r", encoding="utf-8") as f:
        html = f.read()
    return HTMLResponse(html)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000)),
        reload=True,
        # timeout_keep_alive=0,  # timeout 무제한
        # timeout_graceful_shutdown=0,
        # access_log=True,
        # log_level="info"
    )