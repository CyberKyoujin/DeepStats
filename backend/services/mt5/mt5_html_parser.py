from bs4 import BeautifulSoup


def parse_mt5_html(raw_html: bytes) -> list:
    
    soup = BeautifulSoup(raw_html, 'html.parser')

    # Find the "Positions" header to locate the positions table
    positions_header = soup.find('th', string=lambda t: t and "Positions" in t)
    
    if not positions_header:
        return []

    # Find the row with column names - the first <tr> after the header where all cells are bold
    positions_row = positions_header.find_parent("tr")
    header_row = None
    
    for sibling in positions_row.find_next_siblings("tr"):
        tds = sibling.find_all("td")
        if tds and all(td.find("b") for td in tds if td.get_text(strip=True)):
            header_row = sibling
            break
    
    # TODO: Add more robust handling of edge cases - missing columns, different column order, etc.
    if not header_row:
        return []

    # Build col_map with renaming of duplicates (Time to Time, Time to Time_2)
    col_map = {}
    seen = {}
    
    for idx, td in enumerate(header_row.find_all("td")):
        name = td.get_text(strip=True)
        if not name:
            continue
        if name in seen:
            seen[name] += 1
            col_map[f"{name}_{seen[name]}"] = idx
        else:
            seen[name] = 1
            col_map[name] = idx

    trades = []

    for row in header_row.find_next_siblings("tr"):
        # Stop parsing when we reach the next section "Orders"
        if row.find("th", string=lambda t: t and "Orders" in t):
            break

        # Filter out hidden td elements — they shift the indices relative to the header
        cols = [td for td in row.find_all("td") if "hidden" not in td.get("class", [])]

        # Skip rows with insufficient number of columns (totals, empty)
        if len(cols) < 5:
            continue

        def get_val(name):
            idx = col_map.get(name)
            if idx is not None and idx < len(cols):
                return cols[idx].get_text(strip=True).replace('\xa0', '').strip()
            return ""

        trade = {
            "open_time":    get_val("Time"),
            "position_id":  get_val("Position"),
            "symbol":       get_val("Symbol"),
            "type":         get_val("Type"),
            "volume":       get_val("Volume"),
            "open_price":   get_val("Price"),
            "sl":           get_val("S / L"),
            "tp":           get_val("T / P"),
            "close_time":   get_val("Time_2"),
            "close_price":  get_val("Price_2"),
            "commission":   get_val("Commission"),
            "swap":         get_val("Swap"),
            "profit":       get_val("Profit").replace(" ", ""),
        }

        if not trade["symbol"] or not trade["open_time"]:
            continue

        trades.append(trade)

    return trades


