from fastapi import FastAPI
import uvicorn
from db import lifespan
from schemas import User
from db import User as UserModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import Depends
from db import get_db
from routers import auth, meta_trader, bybit
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from slowapi.errors import RateLimitExceeded

from limiter import limiter
from services.bybit.exceptions import BybitAPIError

app = FastAPI(lifespan=lifespan)

app.include_router(auth.router)
app.include_router(meta_trader.router)
app.include_router(bybit.router)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, lambda request, exc: JSONResponse(status_code=429, content={"detail": "Rate limit exceeded. Try again later."}))


# MIDDLWARE SETTINGS (CORS)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# EXCEPTION HANDLERS

# Handle validation errors to provide clearer messages about missing fields
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    
    missing_fields = [e["loc"][-1] for e in exc.errors() if e["type"] == "missing"]
    
    return JSONResponse(
        status_code=422,
        content={"detail": f"Required fields missing: {', '.join(missing_fields)}"}
    )
    
@app.exception_handler(BybitAPIError)
async def bybit_error_handler(request, exc):
    return JSONResponse(status_code=400, content={"detail": str(exc)})


 
if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
    