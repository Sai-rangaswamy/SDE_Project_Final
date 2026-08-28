from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.crud.job import get_jobs, create_job, apply_to_job
from app.schemas import JobResponse, JobCreate, ApplicationResponse, ApplicationCreate

router = APIRouter()

@router.get("/", response_model=List[JobResponse])
def read_jobs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_jobs(db, skip=skip, limit=limit)

@router.post("/", response_model=JobResponse)
def create_new_job(job: JobCreate, posted_by_id: int = 1, posted_by_role: str = "corporate", db: Session = Depends(get_db)):
    from app.models import User, Site
    # Find a valid user if posted_by_id doesn't exist
    user = db.query(User).filter(User.id == posted_by_id).first()
    if not user:
        user = db.query(User).first()
        if user:
            posted_by_id = user.id
            posted_by_role = user.role.value
    
    # Find a valid site if job.site_id doesn't exist
    site = db.query(Site).filter(Site.id == job.site_id).first()
    if not site:
        site = db.query(Site).first()
        if site:
            job.site_id = site.id
        else:
            # Create a dummy site to satisfy FK
            dummy_site = Site(name="Dummy Site", location="Unknown", budget_allocated=0)
            db.add(dummy_site)
            db.commit()
            db.refresh(dummy_site)
            job.site_id = dummy_site.id

    try:
        return create_job(db=db, job=job, posted_by_id=posted_by_id, posted_by_role=posted_by_role)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/apply", response_model=ApplicationResponse)
def apply_for_job(application: ApplicationCreate, applicant_id: int = 1, db: Session = Depends(get_db)):
    return apply_to_job(db=db, application=application, applicant_id=applicant_id)
