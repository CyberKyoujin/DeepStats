import httpx
import hashlib
import time
import hmac
from config import settings
from services.bybit.exceptions import BybitAPIError

api_key=settings.bybit_api_key
secret_key=settings.bybit_api_secret

# BYBIT HTTP Requests Configurator

class BybitHttpHelper:
    
    def __init__(self, api_key: str, secret_key: str):
        self.api_key = api_key
        self.secret_key = secret_key
        self.recv_window = str(5000)
        self.base_url = "https://api.bybit.com"

        
    def _generate_signature(self, timestamp: str, payload: str) -> str:
        param_str = timestamp + self.api_key + self.recv_window + payload   
        hash = hmac.new(bytes(self.secret_key, "utf-8"), param_str.encode("utf-8"), hashlib.sha256)
        return hash.hexdigest()
    
    async def get_trade_history(self, category: str = "linear", symbol: str = None):
        
        endpoint = "/v5/position/closed-pnl"
        method = "GET"     
        
        params = f"category={category}"
        
        if symbol:
            params += f"&symbol={symbol}"
            
        timestamp = str(int(time.time() * 1000))
        signature = self._generate_signature(timestamp, params)
            
        headers = {
            "X-BAPI-API-KEY": self.api_key,
            "X-BAPI-SIGN": signature,
            "X-BAPI-SIGN-TYPE": "2",
            "X-BAPI-TIMESTAMP": timestamp,
            "X-BAPI-RECV-WINDOW": self.recv_window,
            "Content-Type": "application/json"
        }
        
        url = f"{self.base_url}{endpoint}?{params}"
        
        async with httpx.AsyncClient() as client:
            result = await client.request(method=method, url=url, headers=headers)
        
        if result.status_code != 200:
            raise BybitAPIError(result.status_code, result.text)
        
        data = result.json()
        
        if data.get("retCode") != 0:
            raise BybitAPIError(data.get("retCode"), data.get("retMsg"))
        
        return data.get("result", {}).get("list", [])
    
if __name__ == "__main__":
    
    import sys
    import os
    sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
    
    helper = BybitHttpHelper(api_key, secret_key)
    
    import asyncio
    trades = asyncio.run(helper.get_trade_history())
    for trade in trades:
        print(trade)
    