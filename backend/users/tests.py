from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from users.models import UserProfile

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
        
