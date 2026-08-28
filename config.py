import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "BuildGig API"
    POSTGRES_USER: str = os.getenv("POSTGRES_USER", "buildgig_user")
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD", "buildgig_password")
    POSTGRES_DB: str = os.getenv("POSTGRES_DB", "buildgig_db")
    POSTGRES_HOST: str = os.getenv("POSTGRES_HOST", "localhost")
    POSTGRES_PORT: str = os.getenv("POSTGRES_PORT", "5432")

    @property
    def DATABASE_URL(self) -> str:
        return f"postgresql+pg8000://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

settings = Settings()
