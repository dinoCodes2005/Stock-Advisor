from django.urls import path
from .consumers import StockConsumer

websocket_urlpatterns = [
    path("ws/data/",StockConsumer.as_asgi()),
]
