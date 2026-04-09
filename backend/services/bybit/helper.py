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
    
    async def get_trade_history(self, category: str = "linear", endpoint: str = "/v5/position/closed-pnl") -> list[dict]:
        
        method = "GET"     
        
        params = f"category={category}"
    
        response_objects = []
        
        # Initialize client
        async with httpx.AsyncClient() as client:
            
            while True:
                
                # Generate authentication headers on each iteration for long pagination cases
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
        
                result = await client.request(method=method, url=url, headers=headers)
            
                # Handle HTTP error
                if result.status_code != 200:
                    raise BybitAPIError(result.status_code, result.text)
                
                data = result.json()
                
                # Handle Bybit Internal Exception
                if data.get("retCode") != 0:
                    raise BybitAPIError(data.get("retCode"), data.get("retMsg"))
            
                trades_data = data.get("result", {}).get("list", [])
            
                response_objects.extend(trades_data)
                
                # Extract pagination object
                cursor = data.get("result", {}).get("nextPageCursor")
                
                # If not available - exit
                if not cursor or not trades_data:
                    break
                
                # Otherwise add to params
                params += f"&cursor={cursor}" 
        
        return response_objects
    
    # Getting order history for matching SL and TP values.
    async def get_order_history(self) -> list[dict]:
        return await self.get_trade_history(endpoint="/v5/order/history")
    