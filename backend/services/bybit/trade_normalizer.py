
'''
This module contains functions to normalize raw trade data from Bybit into a consistent format for DB storage.
'''

# TODO: Make request to order/history for matching SL and TP values

def normalize_bybit_trades(raw_trades: list[dict]) -> list[dict]:
    
    normalized_trades = []
    
    for trade in raw_trades:
        normalized_trade = {
            "open_time":   trade.get("createdTime", ""),
            "position_id": str(trade.get("orderId", "")),
            "ticker":      trade.get("symbol", ""),
            "direction":        trade.get("side", "").lower(),  
            "volume":      str(trade.get("qty", "")),
            "open_price":  str(trade.get("avgEntryPrice", "")),
            # Stop
            "sl":          str(trade.get("sl", "")),
            "tp":          str(trade.get("tp", "")),
            "close_time":  trade.get("close_time", ""),
            "close_price": str(trade.get("close_price", "")),
            "commission":  str(trade.get("exec_fee", "0.00")),
            "swap":        "0.00",  # Bybit does not have a separate swap field
            "profit":      str(trade.get("closed_pnl", "0.00")),
        }
        
        # Validation: if there's no symbol or open time, the entry is invalid
        if not normalized_trade["symbol"] or not normalized_trade["open_time"]:
            continue
        
        normalized_trades.append(normalized_trade)
    
    return normalized_trades