from django.urls import path
from ShoppingMasterOL import views

urlpatterns = [
    path('', views.index),
    path('service/', views.service),
    path('getuser/', views.get_user_image),
    path('getimg/<int:id>/', views.get_image),
    path('getjson/', views.get_detail),
    path('analysis/', views.analysis_matrix),
    path('message/', views.response_message)
]
