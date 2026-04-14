from fastapi import APIRouter, Depends, HTTPException, Response
from schemas import StoreBybitApiKeys
from db import get_db, BybitCredentials, Trade, Portfolio
from sqlalchemy.ext.asyncio import AsyncSession
from dependencies import AuthenticatedUser
from security import EncryptionHelper
from services.bybit.helper import BybitHttpHelper
from sqlalchemy import delete, select
from services.bybit.trade_normalizer import normalize_bybit_trades

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
    
# TODO: Think about portolio name user input or default + id

@router.post("/upload-trades")
async def upload_bybit_trades(user: AuthenticatedUser, db: AsyncSession = Depends(get_db)):
    
    query = select(BybitCredentials).where(BybitCredentials.user_id == user.id)
    
    result = await db.execute(query)
    
    credentials = result.scalars().first()
    
    helper = BybitHttpHelper(api_key=EncryptionHelper.decrypt_data(credentials.api_key), secret_key=EncryptionHelper.decrypt_data(credentials.api_secret))
    
    trades = await helper.get_trade_history()
    orders = await helper.get_order_history()
    
    try:
        normalized_trades = normalize_bybit_trades(trades, orders)   
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    portfolio = Portfolio(user_id=user.id, source="Bybit Portfolio")
    db.add(portfolio)
    
    await db.commit()
    await db.refresh(portfolio)
     
    for t in normalized_trades:
        trade = Trade(portfolio_id=portfolio.id, **t)
        db.add(trade)
    
    await db.commit()
    
    return Response(status_code=200, content=f"Successfully uploaded {len(normalized_trades)} trades.")
