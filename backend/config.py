from pydantic_settings import BaseSettings, SettingsConfigDict
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
# SECRETS

class Settings(BaseSettings):
    database_url: str
    secret_key: str
    algorithm: str
    access_token_expire_minutes: int
    
    cors_origins: str
    
    # Bybit API credentials
    bybit_api_key: str
    bybit_api_secret: str
    
    # Encryption key for sensitive data (e.g., API keys, tokens)
    encryption_key: str
    
    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()


# MIDDLWARE SETTINGS (CORS/CSRF)

