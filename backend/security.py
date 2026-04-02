from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone

from sqlalchemy import select
from db import RefreshToken
from config import settings
from jose import jwt
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

pwd_context = CryptContext(schemes=['argon2'], deprecated="auto")

# HELPER FOR PASSWORD HASHING/VALIDATION

class PasswordHelper:
    
    # Password hashing with bcrypt
    @staticmethod
    def hash_password(password: str) -> str:
        return pwd_context.hash(password)
    
    # Check password
    @staticmethod
    def check_password(password: str, hashed_password: str) -> bool:
        return pwd_context.verify(password, hashed_password)
    

# JWT GENERATION

class JwtHelper:
    
    @staticmethod
    def generate_tokens(user_id: int) -> tuple[str, str]:
        
        access_expire = datetime.now(timezone.utc) + timedelta(minutes=settings.access_token_expire_minutes)
        
        access_payload = {
            "sub": str(user_id),
            "exp": access_expire,
            "type": "access"
        }
        
        access_token = jwt.encode(access_payload, settings.secret_key, algorithm=settings.algorithm)
        
        refresh_expire = datetime.now(timezone.utc) + timedelta(days=30)
        
        refresh_payload = {
            "sub": str(user_id),
            "exp": refresh_expire,
            "type": "refresh"
        }
        
        refresh_token = jwt.encode(refresh_payload, settings.secret_key, algorithm=settings.algorithm)
        
        return access_token, refresh_token
    
    @staticmethod
    def verify_token(token: str):
        try:
            payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
            return payload
        except Exception as e:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials.")
        
    @staticmethod
    async def rotate_tokens(old_token: str, db: AsyncSession) -> tuple[str, str]:
        
        query = select(RefreshToken).where(RefreshToken.token == old_token)
        
        result = await db.execute(query)
        token_entry = result.scalars().first()
    
        payload = JwtHelper.verify_token(old_token)
        
        if not token_entry or token_entry.is_expired or payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid or expired refresh token.")
        
        access, refresh = JwtHelper.generate_tokens(payload.get("sub"))
        
        new_refresh_token = RefreshToken(token=refresh, user_id=int(payload.get("sub")), expires_at=datetime.now() + timedelta(days=30))
        
        await db.delete(token_entry)
        db.add(new_refresh_token)
        await db.commit()
        
        return access, refresh
        
        
        
        