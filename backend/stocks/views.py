from rest_framework.decorators import api_view
from rest_framework.response import Response
from nselib import capital_market
from rest_framework.views import APIView
from rest_framework import status
from .ml_model import StockRecommender
import json

# Expanded list of NSE stocks to consider
NSE_SYMBOLS = [
    # Large Cap
    'RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK',
    'HINDUNILVR', 'SBIN', 'BHARTIARTL', 'ITC', 'KOTAKBANK',
    'LT', 'HCLTECH', 'ASIANPAINT', 'AXISBANK', 'MARUTI',
    'ULTRACEMCO', 'TITAN', 'BAJFINANCE', 'NESTLEIND', 'TATASTEEL',
    
    # Mid Cap
    'ADANIENT', 'ADANIPORTS', 'ADANIPOWER', 'BAJAJFINSV', 'BAJAJHLDNG',
    'BAJAJ-AUTO', 'BANKBARODA', 'BERGEPAINT', 'BPCL', 'BRITANNIA',
    'CADILAHC', 'CIPLA', 'COALINDIA', 'COLPAL', 'CONCOR',
    'CUMMINSIND', 'DLF', 'DABUR', 'DIVISLAB', 'DRREDDY',
    
    # Small Cap
    'AARTIDRUGS', 'AARTIIND', 'AARVEEDEN', 'ABBOTINDIA', 'ABFRL',
    'ACC', 'ADANIGREEN', 'ADANITRANS', 'ADVENZYMES', 'AFFLE',
    'AGARIND', 'AGCNET', 'AGSTRA', 'AHLUCONT', 'AIAENG'
]

@api_view(["GET"])
def get_top_10_stocks(request):
    try:
        TOP_10_COMPANIES = NSE_SYMBOLS[:10]
        stock_data = {}

        for symbol in TOP_10_COMPANIES:
            data = capital_market.index_data(symbol)
            stock_data[symbol] = {
                "symbol": symbol,
                "lastPrice": data.get("last", 0),
                "open": data.get("open", 0),
                "high": data.get("high", 0),
                "low": data.get("low", 0),
                "previousClose": data.get("previousClose", 0),
            }

        return Response({"data": stock_data})
    except Exception as e:
        return Response({"error": str(e)}, status=500)

class StockRecommendationView(APIView):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.recommender = StockRecommender()
        # Train the model on initialization
        self.recommender.train(NSE_SYMBOLS)
    
    def post(self, request):
        try:
            # Get parameters from request
            data = json.loads(request.body)
            rts_score = float(data.get('rts_score', 50))
            target_amount = float(data.get('target_amount', 0))
            monthly_investment = float(data.get('monthly_investment', 0))
            investment_duration = int(data.get('investment_duration', 12))
            
            # Validate parameters
            if not all([rts_score, target_amount, monthly_investment, investment_duration]):
                return Response(
                    {'error': 'Missing required parameters'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if not (0 <= rts_score <= 100):
                return Response(
                    {'error': 'RTS score must be between 0 and 100'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get recommendations
            recommendations = self.recommender.get_recommendations(
                rts_score=rts_score,
                target_amount=target_amount,
                monthly_investment=monthly_investment,
                investment_duration=investment_duration
            )
            
            return Response({
                'recommendations': recommendations,
                'parameters': {
                    'rts_score': rts_score,
                    'target_amount': target_amount,
                    'monthly_investment': monthly_investment,
                    'investment_duration': investment_duration
                }
            })
            
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

@api_view(["GET"])
def get_stock_details(request, symbol):
    try:
        data = capital_market.index_data(symbol)
        return Response({
            "symbol": symbol,
            "lastPrice": data.get("last", 0),
            "open": data.get("open", 0),
            "high": data.get("high", 0),
            "low": data.get("low", 0),
            "previousClose": data.get("previousClose", 0),
            "change": data.get("change", 0),
            "pChange": data.get("pChange", 0),
            "volume": data.get("volume", 0),
            "value": data.get("value", 0)
        })
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(["GET"])
def get_market_overview(request):
    try:
        # Get NIFTY 50 data
        nifty_data = capital_market.index_data("NIFTY 50")
        
        # Get sector indices
        sector_indices = {
            "NIFTY BANK": capital_market.index_data("NIFTY BANK"),
            "NIFTY IT": capital_market.index_data("NIFTY IT"),
            "NIFTY AUTO": capital_market.index_data("NIFTY AUTO"),
            "NIFTY PHARMA": capital_market.index_data("NIFTY PHARMA"),
            "NIFTY FMCG": capital_market.index_data("NIFTY FMCG")
        }
        
        return Response({
            "nifty_50": nifty_data,
            "sector_indices": sector_indices
        })
    except Exception as e:
        return Response({"error": str(e)}, status=500)
