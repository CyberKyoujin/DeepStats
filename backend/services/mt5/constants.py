
# Constants for MT5 HTML parsing and data extraction.

ALLOWED_HEADERS = ["Positions", "Позиции", "Позиції", "Positionen"] 
ALLOWED_STOP_HEADERS = ["Orders", "Ордера", "Ордери"] 

COLUMN_TRANSLATIONS = {
    "open_time": ["Time", "Время", "Zeit", "Час"],
    "position_id": ["Position", "Позиция", "Позиція"],
    "symbol": ["Symbol", "Символ"],
    "type": ["Type", "Тип", "Typ"],
    "volume": ["Volume", "Объем", "Volumen", "Обсяг"],
    "open_price": ["Price", "Цена", "Preis", "Ціна"],
    "sl": ["S / L", "S/L"],
    "tp": ["T / P", "T/P"],
    "commission": ["Commission", "Комиссия", "Kommission", "Комісія"],
    "swap": ["Swap", "Своп"],
    "profit": ["Profit", "Прибыль", "Gewinn", "Прибуток"],
}