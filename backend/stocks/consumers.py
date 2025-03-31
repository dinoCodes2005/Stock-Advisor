import json
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
from nselib import capital_market
from datetime import datetime

# Top 10 companies on NSE
TOP_10_COMPANIES = [
    "RELIANCE", "TCS", "INFY", "HDFCBANK", "HDFC",
    "ICICIBANK", "BHARTIARTL", "KOTAKBANK", "LT", "ITC"
]


class StockConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        print("✅ WebSocket Connected")

        # Start pushing stock data every 5 seconds
        asyncio.create_task(self.send_stock_data())

    async def disconnect(self, close_code):
        print("❌ WebSocket Disconnected")

    async def receive(self, text_data):
        print(f"📩 Data Received from Frontend: {text_data}")
        # Optional: Handle any incoming data if needed

    async def send_stock_data(self):
        while True:
            stock_data = {}

            for symbol in TOP_10_COMPANIES:
                try:

                    data = capital_market.price_volume_and_deliverable_position_data(
                        symbol=symbol,
                        from_date="25-03-2024",
                        to_date="26-03-2024",
                    )
                    
                    # data = quote.equity(symbol)
                    print(f"Data for {symbol}:")
                    print(data)
                    data.columns = data.columns.str.strip().str.replace(" ", "", regex=True)

                    # List of columns to clean
                    columns_to_clean = ["OpenPrice", "HighPrice", "LowPrice", "ClosePrice", "PrevClose"]

                    # Clean and convert columns to float safely
                    for col in columns_to_clean:
                        if col in data.columns:
                            data[col] = (
                                data[col]
                                .astype(str)  # Convert to string to apply .str
                                .str.replace(",", "", regex=True)  # Remove commas
                                .replace({"nan": None})  # Handle NaN values after conversion
                                .astype(float)  # Convert to float
                            )

                    # Pick the most recent row from the data
                    if not data.empty:
                        latest_data = data.iloc[-1]
                        
                        
                        stock_data[symbol] = {
                            "symbol": symbol,
                            "lastPrice": float(latest_data["ClosePrice"]),
                            "open": float(latest_data["OpenPrice"]),
                            "high": float(latest_data["HighPrice"]),
                            "low": float(latest_data["LowPrice"]),
                            "previousClose": float(latest_data["PrevClose"]),
                        }
                    else:
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

            # Send the stock data to frontend
            await self.send(text_data=json.dumps({"data": stock_data}))
            print("📡 Stock Data Sent to Frontend")

            # Wait for 5 seconds before sending the next update
            await asyncio.sleep(5)
