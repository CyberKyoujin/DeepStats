from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy import Enum, String, ForeignKey, DateTime, Text
from config import settings
from fastapi import FastAPI
from datetime import datetime
from enums import TradeDirection

from decimal import Decimal
from sqlalchemy import Numeric

# SESSION CONFIGURATION + LIFESPAN

engine  = create_async_engine(settings.database_url)

async_session_maker = async_sessionmaker(engine, expire_on_commit=False)

async def get_db():
    async with async_session_maker() as session:
        yield session
        
async def lifespan(app: FastAPI):
   
    yield
    
    # Dispose after shutdown
    
    await engine.dispose()
    
        
# MODELS
        
class Base(DeclarativeBase):
    pass
        
class User(Base):
    __tablename__ = "user"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    username: Mapped[str] = mapped_column(unique=True, index=True)
    email: Mapped[str] = mapped_column(unique=True, index=True)
    password: Mapped[str] = mapped_column()
    
    tokens: Mapped[list["RefreshToken"]] = relationship(back_populates="user", cascade="all, delete-orphan", passive_deletes=True)
    bybit_credentials: Mapped[list["BybitCredentials"]] = relationship(back_populates="user", cascade="all, delete-orphan")

class RefreshToken(Base):
    __tablename__ = "refresh_token"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    token: Mapped[str] = mapped_column(String(512), unique=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id", ondelete="CASCADE"), nullable=False)
    expires_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    used: Mapped[bool] = mapped_column(default=False)
    
    user: Mapped["User"] = relationship(back_populates="tokens")
    
    @property
    def is_expired(self) -> bool:
        return datetime.now() > self.expires_at
    
class BybitCredentials(Base):
    __tablename__ = "bybit_api_credentials"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id", ondelete="CASCADE"), nullable=False)
    api_key: Mapped[str] = mapped_column(Text, index=True)
    api_secret: Mapped[str] = mapped_column(Text, index=True)
    
    user: Mapped["User"] = relationship(back_populates="bybit_credentials")
    
class Portfolio(Base):
    __tablename__ = "portfolio"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id", ondelete="CASCADE"), nullable=False)
    source: Mapped[str] = mapped_column()
    
    trades: Mapped[list["Trade"]] = relationship(back_populates="portfolio", cascade="all, delete-orphan")
    
class Trade(Base):
    __tablename__ = "trade"
    
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    portfolio_id: Mapped[int] = mapped_column(ForeignKey("portfolio.id", ondelete="CASCADE"), nullable=False)
    
    open_time: Mapped[str] = mapped_column(String(50))
    position_id: Mapped[str] = mapped_column(String(50), unique=True)
    order_type: Mapped[str | None] = mapped_column(String(20), nullable=True)
    ticker: Mapped[str] = mapped_column(String(50))
    direction: Mapped[TradeDirection] = mapped_column(Enum(TradeDirection))
    volume: Mapped[Decimal] = mapped_column(Numeric(10, 4))
    open_price: Mapped[Decimal] = mapped_column(Numeric(10, 4))
    stop_loss: Mapped[Decimal | None] = mapped_column(Numeric(10, 4), nullable=True)
    take_profit: Mapped[Decimal | None] = mapped_column(Numeric(10, 4), nullable=True)
    close_time: Mapped[str] = mapped_column(String(50))
    close_price: Mapped[Decimal] = mapped_column(Numeric(10, 4))
    commission: Mapped[Decimal] = mapped_column(Numeric(10, 4))
    swap: Mapped[Decimal] = mapped_column(Numeric(10, 4))
    profit: Mapped[Decimal] = mapped_column(Numeric(10, 4))
    leverage: Mapped[str | None] = mapped_column(String(20), nullable=True)
    
    portfolio: Mapped["Portfolio"] = relationship(back_populates="trades")