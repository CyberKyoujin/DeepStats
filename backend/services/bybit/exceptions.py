




BYBIT_ERROR_CODES = {
    10000: "Server timeout",
    10001: "Request parameter error",
    10002: "Server time desynchronization",
    10003: "Invalid API key",
    10007: "User authentication failed",
    10006: "Too many requests",
    10016: "Internal server error",
    10011: "Service unavailable",
    10012: "Gateway timeout",
    10013: "Rate limit exceeded",
    401: "Unauthorized or invalid API key",
}


class BybitAPIError(Exception):
    """Custom exception for Bybit API errors."""
    
    def __init__(self, code: int, message: str = None):
        self.code = code
        self.message = message
        if self.code in BYBIT_ERROR_CODES:
            super().__init__(f"Bybit API Error {code} - {BYBIT_ERROR_CODES[code]}")
        else:
            super().__init__(f"Bybit API Error {code} - {message}")
        

        