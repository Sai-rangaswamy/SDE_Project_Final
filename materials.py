from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.crud.material import get_materials_by_site, create_material
from app.schemas import MaterialResponse, MaterialCreate

router = APIRouter()

@router.get("/", response_model=List[MaterialResponse])
def read_all_materials(db: Session = Depends(get_db)):
    from app.models import Material
    return db.query(Material).all()

@router.get("/site/{site_id}", response_model=List[MaterialResponse])
def read_materials(site_id: int, db: Session = Depends(get_db)):
    return get_materials_by_site(db, site_id=site_id)

@router.post("/", response_model=MaterialResponse)
def create_new_material(material: MaterialCreate, db: Session = Depends(get_db)):
    return create_material(db=db, material=material)
