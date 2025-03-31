import MetaTrader5 as mt5
import pandas as pd
from datetime import datetime

# List of top 10 companies (replace with your desired symbols from MT5)
TOP_10_COMPANIES = ["RELIANCE", "TCS", "INFY", "HDFCBANK", "ICICIBANK", "BHARTIARTL", "KOTAKBANK", "LT", "ITC", "HDFC"]

# Initialize connection to MT5
if not mt5.initialize():
    print("❌ Failed to connect to MetaTrader 5")
    mt5.shutdown()
    exit()

# Dictionary to store stock data
stock_data = {}

# Get real-time data from MT5
def get_realtime_data(symbol):
    try:
        # Get real-time data for the symbol (latest 1 bar)
        rates = mt5.copy_rates_from_pos(symbol, mt5.TIMEFRAME_M1, 0, 1)

        if rates is not None and len(rates) > 0:
            # Convert to DataFrame
            data = pd.DataFrame(rates)
            data['time'] = pd.to_datetime(data['time'], unit='s')

            # Extract the latest bar data
            latest_data = data.iloc[-1]

            stock_data[symbol] = {
                "symbol": symbol,
                "lastPrice": float(latest_data["close"]),
                "open": float(latest_data["open"]),
                "high": float(latest_data["high"]),
                "low": float(latest_data["low"]),
                "previousClose": float(latest_data["close"]),  # Assuming previous close is the last close
            }
        else:
            print(f"⚠️ No data found for {symbol}")
            stock_data[symbol] = {
                "symbol": symbol,
                "lastPrice": 0,
                "open": 0,
                "high": 0,
                "low": 0,
                "previousClose": 0,
            }
    except Exception as e:
        print(f"⚠️ Error fetching data for {symbol}: {e}")
        stock_data[symbol] = {
            "symbol": symbol,
            "lastPrice": 0,
            "open": 0,
            "high": 0,
            "low": 0,
            "previousClose": 0,
        }

# Loop through top 10 companies to get real-time data
for symbol in TOP_10_COMPANIES:
    get_realtime_data(symbol)

# Print the collected stock data
for symbol, data in stock_data.items():
    print(f"📡 {symbol} Data: {data}")

# Shutdown the MT5 connection
mt5.shutdown()
