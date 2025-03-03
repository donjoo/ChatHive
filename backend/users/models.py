import profile
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.utils import timezone
import random
from datetime import timedelta
from django.utils.timezone import now


# Create your models here.

class MyAccountManager(BaseUserManager):
    def create_user(self, username, email, password = None):
        if not email:
            raise ValueError('User must have an email address')
        if not username:
            raise ValueError('User must have an username')
        
        user = self.model(
            email = self.normalize_email(email),
            username = username,
        )
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, username, password):
        user = self.create_user(
            email       = self.normalize_email(email),
            username    = username,
            password    = password,
        )
        user.is_admin = True
        user.is_active      = True
        user.is_staff       = True
        user.is_superadmin  = True     
        user.save(using=self._db)
        return user

class CustomUser(AbstractBaseUser):
    username        = models.CharField(max_length=50, unique=True)
    email           = models.EmailField(max_length=100, unique=True)
    is_active       = models.BooleanField(default=True)
    is_deleted      = models.BooleanField(default=False)
    email_verified = models.BooleanField(default=False)
    date_joined     = models.DateTimeField(auto_now_add=True)
    is_admin        = models.BooleanField(default=False)
    is_staff        = models.BooleanField(default=False)
    is_superadmin   = models.BooleanField(default=False)

    USERNAME_FIELD  = 'email'
    REQUIRED_FIELDS = ['username']

    objects         = MyAccountManager()

    def __str__(self):
        return self.email
    
    def has_perm(self, perm, obj=None):
        return self.is_admin
    
    def has_module_perms(self,app_label):
        return True

class UserProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    profile_picture = models.ImageField(upload_to='user/profile_pic/', null=True, blank=True)

    def __str__(self):
        return str(self.user.first_name)




class OTPRecord(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='otp_record')
    otp = models.CharField(max_length=4)  # Assuming OTP is a 6-character string
    created_at = models.DateTimeField()  # Timestamp for when OTP was created
    expires_at = models.DateTimeField()  # Timestamp for OTP expiration time

    def __str__(self):
        return f"OTP for {self.user.username}"

    def is_expired(self):
        # Checks if the OTP is expired
        return self.expires_at < timezone.now()
    

    def generate_otp(self):
        """Generate a new OTP and set its expiration time."""
        self.otp = str(random.randint(1000, 9999))  # Generate a random 4-digit OTP
        # self.expires_at = timezone.now() + timedelta(minutes=5)  # Set expiration time to 5 minutes
        self.save()

    def is_valid(self):
        """Check if the OTP is still valid."""
        return timezone.now() < self.expires_at
