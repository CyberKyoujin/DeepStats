from datetime import datetime
from decimal import Decimal, InvalidOperation
'''
This module contains functions to normalize raw trade data from Bybit into a consistent format for DB storage.
'''

def normalize_bybit_trades(raw_trades: list[dict], raw_orders: list[dict]) -> list[dict]:
    
    print(raw_trades)
    
    print("\n\n----\n\n")
    
    print(raw_orders)
    
    if not raw_trades:
        raise ValueError("Bybit provided no trade data.")
    
    # O(n)
    orders_map = {order["orderId"]: order for order in raw_orders}

    normalized_trades = []
    
    try:
    
        for trade in raw_trades:
            
            order = orders_map.get(trade.get("orderId"), {})
            
            sl = Decimal(order["stopLoss"]) if order.get("stopLoss") else None
            tp = Decimal(order["takeProfit"]) if order.get("takeProfit") else None
            
            print(f"Processing trade {trade.get('orderId')}: SL={sl}, TP={tp}")
            
            open_time = datetime.fromtimestamp(int(trade.get("createdTime")) / 1000).isoformat() if trade.get("createdTime") else ""
            close_time = datetime.fromtimestamp(int(trade.get("updatedTime")) / 1000).isoformat() if trade.get("updatedTime") else ""
            
            normalized_trade = {
                "open_time":   open_time,
                "position_id": trade.get("orderId", ""),
                "order_type":  trade.get("orderType", ""),
                "ticker":      trade.get("symbol", ""),
                "direction":   trade.get("side", "").lower(),  
                "volume":      Decimal(trade.get("qty", "0")),
                "open_price":  Decimal(trade.get("avgEntryPrice", "0")),
                "stop_loss":   sl,
                "take_profit": tp,
                "close_time":  close_time,
                "close_price": Decimal(trade.get("avgExitPrice", "0")),
                "commission":  Decimal(trade.get("openFee", "0")) + Decimal(trade.get("closeFee", "0")),
                "swap":        Decimal("0.00"),  # Bybit does not have a separate swap field
                "profit":      Decimal(trade.get("closedPnl", "0.00")),
                "leverage":    trade.get("leverage", ""),
            }
            
            # Validation: if there's no symbol or open time, the entry is invalid
            if not normalized_trade["ticker"] or not normalized_trade["open_time"]:
                continue
            
            normalized_trades.append(normalized_trade)
            
    except (InvalidOperation, KeyError, ValueError, TypeError) as e:
        
        raise ValueError(f"Error normalizing trades: {str(e)}")
    
    return normalized_trades