from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import uuid

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://changelog-ui.vercel.app",  # Your main Vercel domain
        "https://changelog-ui-git-main-devanshs-projects-37c827fd.vercel.app",  # Your preview domain
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage
logs_db = {
    'pending': [],
    'approved': []
}

class LogEntry(BaseModel):
    id: Optional[str] = None
    title: str
    content: str
    date: Optional[str] = None
    image_url: Optional[str] = None
    status: str = 'pending'
    pr_url: Optional[str] = None
    pr_number: Optional[str] = None

@app.get("/")
def read_root():
    return {"message": "Changelog API is running"}

@app.get("/api/health")
def health_check():
    return {"status": "ok"}

@app.get("/api/logs/pending")
def get_pending_logs():
    return logs_db['pending']

@app.get("/api/logs/approved")
def get_approved_logs():
    return logs_db['approved']

@app.post("/api/logs")
def create_log(log: LogEntry):
    new_log = log.dict()
    new_log['id'] = str(uuid.uuid4())
    new_log['date'] = datetime.now().isoformat()
    logs_db['pending'].append(new_log)
    return new_log

@app.put("/api/logs/{log_id}/status")
def update_log_status(log_id: str, status: str):
    log = next((log for log in logs_db['pending'] if log['id'] == log_id), None)
    if not log:
        raise HTTPException(status_code=404, detail="Log not found")
    
    if status == 'approved':
        logs_db['pending'] = [l for l in logs_db['pending'] if l['id'] != log_id]
        log['status'] = 'approved'
        logs_db['approved'].append(log)
    
    return log

@app.put("/api/logs/{log_id}")
def update_log(log_id: str, log: LogEntry):
    for existing_log in logs_db['pending']:
        if existing_log['id'] == log_id:
            existing_log.update(log.dict(exclude={'id', 'status', 'date'}))
            return existing_log
    raise HTTPException(status_code=404, detail="Log not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3003) 