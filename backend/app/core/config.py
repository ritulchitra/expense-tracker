import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    SUPABASE_DB_HOST: str = os.getenv("SUPABASE_DB_HOST")
    SUPABASE_DB_PORT: str = os.getenv("SUPABASE_DB_PORT")
    SUPABASE_DB_NAME: str = os.getenv("SUPABASE_DB_NAME")
    SUPABASE_DB_USER: str = os.getenv("SUPABASE_DB_USER")
    SUPABASE_DB_PASSWORD: str = os.getenv("SUPABASE_DB_PASSWORD")

    @property
    def DATABASE_URL(self) -> str:
        return (
            f"postgresql+psycopg2://{self.SUPABASE_DB_USER}:"
            f"{self.SUPABASE_DB_PASSWORD}@"
            f"{self.SUPABASE_DB_HOST}:"
            f"{self.SUPABASE_DB_PORT}/"
            f"{self.SUPABASE_DB_NAME}"
        )

settings = Settings()
