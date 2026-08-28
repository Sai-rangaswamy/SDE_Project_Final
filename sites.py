from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.crud.site import get_sites, get_site, create_site, delete_site
from app.schemas import SiteResponse, SiteCreate

router = APIRouter()

@router.get("/", response_model=List[SiteResponse])
def read_sites(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    sites = get_sites(db, skip=skip, limit=limit)
    return sites

@router.get("/{site_id}", response_model=SiteResponse)
def read_site(site_id: int, db: Session = Depends(get_db)):
    db_site = get_site(db, site_id=site_id)
    if db_site is None:
        raise HTTPException(status_code=404, detail="Site not found")
    return db_site

@router.post("/", response_model=SiteResponse)
def create_new_site(site: SiteCreate, corporate_id: int = 1, db: Session = Depends(get_db)):
    # In a real app, corporate_id comes from the JWT token
    return create_site(db=db, site=site, corporate_id=corporate_id)

@router.delete("/{site_id}")
def remove_site(site_id: int, db: Session = Depends(get_db)):
    success = delete_site(db=db, site_id=site_id)
    if not success:
        raise HTTPException(status_code=404, detail="Site not found")
    return {"message": "Site deleted successfully"}
