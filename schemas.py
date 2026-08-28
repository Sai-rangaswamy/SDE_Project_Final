from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import enum

class RoleEnum(str, enum.Enum):
    corporate = "corporate"
    subcontractor = "subcontractor"
    worker = "worker"

class UserBase(BaseModel):
    email: Optional[str] = None
    phone: Optional[str] = None
    name: str
    role: RoleEnum

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    class Config:
        from_attributes = True

class SiteBase(BaseModel):
    name: str
    location: str
    budget_allocated: float
    status: str = "Active"

class SiteCreate(SiteBase):
    pass

class SiteResponse(SiteBase):
    id: int
    budget_spent: float
    corporate_id: int
    sub_id: Optional[int]
    class Config:
        from_attributes = True

class JobBase(BaseModel):
    title: str
    description: str
    wage: float
    site_id: int

class JobCreate(JobBase):
    pass

class JobResponse(JobBase):
    id: int
    posted_by_role: str
    posted_by_id: int
    class Config:
        from_attributes = True

class ApplicationBase(BaseModel):
    job_id: int

class ApplicationCreate(ApplicationBase):
    pass

class ApplicationResponse(ApplicationBase):
    id: int
    applicant_id: int
    status: str
    class Config:
        from_attributes = True

class MaterialBase(BaseModel):
    item_name: str
    quantity: str
    status: str = "Ordered"
    site_id: int

class MaterialCreate(MaterialBase):
    pass

class MaterialResponse(MaterialBase):
    id: int
    class Config:
        from_attributes = True

class AttendanceBase(BaseModel):
    worker_id: int
    site_id: int
    status: str = "Present"

class AttendanceCreate(AttendanceBase):
    pass

class AttendanceResponse(AttendanceBase):
    id: int
    date: datetime
    class Config:
        from_attributes = True

class CommunityPostBase(BaseModel):
    title: str
    content: str

class CommunityPostCreate(CommunityPostBase):
    pass

class CommunityPostResponse(CommunityPostBase):
    id: int
    author_id: int
    created_at: datetime
    author_name: Optional[str] = None
    class Config:
        from_attributes = True
