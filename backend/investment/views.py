# views.py
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import InvestmentSerializer
from stocks.ml_model import StockRecommender
from stocks.train_model import train_models  # Add this import
from .models import Recommendation
import os
import logging

# Configure logging
logger = logging.getLogger(__name__)

class CreateInvestment(APIView):
    def post(self, request):
        serializer = InvestmentSerializer(data=request.data)
        if serializer.is_valid():
            investment = serializer.save()

            # Extract values from validated data
            data = serializer.validated_data
            rts_score = float(data.get("rts_score", 50))
            target_amount = float(data.get("target_amount", 1000000))
            monthly_investment = float(data.get("monthly_investment", 50000))
            investment_duration = int(data.get("investment_duration", 60))

            try:
                # First ensure models are trained
                logger.info("Training models for all categories...")
                train_models()
                
                # Prepare parameters
                test_params = {
                    'rts_score': rts_score,
                    'target_amount': target_amount,
                    'monthly_investment': monthly_investment,
                    'investment_duration': investment_duration,
                }
                
                # Get recommendations
                all_recommendations = StockRecommender.get_all_recommendations(**test_params)
                
                # Save recommendations to database
                for rec in all_recommendations:
                    Recommendation.objects.create(
                        investment=investment,
                        stock_name=rec['symbol'],
                        weight=float(rec.get('weight', 0)),
                        notes=rec.get('market_cap_category', '')
                    )

                return Response({
                    "investment": serializer.data,
                    "recommendations": all_recommendations
                }, status=status.HTTP_201_CREATED)

            except Exception as e:
                logger.error(f"Error generating recommendations: {str(e)}")
                return Response({
                    "investment": serializer.data,
                    "error": "Failed to generate recommendations",
                    "details": str(e)
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)