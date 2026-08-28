from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship
import enum
from datetime import datetime
from app.core.database import Base

class RoleEnum(str, enum.Enum):
    corporate = "corporate"
    subcontractor = "subcontractor"
    worker = "worker"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=True)
    phone = Column(String, unique=True, index=True, nullable=True)
    password_hash = Column(String, nullable=False)
    name = Column(String, nullable=False)
    role = Column(Enum(RoleEnum), nullable=False)

    sites_owned = relationship("Site", back_populates="corporate", foreign_keys="Site.corporate_id")
    sites_working = relationship("Site", back_populates="subcontractor", foreign_keys="Site.sub_id")

class Site(Base):
    __tablename__ = "sites"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    location = Column(String, nullable=False)
    budget_allocated = Column(Float, default=0.0)
    budget_spent = Column(Float, default=0.0)
    status = Column(String, default="Active")

    corporate_id = Column(Integer, ForeignKey("users.id"))
    sub_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    corporate = relationship("User", back_populates="sites_owned", foreign_keys=[corporate_id])
    subcontractor = relationship("User", back_populates="sites_working", foreign_keys=[sub_id])
    materials = relationship("Material", back_populates="site")
    attendance_records = relationship("Attendance", back_populates="site")

class Material(Base):
    __tablename__ = "materials"

    id = Column(Integer, primary_key=True, index=True)
    item_name = Column(String, nullable=False)
    quantity = Column(String, nullable=False)
    status = Column(String, default="Ordered") # Ordered, On the Way, Delivered
    site_id = Column(Integer, ForeignKey("sites.id"))

    site = relationship("Site", back_populates="materials")

class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="Present") # Present, Pending Payment, Paid
    worker_id = Column(Integer, ForeignKey("users.id"))
    site_id = Column(Integer, ForeignKey("sites.id"))

    site = relationship("Site", back_populates="attendance_records")

class JobPosting(Base):
    __tablename__ = "job_postings"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    wage = Column(Float, nullable=False)
    posted_by_role = Column(String, nullable=False) # 'corporate' or 'subcontractor'
    posted_by_id = Column(Integer, ForeignKey("users.id"))
    site_id = Column(Integer, ForeignKey("sites.id"))

    site = relationship("Site")
    posted_by = relationship("User")
    applications = relationship("JobApplication", back_populates="job")

class JobApplication(Base):
    __tablename__ = "job_applications"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("job_postings.id"))
    applicant_id = Column(Integer, ForeignKey("users.id"))
    status = Column(String, default="Pending") # Pending, Accepted, Rejected

    job = relationship("JobPosting", back_populates="applications")
    applicant = relationship("User")

class CommunityPost(Base):
    __tablename__ = "community_posts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(String, nullable=False)
    author_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

    author = relationship("User")
