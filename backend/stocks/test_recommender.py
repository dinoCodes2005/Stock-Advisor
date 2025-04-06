import logging
from ml_model import StockRecommender
from train_model import train_models
import os

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def test_stock_recommender():
    """Test the stock recommendation system"""
    try:
        # First ensure models are trained
        logger.info("Training models for all categories...")
        train_models()
        
        # Test parameters
        test_params = {
            'rts_score': 75,  # High risk tolerance
            'target_amount': 1000000,  # 10 Lakh target
            'monthly_investment': 50000,  # 50k monthly investment
            'investment_duration': 60  # 5 years
        }
        
        logger.info("\nTesting individual category recommendations:")
        categories = ['large_cap', 'mid_cap', 'small_cap']
        
        for category in categories:
            try:
                recommender = StockRecommender(model_dir=f'models/{category}')
                if recommender.is_trained:
                    recommendations = recommender.get_recommendations(**test_params)
                    logger.info(f"\n{category.upper()} Recommendations:")
                    for i, rec in enumerate(recommendations, 1):
                        logger.info(f"\nStock {i}:")
                        logger.info(f"Symbol: {rec['symbol']}")
                        logger.info(f"Current Price: ₹{rec['current_price']:.2f}")
                        logger.info(f"Expected Return: {rec['expected_return']*100:.2f}%")
                        logger.info(f"Risk-Adjusted Score: {rec['risk_adjusted_score']:.4f}")
                        logger.info(f"Monthly Shares Possible: {rec['shares_possible']:.2f}")
                        logger.info(f"Projected Value: ₹{rec['projected_value']:.2f}")
                        
                        # Risk metrics
                        risk = rec['risk_metrics']
                        logger.info("\nRisk Metrics:")
                        logger.info(f"Volatility: {risk['volatility']:.4f}")
                        logger.info(f"Sharpe Ratio: {risk['sharpe_ratio']:.4f}")
                        logger.info(f"Sortino Ratio: {risk['sortino_ratio']:.4f}")
                        logger.info(f"Max Drawdown: {risk['max_drawdown']*100:.2f}%")
                        
                        # Technical indicators
                        tech = rec['technical_indicators']
                        logger.info("\nTechnical Indicators:")
                        logger.info(f"RSI: {tech['rsi']:.2f}")
                        logger.info(f"MACD: {tech['macd']:.4f}")
                        logger.info(f"BB Position: {tech['bb_position']:.4f}")
                        logger.info(f"Volume Ratio: {tech['volume_ratio']:.2f}")
                else:
                    logger.warning(f"No trained model found for {category}")
            except Exception as e:
                logger.error(f"Error testing {category} recommendations: {str(e)}")
        
        logger.info("\nTesting combined recommendations across all categories:")
        try:
            all_recommendations = StockRecommender.get_all_recommendations(**test_params)
            logger.info("\nTop 5 Recommendations Across All Categories:")
            for i, rec in enumerate(all_recommendations, 1):
                logger.info(f"\nStock {i}:")
                logger.info(f"Symbol: {rec['symbol']}")
                logger.info(f"Category: {rec['market_cap_category']}")
                logger.info(f"Current Price: ₹{rec['current_price']:.2f}")
                logger.info(f"Expected Return: {rec['expected_return']*100:.2f}%")
                logger.info(f"Risk-Adjusted Score: {rec['risk_adjusted_score']:.4f}")
                logger.info(f"Projected Value: ₹{rec['projected_value']:.2f}")
        except Exception as e:
            logger.error(f"Error testing combined recommendations: {str(e)}")
            
        logger.info("\nTest completed successfully!")
        
    except Exception as e:
        logger.error(f"Test failed: {str(e)}")

if __name__ == "__main__":
    test_stock_recommender() 