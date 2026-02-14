import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    SUPABASE_DB_HOST = os.getenv("SUPABASE_DB_HOST")
    SUPABASE_DB_PORT = os.getenv("SUPABASE_DB_PORT")
    SUPABASE_DB_NAME = os.getenv("SUPABASE_DB_NAME")
    SUPABASE_DB_USER = os.getenv("SUPABASE_DB_USER")
    SUPABASE_DB_PASSWORD = os.getenv("SUPABASE_DB_PASSWORD")

    @property
    def DATABASE_URL(self) -> str:
        return (
            f"postgresql+psycopg2://{self.SUPABASE_DB_USER}:"
            f"{self.SUPABASE_DB_PASSWORD}@"
            f"{self.SUPABASE_DB_HOST}:"
            f"{self.SUPABASE_DB_PORT}/"
            f"{self.SUPABASE_DB_NAME}"
        )

    # NEW JWT VARIABLES
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    JWT_ALGORITHM = os.getenv("JWT_ALGORITHM")
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES = int(
        os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", 60)
    )


settings = Settings()

