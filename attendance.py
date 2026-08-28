from sqlalchemy.orm import Session
from app.models import Attendance
from app.schemas import AttendanceCreate

def get_attendance_by_worker(db: Session, worker_id: int):
    return db.query(Attendance).filter(Attendance.worker_id == worker_id).all()

def get_attendance_by_site(db: Session, site_id: int):
    return db.query(Attendance).filter(Attendance.site_id == site_id).all()

def create_attendance(db: Session, attendance: AttendanceCreate):
    db_att = Attendance(**attendance.model_dump())
    db.add(db_att)
    db.commit()
    db.refresh(db_att)
    return db_att
