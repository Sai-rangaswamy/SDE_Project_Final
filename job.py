from sqlalchemy.orm import Session
from app.models import JobPosting, JobApplication
from app.schemas import JobCreate, ApplicationCreate

def get_jobs(db: Session, skip: int = 0, limit: int = 100):
    return db.query(JobPosting).offset(skip).limit(limit).all()

def create_job(db: Session, job: JobCreate, posted_by_id: int, posted_by_role: str):
    db_job = JobPosting(
        **job.model_dump(),
        posted_by_id=posted_by_id,
        posted_by_role=posted_by_role
    )
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job

def apply_to_job(db: Session, application: ApplicationCreate, applicant_id: int):
    db_app = JobApplication(
        job_id=application.job_id,
        applicant_id=applicant_id
    )
    db.add(db_app)
    db.commit()
    db.refresh(db_app)
    return db_app
