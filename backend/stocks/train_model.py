import logging
from .ml_model import StockRecommender
import schedule
import time
import pandas as pd
import yfinance as yf
import requests
from bs4 import BeautifulSoup
import json
import os

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class StockDataManager:
    def __init__(self, cache_dir: str = 'cache'):
        self.cache_dir = cache_dir
        os.makedirs(cache_dir, exist_ok=True)
        self.stocks_cache_file = os.path.join(cache_dir, 'nse_stocks.json')
        
    def fetch_nse_stocks(self) -> dict:
        """Fetch list of NSE stocks with their market cap categories."""
        try:
            # Try to load from cache first
            if os.path.exists(self.stocks_cache_file):
                with open(self.stocks_cache_file, 'r') as f:
                    cached_data = json.load(f)
                    if cached_data.get('timestamp', 0) > time.time() - 86400:  # Cache valid for 24 hours
                        logger.info("Using cached NSE stocks data")
                        return cached_data['stocks']
            
            logger.info("Using default stock list for testing...")
            
            # Default reliable stock list for testing
            stocks = {
                'large_cap': [
                    "RELIANCE.NS",
                    "INFY.NS",
                    "ICICIBANK.NS",
                    "HINDUNILVR.NS",
                    "SBIN.NS",
                    "BHARTIARTL.NS",
                    "ITC.NS",
                    "KOTAKBANK.NS",
                    "LT.NS",
                    "AXISBANK.NS",
                    "MARUTI.NS",
                    "HCLTECH.NS",
                    "ASIANPAINT.NS",
                    "TATASTEEL.NS",
                    "WIPRO.NS"
                ],
                'mid_cap': [
                    "INDHOTEL.NS",
                    "FEDERALBNK.NS",
                    "SAIL.NS",
                    "GODREJPROP.NS",
                    "TATAPOWER.NS",
                    "APOLLOTYRE.NS",
                    "CANBK.NS",
                    "NMDC.NS",
                    "ESCORTS.NS",
                    "MINDTREE.NS"
                ],
                'small_cap': [
                    "TRIDENT.NS",
                    "SUZLON.NS",
                    "RPOWER.NS",
                    "IDEA.NS",
                    "PNB.NS",
                    "YESBANK.NS",
                    "IBULHSGFIN.NS",
                    "DELTACORP.NS",
                    "GMRINFRA.NS",
                    "IBREALEST.NS"
                ]
            }
            
            # Cache the results
            with open(self.stocks_cache_file, 'w') as f:
                json.dump({
                    'timestamp': time.time(),
                    'stocks': stocks
                }, f)
            
            return stocks
            
        except Exception as e:
            logger.error(f"Error fetching NSE stocks: {str(e)}")
            return self.get_default_stocks()
    
    def get_default_stocks(self) -> dict:
        """Return a default list of reliable stocks."""
        return {
            'large_cap': [
                "RELIANCE.NS",
                "INFY.NS",
                "ICICIBANK.NS",
                "HINDUNILVR.NS",
                "SBIN.NS"
            ],
            'mid_cap': [
                "INDHOTEL.NS",
                "FEDERALBNK.NS",
                "SAIL.NS",
                "TATAPOWER.NS",
                "APOLLOTYRE.NS"
            ],
            'small_cap': [
                "TRIDENT.NS",
                "SUZLON.NS",
                "PNB.NS",
                "YESBANK.NS",
                "DELTACORP.NS"
            ]
        }
    
    def verify_stock_data(self, symbols: list) -> list:
        """Verify which stocks have valid data available."""
        valid_symbols = []
        for symbol in symbols:
            try:
                # Remove .NS suffix if present for verification
                base_symbol = symbol.replace('.NS', '')
                ticker = yf.Ticker(f"{base_symbol}.NS")
                hist = ticker.history(period="1mo")
                if not hist.empty and len(hist) > 20:  # At least 20 days of data
                    valid_symbols.append(symbol)
                    logger.info(f"Verified stock data for {symbol}")
            except Exception as e:
                logger.warning(f"Error verifying {symbol}: {str(e)}")
        return valid_symbols

def train_models():
    """Train separate models for different market cap categories."""
    success_count = 0
    try:
        logger.info("Starting model training...")
        data_manager = StockDataManager()
        stocks = data_manager.fetch_nse_stocks()
        
        for category, symbols in stocks.items():
            try:
                logger.info(f"Training model for {category}...")
                
                # Verify stocks with valid data
                valid_symbols = data_manager.verify_stock_data(symbols)
                if not valid_symbols:
                    logger.error(f"No valid stocks found for {category}")
                    continue
                
                # Ensure we have enough stocks for training
                min_stocks = 5  # Minimum number of stocks needed for training
                if len(valid_symbols) < min_stocks:
                    logger.error(f"Insufficient stocks for {category}. Need at least {min_stocks}, got {len(valid_symbols)}")
                    continue
                    
                # Train model for this category
                recommender = StockRecommender(model_dir=f'models/{category}')
                recommender.train(valid_symbols, force_retrain=True)
                logger.info(f"Model training completed for {category}")
                success_count += 1
                
            except Exception as e:
                logger.error(f"Error training model for {category}: {str(e)}")
                continue
        
        if success_count == 0:
            raise Exception("Failed to train any models")
        else:
            logger.info(f"Successfully trained {success_count} out of {len(stocks)} category models")
            
    except Exception as e:
        logger.error(f"Error during model training: {str(e)}")
        raise

def main():
    """Main function to schedule and run model training."""
    logger.info("Starting stock recommender training scheduler...")
    
    # Create necessary directories
    os.makedirs('models', exist_ok=True)
    os.makedirs('models/large_cap', exist_ok=True)
    os.makedirs('models/mid_cap', exist_ok=True)
    os.makedirs('models/small_cap', exist_ok=True)
    
    # Train immediately on startup
    try:
        train_models()
    except Exception as e:
        logger.error(f"Initial training failed: {str(e)}")
    
    # Schedule daily training at midnight
    schedule.every().day.at("00:00").do(train_models)
    
    # Keep the script running
    while True:
        try:
            schedule.run_pending()
        except Exception as e:
            logger.error(f"Error in scheduled training: {str(e)}")
        time.sleep(60)  # Check every minute

if __name__ == "__main__":
    main() 