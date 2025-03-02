from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer,UserProfileSerializer,SendOtpSerializer,ChangePasswordSerializer
from .models import UserProfile,CustomUser,OTPRecord
# admin modules import below
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAdminUser
from rest_framework.permissions import IsAuthenticated # type: ignore
from django.contrib.auth import authenticate
from .serializers import UserProfileSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
import random
from .task import sent_otp
from datetime import datetime,timedelta
from django.core.exceptions import ObjectDoesNotExist
from django.utils import timezone
from google.oauth2 import id_token
from google.auth.transport import requests
from rest_framework.exceptions import AuthenticationFailed, ParseError
from rest_framework.permissions import IsAuthenticated, IsAdminUser,AllowAny

User = get_user_model()

class SignupView(APIView):
    permission_classes = [AllowAny]
    def post(self,request):
        data = request.data
        mapped_data = {
            "username": data.get("username"),
            "email": data.get("email"),
            "password": data.get("password"),
        }
        serializer = UserSerializer(data=mapped_data)
        if serializer.is_valid():
           
            user = serializer.save()
            UserProfile.objects.create(user=user)

            try:
                self.send_otp_email(serializer.data['email'])
            except Exception as e:
                print(f"Error occurred during OTP sending: {str(e)}")
                return Response({"Message":"unknown error","error":str(e)},status=500)

           
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'token': str(refresh.access_token)
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def send_otp_email(self,email):
        random_num = random.randint(1000,9999)
        result = sent_otp.delay(f"{random_num} -OTP",email)

        otp_model_instance = OTPRecord.objects.create(
            user = User.objects.get(email=email),
            otp = random_num,
            created_at = timezone.now(),
            expires_at = timezone.now() + timedelta(minutes=5)

        )
        otp_model_instance.save()


class OTPVerificationView(APIView):
    def post(self,request):
        try:
            user = User.objects.get(email=request.data['email'])
            otp_instance = OTPRecord.objects.get(user=user)

        except ObjectDoesNotExist:
            return Response("User does not exist or OTP not generated", status=404)
    
        if int(otp_instance.otp) == int(request.data['otp']):
            user.is_active = True
            user.email_verified = True
            user.save()


            otp_instance.delete()

            return Response("user succcessfully verified", status=200)
        return Response("OTP is wrong",status=400)
    
class ResendOTPView(APIView):
    def post(self, request):
        try:
            user = User.objects.get(email=request.data['email'])
        except ObjectDoesNotExist:
            return Response("User does not exist", status=404)

        # Create a new OTP instance
        random_num = random.randint(1000, 9999)

        # Remove the old OTP instance if it exists
        OTPRecord.objects.filter(user=user).delete()

        # Create and save a new OTP record for the user
        otp_model_instance = OTPRecord.objects.create(
            user=user,
            otp=random_num,
            created_at=timezone.now(),
            expires_at=timezone.now() + timedelta(minutes=5)
        )

        # Optionally, send OTP email here (e.g., send_otp_email)
        try:
            sent_otp.delay(f"{random_num} - OTP", user.email)
        except Exception as e:
            print(f"Error sending OTP: {str(e)}")
            return Response({"message": "Error occurred while sending OTP", "error": str(e)}, status=500)

        return Response("New OTP sent successfully", status=200)


class LoginView(APIView):
    permission_classes = [AllowAny]
    def post(self,request):
        data = request.data
        email = data.get('email')
        password = data.get('password')
        try:
            user = User.objects.get(email=email)
            user = authenticate(request, email=email, password=password)
            # if user.check_password(password):
            if user is not None:
                if not user.is_active:
                        return Response({'error':'Your account has been blocked.'}, status=status.HTTP_403_FORBIDDEN)
                refresh = RefreshToken.for_user(user)
                return Response({
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email,
                    },
                     'access': str(refresh.access_token),
                     'refresh': str(refresh)
                },status=status.HTTP_200_OK)
            else:
                return Response({'error':'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
       

class SendOtpView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = SendOtpSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response({"detail": "OTP sent to your email."}, status=200)
        
        return Response(serializer.errors, status=400)

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            serializer.save()
            return Response({"detail": "Password changed successfully."}, status=200)
        
        return Response(serializer.errors, status=400)











