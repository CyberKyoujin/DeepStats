from typing import Annotated
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from db import User, get_db
from security import JwtHelper

oauth2scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

async def verify_user(token: Annotated[str, Depends(oauth2scheme)], db: AsyncSession = Depends(get_db)):
    
    payload = JwtHelper.verify_token(token)
    
    if payload.get("type") != "access":
        raise HTTPException(status_code=401, detail="Invalid authentication credentials.")
    
    user_id = payload.get("sub")
    query = select(User).where(User.id == int(user_id))
    result = await db.execute(query)
    user = result.scalars().first()
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    return user