from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Investment(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    INVESTMENT_GOAL_CHOICES = [("growth", "Growth"),
                               ("income", "Income"),
                               ("stability", "Stability"),]

    INVESTMENT_FREQUENCY_CHOICES = [("monthly", "Monthly"),
                                    ("quarterly", "Quarterly"),
                                    ("annually", "Annually"),]
    
    investment_amount = models.DecimalField(
        max_digits=10, decimal_places=2, default=5000
    )
    investment_duration = models.PositiveIntegerField(default=5)
    risk_tolerance = models.PositiveIntegerField(default=50)
    investment_goal = models.CharField(
        max_length=20, choices=INVESTMENT_GOAL_CHOICES, default="growth"
    )
    investment_frequency = models.CharField(
        max_length=20,choices=INVESTMENT_FREQUENCY_CHOICES,default="monthly"
    )
    enable_auto_invest = models.BooleanField(default=False)
    enable_diversification = models.BooleanField(default=True)
    enable_tax_optimization = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Investment: {self.investment_amount} - {self.investment_goal}"