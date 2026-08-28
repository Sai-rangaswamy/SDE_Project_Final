from sqlalchemy.orm import Session
from app.models import CommunityPost, User
from app.schemas import CommunityPostCreate

def get_community_posts(db: Session, skip: int = 0, limit: int = 100):
    posts = db.query(CommunityPost).order_by(CommunityPost.created_at.desc()).offset(skip).limit(limit).all()
    # Attach author name to each post
    for post in posts:
        post.author_name = post.author.name if post.author else "Unknown"
    return posts

def create_community_post(db: Session, post: CommunityPostCreate, author_id: int):
    db_post = CommunityPost(
        title=post.title,
        content=post.content,
        author_id=author_id
    )
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    
    # Attach author name for response
    db_post.author_name = db_post.author.name if db_post.author else "Unknown"
    return db_post
