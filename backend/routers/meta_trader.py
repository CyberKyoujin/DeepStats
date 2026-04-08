from fastapi import APIRouter, Depends
from db import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from dependencies import AuthenticatedUser
from fastapi import File, UploadFile, HTTPException
from services.mt5.mt5_html_parser import parse_mt5_html

router = APIRouter(
    prefix="/metatrader",
    tags=["MetaTrader"]
)

@router.post("/upload-trades", status_code=200)
async def upload_trades(user: AuthenticatedUser, file: UploadFile = File(...), db: AsyncSession = Depends(get_db)):
    
    # [SECURITY] Сheck the file extension to ensure only .html files are accepted.
    if not file.filename.endswith(".html"):
        raise HTTPException(status_code=400, detail="Only .html files are allowed.")
    
    raw_html = await file.read()
    
    # [SECURITY] Basic validation to check if the file content resembles an HTML document.
    if not raw_html.strip().startswith((b'<', b'\xff\xfe', b'\xef\xbb\xbf')):
        raise HTTPException(status_code=400, detail="Invalid file format.")
    
    try:
        trades = parse_mt5_html(raw_html)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        raise HTTPException(status_code=400, detail="Failed to parse the uploaded file. Ensure it's a valid MT5 HTML report.")
    
    return {"status": "ok", "message": "Trades uploaded successfully."}