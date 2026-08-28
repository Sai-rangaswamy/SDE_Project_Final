from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import Base, engine
import app.models as models

from app.api import auth, sites, jobs, materials, attendance, community

# Create database tables (In production, use Alembic)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="BuildGig API")

# Configure CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Change to specific origins in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(sites.router, prefix="/api/sites", tags=["Sites"])
app.include_router(jobs.router, prefix="/api/jobs", tags=["Jobs"])
app.include_router(materials.router, prefix="/api/materials", tags=["Materials"])
app.include_router(attendance.router, prefix="/api/attendance", tags=["Attendance"])
app.include_router(community.router, prefix="/api/community", tags=["Community"])

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "BuildGig Backend"}
