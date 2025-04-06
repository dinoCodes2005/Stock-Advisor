import os
import json
import time
import logging
import numpy as np
import pandas as pd
import yfinance as yf
from typing import List, Dict, Union
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestRegressor
from joblib import dump, load as joblib_load

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class StockRecommender:
    def __init__(self, model_dir: str = 'models/large_cap'):
        """Initialize the StockRecommender.
        
        Args:
            model_dir: Directory to save/load model files. Defaults to large_cap model.
                     Use 'models/mid_cap' for mid-cap stocks and 'models/small_cap' for small-cap stocks.
        """
        self.model_dir = model_dir
        self.model_path = os.path.join(model_dir, 'stock_recommender.joblib')
        self.scaler_path = os.path.join(model_dir, 'scaler.joblib')
        self.data_path = os.path.join(model_dir, 'stock_data.joblib')
        
        # Create model directory if it doesn't exist
        os.makedirs(model_dir, exist_ok=True)
        
        # Try to load existing model, scaler and data
        if os.path.exists(self.model_path) and os.path.exists(self.scaler_path):
            logger.info(f"Loading existing model and scaler from {model_dir}...")
            self.model = joblib_load(self.model_path)
            self.scaler = joblib_load(self.scaler_path)
            if os.path.exists(self.data_path):
                self.stock_data = joblib_load(self.data_path)
            else:
                self.stock_data = None
            self.is_trained = True
        else:
            logger.info(f"No existing model found in {model_dir}. Will need to train first.")
            self.model = RandomForestRegressor(n_estimators=100, random_state=42)
            self.scaler = StandardScaler()
            self.stock_data = None
            self.is_trained = False

    def save_model(self):
        """Save the trained model, scaler and stock data to disk."""
        if not self.is_trained:
            logger.warning("Cannot save untrained model")
            return
            
        logger.info("Saving model, scaler and stock data...")
        dump(self.model, self.model_path)
        dump(self.scaler, self.scaler_path)
        if self.stock_data is not None:
            dump(self.stock_data, self.data_path)
        logger.info("Model, scaler and stock data saved successfully")

    def fetch_nse_data(self, symbols: List[str], period: str = "1y") -> Dict[str, pd.DataFrame]:
        """Fetch historical data for NSE stocks"""
        data = {}
        for symbol in symbols:
            try:
                # Remove .NS suffix if present
                base_symbol = symbol.replace('.NS', '')
                ticker = yf.Ticker(f"{base_symbol}.NS")
                hist = ticker.history(period=period)
                
                if not hist.empty:
                    logger.info(f"Successfully fetched data for {symbol}")
                    data[symbol] = hist
                else:
                    logger.warning(f"No data available for {symbol}")
            except Exception as e:
                logger.error(f"Error fetching data for {symbol}: {str(e)}")
        
        if not data:
            logger.error("Failed to fetch data for any symbols")
            raise ValueError("No data could be fetched for any of the provided symbols")
            
        return data

    def calculate_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Calculate technical indicators and features for model training."""
        # Basic returns
        df['Returns'] = df['Close'].pct_change()
        df['Returns_Shifted'] = df['Returns'].shift(-1)  # Target variable
        
        # Volatility (20-day rolling standard deviation of returns)
        df['Volatility'] = df['Returns'].rolling(window=20).std()
        
        # RSI (14-day)
        delta = df['Close'].diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
        rs = gain / loss
        df['RSI'] = 100 - (100 / (1 + rs))
        
        # MACD
        exp1 = df['Close'].ewm(span=12, adjust=False).mean()
        exp2 = df['Close'].ewm(span=26, adjust=False).mean()
        df['MACD'] = exp1 - exp2
        
        # Bollinger Bands
        df['BB_middle'] = df['Close'].rolling(window=20).mean()
        bb_std = df['Close'].rolling(window=20).std()
        df['BB_upper'] = df['BB_middle'] + (bb_std * 2)
        df['BB_lower'] = df['BB_middle'] - (bb_std * 2)
        df['BB_position'] = (df['Close'] - df['BB_lower']) / (df['BB_upper'] - df['BB_lower'])
        
        # Volume indicators
        df['Volume_Ratio'] = df['Volume'] / df['Volume'].rolling(window=20).mean()
        
        # Risk metrics
        df['Max_Drawdown'] = (df['Close'] / df['Close'].expanding().max() - 1)
        df['Sharpe_Ratio'] = df['Returns'].mean() / df['Returns'].std() * np.sqrt(252)
        positive_returns = df['Returns'].copy()
        positive_returns[positive_returns < 0] = 0
        df['Sortino_Ratio'] = df['Returns'].mean() / positive_returns.std() * np.sqrt(252)
        
        # Fill NaN values with appropriate methods
        df['Returns'] = df['Returns'].fillna(0)
        df['Returns_Shifted'] = df['Returns_Shifted'].fillna(0)
        df['Volatility'] = df['Volatility'].fillna(method='bfill')
        df['RSI'] = df['RSI'].fillna(50)  # Neutral RSI value
        df['MACD'] = df['MACD'].fillna(0)
        df['BB_position'] = df['BB_position'].fillna(0.5)  # Middle of the bands
        df['Volume_Ratio'] = df['Volume_Ratio'].fillna(1)  # Normal volume
        df['Max_Drawdown'] = df['Max_Drawdown'].fillna(0)
        df['Sharpe_Ratio'] = df['Sharpe_Ratio'].fillna(0)
        df['Sortino_Ratio'] = df['Sortino_Ratio'].fillna(0)
        
        return df

    def prepare_training_data(self, stock_data: Dict[str, pd.DataFrame]) -> tuple:
        """Prepare data for model training."""
        all_X = []
        all_y = []
        
        for symbol, df in stock_data.items():
            try:
                # Calculate features
                df_processed = self.calculate_features(df)
                
                # Prepare features for training
                features = [
                    'Returns', 'Volatility', 'RSI', 'MACD', 'BB_position',
                    'Volume_Ratio', 'Max_Drawdown', 'Sharpe_Ratio', 'Sortino_Ratio'
                ]
                
                X = df_processed[features].values[:-1]  # Remove last row as it won't have a target
                y = df_processed['Returns_Shifted'].values[:-1]
                
                # Add valid samples to training data
                valid_samples = ~np.isnan(X).any(axis=1) & ~np.isnan(y)
                X = X[valid_samples]
                y = y[valid_samples]
                
                if len(X) > 0:
                    all_X.append(X)
                    all_y.append(y)
                    logger.info(f"Added {len(X)} samples from {symbol}")
            except Exception as e:
                logger.error(f"Error processing {symbol}: {str(e)}")
                continue
        
        if not all_X:
            raise ValueError("No valid training data available")
            
        X = np.vstack(all_X)
        y = np.concatenate(all_y)
        
        logger.info(f"Final training data shape: X={X.shape}, y={y.shape}")
        return X, y

    def train(self, symbols: List[str], force_retrain: bool = False):
        """Train the recommendation model.
        
        Args:
            symbols: List of stock symbols to train on
            force_retrain: Whether to force retraining even if model exists
        """
        if self.is_trained and not force_retrain:
            logger.info("Model already trained. Use force_retrain=True to retrain.")
            return
            
        # Fetch data
        self.stock_data = self.fetch_nse_data(symbols)
        
        # Prepare training data
        X, y = self.prepare_training_data(self.stock_data)
        
        # Scale features
        X_scaled = self.scaler.fit_transform(X)
        
        # Train model
        self.model.fit(X_scaled, y)
        self.is_trained = True
        
        # Save the trained model and data
        self.save_model()

    def get_stock_metrics(self, symbol: str, data: pd.DataFrame) -> Dict:
        """Calculate current metrics for a stock."""
        try:
            df = self.calculate_features(data)
            current_price = df['Close'].iloc[-1]
            
            features = [
                'Returns', 'Volatility', 'RSI', 'MACD', 'BB_position',
                'Volume_Ratio', 'Max_Drawdown', 'Sharpe_Ratio', 'Sortino_Ratio'
            ]
            
            X = df[features].iloc[-1].values.reshape(1, -1)
            X_scaled = self.scaler.transform(X)
            expected_return = self.model.predict(X_scaled)[0]
            
            risk_metrics = {
                'volatility': df['Volatility'].iloc[-1],
                'sharpe_ratio': df['Sharpe_Ratio'].iloc[-1],
                'sortino_ratio': df['Sortino_Ratio'].iloc[-1],
                'max_drawdown': df['Max_Drawdown'].iloc[-1]
            }
            
            technical_indicators = {
                'rsi': df['RSI'].iloc[-1],
                'macd': df['MACD'].iloc[-1],
                'bb_position': df['BB_position'].iloc[-1],
                'volume_ratio': df['Volume_Ratio'].iloc[-1]
            }
            
            return {
                'symbol': symbol,
                'current_price': current_price,
                'expected_return': expected_return,
                'risk_metrics': risk_metrics,
                'technical_indicators': technical_indicators
            }
            
        except Exception as e:
            logger.error(f"Error calculating metrics for {symbol}: {str(e)}")
            return None

    def calculate_risk_adjusted_score(self, metrics: Dict, rts_score: float) -> float:
        """Calculate risk-adjusted score based on metrics and risk tolerance."""
        try:
            # Normalize risk tolerance score to 0-1
            risk_tolerance = rts_score / 100
            
            # Get metrics
            expected_return = metrics['expected_return']
            volatility = metrics['risk_metrics']['volatility']
            sharpe = metrics['risk_metrics']['sharpe_ratio']
            sortino = metrics['risk_metrics']['sortino_ratio']
            max_drawdown = abs(metrics['risk_metrics']['max_drawdown'])
            
            # Technical indicators
            rsi = metrics['technical_indicators']['rsi']
            macd = metrics['technical_indicators']['macd']
            bb_pos = metrics['technical_indicators']['bb_position']
            
            # Basic return score (higher is better)
            return_score = expected_return * 2  # Give more weight to expected returns
            
            # Risk score (lower is better)
            risk_score = (
                volatility * (1 - risk_tolerance) +  # More weight for low risk tolerance
                max_drawdown * 0.5 +
                (1 - (sharpe + 2) / 4) * 0.3 +  # Normalize Sharpe ratio
                (1 - (sortino + 2) / 4) * 0.2    # Normalize Sortino ratio
            )
            
            # Technical score
            tech_score = (
                (50 <= rsi <= 70) * 0.2 +  # Reward RSI in good range
                (macd > 0) * 0.1 +         # Reward positive MACD
                (0.3 <= bb_pos <= 0.7) * 0.1  # Reward BB position in middle range
            )
            
            # Combine scores with weights based on risk tolerance
            final_score = (
                return_score * (0.5 + 0.2 * risk_tolerance) +  # More weight to returns for high RTS
                -risk_score * (0.4 - 0.1 * risk_tolerance) +   # Less weight to risk for high RTS
                tech_score * 0.1                               # Small weight to technical factors
            )
            
            return final_score
            
        except Exception as e:
            logger.error(f"Error calculating risk-adjusted score: {str(e)}")
            return -float('inf')

    def calculate_investment_metrics(
        self,
        current_price: float,
        expected_return: float,
        monthly_investment: float,
        investment_duration: int
    ) -> Dict:
        """Calculate investment-specific metrics."""
        try:
            # Calculate number of shares possible with monthly investment
            shares_possible = monthly_investment / current_price
            
            # Calculate projected value after investment duration
            monthly_return = expected_return
            future_value = monthly_investment * shares_possible * (
                1 + monthly_return) ** investment_duration
            
            return {
                'shares_possible': shares_possible,
                'projected_value': future_value
            }
            
        except Exception as e:
            logger.error(f"Error calculating investment metrics: {str(e)}")
            return None

    def get_recommendations(
        self,
        rts_score: float = 50,
        target_amount: float = 1000000,
        monthly_investment: float = 50000,
        investment_duration: int = 60
    ) -> List[Dict]:
        """Get stock recommendations based on user parameters.
        
        Args:
            rts_score: Risk tolerance score (0-100)
            target_amount: Target investment amount
            monthly_investment: Monthly investment amount
            investment_duration: Investment duration in months
            
        Returns:
            List of recommended stocks with their metrics
        """
        if not self.is_trained or self.stock_data is None:
            raise ValueError("No stock data available. Call train() method.")
            
        recommendations = []
        
        for symbol, data in self.stock_data.items():
            try:
                # Get current metrics
                metrics = self.get_stock_metrics(symbol, data)
                if metrics is None:
                    continue
                    
                # Calculate risk-adjusted score
                risk_adjusted_score = self.calculate_risk_adjusted_score(metrics, rts_score)
                metrics['risk_adjusted_score'] = risk_adjusted_score
                
                # Calculate investment-specific metrics
                investment_metrics = self.calculate_investment_metrics(
                    metrics['current_price'],
                    metrics['expected_return'],
                    monthly_investment,
                    investment_duration
                )
                
                if investment_metrics:
                    metrics.update(investment_metrics)
                    recommendations.append(metrics)
                    
            except Exception as e:
                logger.error(f"Error processing recommendations for {symbol}: {str(e)}")
                continue
        
        # Sort by risk-adjusted score
        recommendations.sort(key=lambda x: x['risk_adjusted_score'], reverse=True)
        
        # Return top 5 recommendations
        return recommendations[:5]

    @staticmethod
    def get_market_cap_category(symbol: str) -> str:
        """Get the market cap category for a stock symbol."""
        try:
            cache_dir = 'cache'
            os.makedirs(cache_dir, exist_ok=True)
            cache_file = os.path.join(cache_dir, 'nse_stocks.json')
            
            if os.path.exists(cache_file):
                with open(cache_file, 'r') as f:
                    stocks = json.load(f)['stocks']
                    
                for category, symbols in stocks.items():
                    if symbol in symbols:
                        return category
            
            return 'unknown'
            
        except Exception as e:
            logger.error(f"Error getting market cap category: {str(e)}")
            return 'unknown'

    @classmethod
    def get_recommender_for_symbol(cls, symbol: str) -> 'StockRecommender':
        """Get the appropriate recommender instance for a stock symbol."""
        category = cls.get_market_cap_category(symbol)
        return cls(model_dir=f'models/{category}')

    @staticmethod
    def get_all_recommendations(
        rts_score: float,
        target_amount: float,
        monthly_investment: float,
        investment_duration: int
    ) -> List[Dict]:
        """Get recommendations across all market cap categories.
        
        Args:
            rts_score: Risk tolerance score (0-100)
            target_amount: Target investment amount
            monthly_investment: Monthly investment amount
            investment_duration: Investment duration in months
            
        Returns:
            List of top 5 stock recommendations across all categories
        """
        all_recommendations = []
        categories = ['large_cap', 'mid_cap', 'small_cap']
        
        try:
            for category in categories:
                recommender = StockRecommender(model_dir=f'models/{category}')
                if recommender.is_trained:
                    try:
                        category_recommendations = recommender.get_recommendations(
                            rts_score=rts_score,
                            target_amount=target_amount,
                            monthly_investment=monthly_investment,
                            investment_duration=investment_duration
                        )
                        # Add market cap category to each recommendation
                        for rec in category_recommendations:
                            rec['market_cap_category'] = category
                        all_recommendations.extend(category_recommendations)
                    except Exception as e:
                        logger.error(f"Error getting recommendations for {category}: {str(e)}")
                else:
                    logger.warning(f"No trained model found for {category}")
            
            if not all_recommendations:
                raise ValueError("No recommendations available. Models need to be trained first.")
            
            # Sort all recommendations by risk-adjusted score
            all_recommendations.sort(key=lambda x: x['risk_adjusted_score'], reverse=True)
            
            # Return top 5 recommendations across all categories
            return all_recommendations[:5]
            
        except Exception as e:
            logger.error(f"Error getting recommendations across categories: {str(e)}")
            raise 