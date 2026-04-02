from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy import String, ForeignKey, DateTime
from config import settings
from fastapi import FastAPI
from datetime import datetime


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

class RefreshToken(Base):
    __tablename__ = "refresh_token"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    token: Mapped[str] = mapped_column(String(512), unique=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id", ondelete="CASCADE"), nullable=False)
    expires_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    
    user: Mapped["User"] = relationship(back_populates="tokens")
    
    @property
    def is_expired(self) -> bool:
        return datetime.now() > self.expires_at
    