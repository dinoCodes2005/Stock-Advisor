from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator


# Create your models here.
class Investment(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    RISK_TOLERANCE_CHOICES = [("low", "low"),
                               ("medium", "medium"),
                               ("high", "high"),]

    INVESTMENT_FREQUENCY_CHOICES = [("monthly", "Monthly"),
                                    ("quarterly", "Quarterly"),
                                    ("annually", "Annually"),]
    
    investment_amount = models.DecimalField(
        max_digits=10, decimal_places=2, default=5000
    )
    investment_duration = models.PositiveIntegerField(default=5)
    risk_tolerance = models.CharField(max_length=10,choices=RISK_TOLERANCE_CHOICES,default="low")
    investment_goal = models.DecimalField(
        max_digits=10, decimal_places=2, default=10000
    )
    investment_frequency = models.CharField(
        max_length=20,choices=INVESTMENT_FREQUENCY_CHOICES,default="monthly"
    )
    rtsScore = models.DecimalField( max_digits=3,
                                    decimal_places=2,
                                    validators=[
                                        MinValueValidator(0),
                                        MaxValueValidator(1)
                                    ],
                                    default=0.5)
    volatile = models.DecimalField( max_digits=3,
                                    decimal_places=2,
                                    validators=[
                                        MinValueValidator(0),
                                        MaxValueValidator(1)
                                    ],
                                    default=0.5)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Investment: {self.investment_amount} - {self.investment_goal}"