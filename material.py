from sqlalchemy.orm import Session
from app.models import Material
from app.schemas import MaterialCreate

def get_materials_by_site(db: Session, site_id: int):
    return db.query(Material).filter(Material.site_id == site_id).all()

def create_material(db: Session, material: MaterialCreate):
    db_material = Material(**material.model_dump())
    db.add(db_material)
    db.commit()
    db.refresh(db_material)
    return db_material
