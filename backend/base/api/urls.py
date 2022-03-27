from django.urls import path
from . import views

# import form views.py
from .views import MyTokenObtainPairView

from rest_framework_simplejwt.views import (
    # Don't need this line non more, going to use MyTokenObtainPairView from views.py
    # TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('', views.getRoutes),
    path('notes/', views.getNotes),
    # In documentation of simple jwt, the bottom routes have 'api/token/' and 'api/token/refresh/', since we already have 'api/' in backend urls.py we can omit it.
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    

    

]
