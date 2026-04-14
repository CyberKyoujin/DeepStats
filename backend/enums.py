from sqlalchemy import Enum
import enum

class TradeDirection(enum.Enum):
    buy = "buy"
    sell = "sell"