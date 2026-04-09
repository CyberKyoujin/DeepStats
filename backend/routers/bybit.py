from fastapi import APIRouter, Depends
from schemas import StoreBybitApiKeys
from db import get_db, BybitCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from dependencies import AuthenticatedUser
from security import EncryptionHelper
from services.bybit.helper import BybitHttpHelper

router = APIRouter(
    prefix="/bybit",
    tags=["Bybit"]
)

@router.post("/save-api-keys", status_code=200)
async def save_bybit_api_keys(user: AuthenticatedUser, api_keys: StoreBybitApiKeys, db: AsyncSession = Depends(get_db)):
    
    bybit_helper = BybitHttpHelper(api_key=api_keys.api_key, secret_key=api_keys.api_secret)
    
    await bybit_helper.verify_api_credentials()
    
    encrypted_key = EncryptionHelper.encrypt_data(api_keys.api_key)
    encrypted_secret = EncryptionHelper.encrypt_data(api_keys.api_secret)
    
    bybit_credentials = BybitCredentials(user_id=user.id, api_key=encrypted_key, api_secret=encrypted_secret)
    
    db.add(bybit_credentials)
    
    await db.commit()
    await db.refresh(bybit_credentials)
    
    return {"detail": "Successfully stored bybit credentials."}
    


@router.post("/upload-trades", status_code=200)
async def upload_bybit_trades():
    ...