from datetime import timedelta, timezone
from datetime import datetime

from fastapi import APIRouter, Request
from schemas import LoginUser, CreateUser
from db import RefreshToken, User as UserModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from fastapi import Depends
from db import get_db
from fastapi import HTTPException
from fastapi.responses import JSONResponse
from security import PasswordHelper, JwtHelper
from fastapi import Cookie
from limiter import limiter


router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)

@router.post("/signup", status_code=201)
async def signup(user: CreateUser, db: AsyncSession = Depends(get_db)):
    
    query = select(UserModel).where(or_(
        UserModel.email == user.email,
        UserModel.username == user.username
    ))
    
    result = await db.execute(query)
    
    if result.scalars().first():
        raise HTTPException(status_code=400, detail="User with these credentials already exists.")
    
    new_user = UserModel(username=user.username, email=user.email, password=PasswordHelper.hash_password(password=user.password))
    
    db.add(new_user)
    
    await db.commit()
    await db.refresh(new_user)
    
    return {"status": "ok", "user_id": new_user.id}


@router.post("/login", status_code=200)
@limiter.limit("5/minute")
async def signin(request: Request, user: LoginUser, db: AsyncSession = Depends(get_db)):
    
    query = select(UserModel).where(UserModel.email == user.email)
    
    result = await db.execute(query)
    
    retrieved_user = result.scalars().first()
    
    if not retrieved_user:
        raise HTTPException(status_code=404, detail="User with the provided email doesn't exist.")
    
    if PasswordHelper.check_password(user.password, retrieved_user.password):
        access, refresh = JwtHelper.generate_tokens(retrieved_user.id)
        
        refresh_token_entry = RefreshToken(token=refresh, user_id=retrieved_user.id, expires_at=datetime.now() + timedelta(days=30))
        
        db.add(refresh_token_entry)
        await db.commit()
        
    else:
        raise HTTPException(status_code=403, detail="Invalid credentials.")
    
    response = JSONResponse(content={"message": "Login successful.", "access_token": access})
    
    response.set_cookie(key="refresh_token", value=refresh, httponly=True, samesite="lax", secure=True, max_age=30*24*60*60)  # 30 days
    
    return response

@router.post("/refresh", status_code=200)
@limiter.limit("5/minute")
async def refresh(request: Request, refresh_token: str = Cookie(None), db: AsyncSession = Depends(get_db)):
    
    if not refresh_token:
        raise HTTPException(status_code=400, detail="Refresh token missing.")
    
    access, new_refresh = await JwtHelper.rotate_tokens(refresh_token, db)
    
    response = JSONResponse(content={"message": "Login successful.", "access_token": access})
    
    response.set_cookie(key="refresh_token", value=new_refresh, httponly=True, samesite="lax", secure=True, max_age=30*24*60*60)  # 30 days
    
    return response
    
    