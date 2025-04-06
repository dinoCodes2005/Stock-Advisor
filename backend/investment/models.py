from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator


# Create your models here.
class Investment(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)  
    monthly_investment = models.DecimalField(
        max_digits=10, decimal_places=2, default=5000
    )
    investment_duration = models.PositiveIntegerField(default=5)
    target_amount = models.DecimalField(
        max_digits=10, decimal_places=2, default=10000
    )
    rts_score = models.DecimalField(
         max_digits=3, decimal_places=1, default=50,
         validators=[MaxValueValidator(100),MinValueValidator(0)]
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Investment: {self.monthly_investment} - {self.target_amount}"
    
class Recommendation(models.Model):
    investment = models.ForeignKey(Investment, on_delete=models.CASCADE, related_name='recommendations')
    stock_name = models.CharField(max_length=100)
    weight = models.DecimalField(max_digits=5, decimal_places=2)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.stock_name} for Investment #{self.investment.id}"
