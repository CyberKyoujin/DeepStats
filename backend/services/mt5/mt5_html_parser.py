from bs4 import BeautifulSoup
from constants import ALLOWED_HEADERS, ALLOWED_STOP_HEADERS, COLUMN_TRANSLATIONS

"""
Parse MT5 HTML report and extract trade data (EN, RU, DE, UA). 
"""

# TODO: Add pagination parsing for reports with multiple pages of trades (e.g., 50+ trades)

def parse_mt5_html(raw_html: bytes) -> list:

    # First, attempt to decode the HTML using UTF-8. If it fails, try UTF-16LE. 
    try:
        soup = BeautifulSoup(raw_html, 'html.parser')
        if not soup.find('th'):
            soup = BeautifulSoup(raw_html, 'html.parser', from_encoding='utf-16-le')
    except Exception:
        soup = BeautifulSoup(raw_html, 'html.parser', from_encoding='utf-16-le')

    decoded_html = str(soup)
    
    # Handle edge cases where the report might be empty or incomplete
    if not decoded_html.strip():
        raise ValueError("Report is empty")
    
    # Check for the presence of the closing </html> tag to ensure we have a complete document.
    if "</html>" not in decoded_html.lower():
        raise ValueError("Incomplete Report")

    # Search for the "Positions" section header
    positions_header = soup.find(lambda tag: tag.name == 'th' and any(h in tag.get_text() for h in ALLOWED_HEADERS))

    if not positions_header:
        raise ValueError("Invalid MT5 Report: 'Positions' section not found.")

    # Find the row with column headers (the first row after the section header, where cells are bold)
    positions_row = positions_header.find_parent("tr")
    header_row = None
    
    for sibling in positions_row.find_next_siblings("tr"):
        tds = sibling.find_all("td")
        if tds and all(td.find("b") for td in tds if td.get_text(strip=True)):
            header_row = sibling
            break
    
    if not header_row:
        raise ValueError("Invalid MT5 Report: Column headers not found in 'Positions' section.")

    # Build a mapping from column index to internal keys based on the header row
    index_to_key = {}
    seen_counts = {}
    
    for idx, td in enumerate(header_row.find_all("td")):
        raw_name = td.get_text(strip=True).lower()
        if not raw_name:
            continue
            
        for internal_key, translations in COLUMN_TRANSLATIONS.items():
            if any(t.lower() == raw_name for t in translations):
                count = seen_counts.get(internal_key, 0) + 1
                seen_counts[internal_key] = count
                final_key = internal_key if count == 1 else f"{internal_key}_{count}"
                index_to_key[idx] = final_key
                break

    trades = []
    for row in header_row.find_next_siblings("tr"):
        # Stop parsing when we reach the next section (e.g., "Orders"), which indicates the end of the "Positions" table   
        if row.find(lambda tag: tag.name == 'th' and any(h in tag.get_text() for h in ALLOWED_STOP_HEADERS)):
            break
        
        # Filter out hidden columns
        cols = [td for td in row.find_all("td") if "hidden" not in td.get("class", [])]

        if len(cols) < 5:
            continue

        row_data = {}
        for idx, key in index_to_key.items():
            if idx < len(cols):
                val = cols[idx].get_text(strip=True).replace('\xa0', '').strip()
                row_data[key] = val

        # Map the extracted data to the standardized trade format
        trade = {
            "open_time":   row_data.get("open_time", ""),
            "position_id": row_data.get("position_id", ""),
            "ticker":      row_data.get("symbol", ""),
            "direction":   row_data.get("type", ""),
            "volume":      row_data.get("volume", ""),
            "open_price":  row_data.get("open_price", ""),
            "sl":          row_data.get("sl", ""),
            "tp":          row_data.get("tp", ""),
            "close_time":  row_data.get("open_time_2", ""), # Close time
            "close_price": row_data.get("open_price_2", ""), # Close price
            "commission":  row_data.get("commission", "0.00"),
            "swap":        row_data.get("swap", "0.00"),
            "profit":      row_data.get("profit", "0.00"),
        }

        # Validation: if there's no symbol or open time, the row is garbage
        if not trade["symbol"] or not trade["open_time"]:
            continue

        trades.append(trade)

    return trades

