from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.templating import Jinja2Templates
from fastmcp import FastMCP
import os, inspect, uuid
from utils import get_openai_client, get_workflow_id, get_config, get_title

# openai client
client = get_openai_client()

# mcp 생성
mcp = FastMCP("MCP Server")
import functions
for name, fn in inspect.getmembers(functions, inspect.isfunction):
    mcp.tool(fn)

# app 생성
app = FastAPI(lifespan=mcp.lifespan)
app.mount("/mcp", mcp.http_app(path="/"))
app.add_middleware(CORSMiddleware, allow_origins=["*"])

# Jinja2 템플릿 설정
templates = Jinja2Templates(directory="build")

@app.post("/api/chatkit/session")
def create_chatkit_session():
    client = get_openai_client()
    session = client.beta.chatkit.sessions.create(
        workflow={"id": get_workflow_id()},
        user=f"user_{str(uuid.uuid4())[:8]}",
    )
    return {"client_secret": session.client_secret}

@app.get("/", response_class=HTMLResponse)
async def serve_index(request: Request):
    return templates.TemplateResponse("index.html", {
        "request": request,
        "title": get_title(),
        "config": get_config()
    })

app.mount("/static", StaticFiles(directory="build/static"), name="static")
app.mount("/", StaticFiles(directory="build", html=False), name="client")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000)),
        reload=True,
        timeout_keep_alive=0,  # timeout 무제한
        timeout_graceful_shutdown=0,
        access_log=True,
        log_level="info"
    )