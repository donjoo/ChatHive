from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from users.models import UserProfile
from users.serializers import UserSerializer,UserProfileSerializer


User = get_user_model()


class SignupViewTest(APITestCase):
    def test_signup_success(self):
        url = reverse('users:signup')
        data = {
            "username":"testuser",
            "email":"test@example.com",
            "password":"testpassword123"
        }
        response = self.client.post(url,data,format='json')
        self.assertEqual(response.status_code,status.HTTP_201_CREATED)
        self.assertIn('user',response.data)
        self.assertTrue(User.objects.filter(email='test@example.com').exists())
        self.assertTrue(UserProfile.objects.filter(user__email="test@example.com").exists())

    def test_signup_missing_fields(self):
        url = reverse('users:signup')
        data = {
            "email":"missing_username@example.com",
        }
        response=self.client.post(url,data,format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)



class LoginViewTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='loginuser',
            email='login@example.com',
            password='mypassword'
        )
        self.user.is_active = True
        self.user.save()

    def test_login_success(self):
        url = reverse('users:login')
        data = {
            "email":"login@example.com",
            "password":'mypassword'
        }
        response = self.client.post(url,data,format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access',response.data)


    def test_login_wrong_password(self):
        url = reverse('users:login')
        data = {
            "email":"login@example.com",
            "password":'wrongpassword',
        }
        response = self.client.post(url,data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error',response.data)


        def test_login_inactive_user(self):
            self.user.is_active =False
            self.user.save()
            url = reverse('users:login')
            data = {
                "email":"login@example.com",
                "password":"mypassword"
            }

            response = self.client.post(url,data,format='json')
            self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)



# testcase for serializers


class UserSerializerTest(APITestCase):
    def test_valid_user_creation(self):
        data = {
            "username":"Donjo",
            "email":"don@example.com",
            "password":"StrongP@ssword1"
        }
        serializer = UserSerializer(data = data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        user = serializer.save()
        self.assertEqual(user.email,data['email'])
        self.assertNotEqual(user.password, data['password'])

