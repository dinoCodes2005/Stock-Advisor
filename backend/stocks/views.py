from rest_framework.decorators import api_view
from rest_framework.response import Response
from nselib import capital_market

@api_view(["GET"])
def get_top_10_stocks(request):
    try:
        TOP_10_COMPANIES = [
            "RELIANCE", "TCS", "INFY", "HDFCBANK", "HDFC",
            "ICICIBANK", "BHARTIARTL", "KOTAKBANK", "LT", "ITC"
        ]
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
