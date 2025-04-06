import logging
from ml_model import StockRecommender
import pandas as pd
import numpy as np

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def test_stock_recommender():
    # Initialize the recommender
    logger.info("Initializing StockRecommender...")
    recommender = StockRecommender()
    
    # Test with some popular NSE stocks
    test_symbols = [
        "RELIANCE",  # Reliance Industries
        "TCS",       # Tata Consultancy Services
        "HDFCBANK",  # HDFC Bank
        "INFY",      # Infosys
        "ICICIBANK"  # ICICI Bank
    ]
    
    try:
        logger.info("1. Testing data fetching...")
        data = recommender.fetch_nse_data(test_symbols)
        if not data:
            raise ValueError("No data was fetched for any symbols")
            
        for symbol, df in data.items():
            logger.info(f"\nData shape for {symbol}: {df.shape}")
            logger.info(f"Date range: {df.index.min()} to {df.index.max()}")
            logger.info(f"Columns: {df.columns.tolist()}")
        
        logger.info("\n2. Testing feature calculation...")
        for symbol, df in data.items():
            logger.info(f"\nCalculating features for {symbol}...")
            try:
                features_df = recommender.calculate_features(df)
                logger.info(f"Features shape: {features_df.shape}")
                logger.info(f"Features: {features_df.columns.tolist()}")
                logger.info("\nSample of calculated features:")
                logger.info(features_df.tail(1))
            except Exception as e:
                logger.error(f"Error calculating features for {symbol}: {str(e)}")
                raise
        
        logger.info("\n3. Testing model training...")
        try:
            recommender.train(test_symbols)
            logger.info("Model training completed successfully")
        except Exception as e:
            logger.error(f"Error during model training: {str(e)}")
            raise
        
        logger.info("\n4. Testing recommendations...")
        try:
            recommendations = recommender.get_recommendations(
                rts_score=60,  # Moderate risk tolerance
                target_amount=100000,  # ₹1 lakh target
                monthly_investment=10000,  # ₹10,000 monthly investment
                investment_duration=12  # 1 year
            )
            
            logger.info("\nRecommendations:")
            for rec in recommendations:
                logger.info(f"\nStock: {rec['symbol']}")
                logger.info(f"Current Price: ₹{rec['current_price']:,.2f}")
                logger.info(f"Expected Return: {rec['expected_return']:.2%}")
                logger.info(f"Risk-Adjusted Score: {rec['risk_adjusted_score']:.2f}")
                logger.info(f"Shares Possible: {rec['shares_possible']:.2f}")
                logger.info(f"Projected Value: ₹{rec['projected_value']:,.2f}")
                
                risk_metrics = rec['risk_metrics']
                logger.info("\nRisk Metrics:")
                logger.info(f"Volatility: {risk_metrics['volatility']:.2f}")
                logger.info(f"Sharpe Ratio: {risk_metrics['sharpe_ratio']:.2f}")
                logger.info(f"Sortino Ratio: {risk_metrics['sortino_ratio']:.2f}")
                logger.info(f"Max Drawdown: {risk_metrics['max_drawdown']:.2%}")
                
                tech_indicators = rec['technical_indicators']
                logger.info("\nTechnical Indicators:")
                logger.info(f"RSI: {tech_indicators['rsi']:.2f}")
                logger.info(f"MACD: {tech_indicators['macd']:.2f}")
                logger.info(f"BB Position: {tech_indicators['bb_position']:.2f}")
                logger.info(f"Volume Ratio: {tech_indicators['volume_ratio']:.2f}")
        except Exception as e:
            logger.error(f"Error generating recommendations: {str(e)}")
            raise
        
        return True
        
    except Exception as e:
        logger.error(f"Test failed with error: {str(e)}")
        return False

if __name__ == "__main__":
    logger.info("Starting ML model test...")
    success = test_stock_recommender()
    logger.info(f"\nTest {'succeeded' if success else 'failed'}") 