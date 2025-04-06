from django.contrib import admin

from .models import Investment, Recommendation

# Register your models here.
admin.site.register(Investment)
admin.site.register(Recommendation)
