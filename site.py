from sqlalchemy.orm import Session
from app.models import Site
from app.schemas import SiteCreate

def get_sites(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Site).offset(skip).limit(limit).all()

def get_site(db: Session, site_id: int):
    return db.query(Site).filter(Site.id == site_id).first()

def create_site(db: Session, site: SiteCreate, corporate_id: int):
    db_site = Site(
        **site.model_dump(),
        corporate_id=corporate_id
    )
    db.add(db_site)
    db.commit()
    db.refresh(db_site)
    return db_site

def delete_site(db: Session, site_id: int):
    site = db.query(Site).filter(Site.id == site_id).first()
    if site:
        db.delete(site)
        db.commit()
        return True
    return False
