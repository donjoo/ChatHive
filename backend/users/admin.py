from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, UserProfile, OTPRecord

class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'username', 'is_active', 'is_staff', 'is_superadmin')
    search_fields = ('email', 'username')
    readonly_fields = ('date_joined',)

    filter_horizontal = ()
    list_filter = ('is_active', 'is_staff', 'is_superadmin')
    fieldsets = (
        ('Personal Info', {'fields': ('username', 'email', 'password')}),
        ('Permissions', {'fields': ('is_admin', 'is_staff', 'is_superadmin', 'is_active')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2'),
        }),
    )

admin.site.register(CustomUser, CustomUserAdmin)

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'profile_picture')
    search_fields = ('user__email', 'user__username')

@admin.register(OTPRecord)
class OTPRecordAdmin(admin.ModelAdmin):
    list_display = ('user', 'otp', 'created_at', 'expires_at')
    search_fields = ('user__email', 'user__username')
    list_filter = ('expires_at',)
