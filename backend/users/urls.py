from django.urls import path
from .views import SignupView , LoginView,OTPVerificationView,ResendOTPView,SendOtpView,ChangePasswordView,ListUsersView
from rest_framework_simplejwt.views import TokenRefreshView

app_name='users'

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('verifyotp/',OTPVerificationView.as_view(),name='verify_otp'),
    path('resend_otp/',ResendOTPView.as_view(),name="otp_resend"),
    path('login/',LoginView.as_view(), name='login'),
    path('changepassword/send-otp/', SendOtpView.as_view(), name='send_otp'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('list/',ListUsersView.as_view(),name='user_list'),
]    
    