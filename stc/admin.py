from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Category, Course, Lesson, Enrollment, LessonProgress,Video, InstructorProfile


class UserAdmin(BaseUserAdmin):
    # existing fieldsets er shathe amader extra field (role, phone) jog kora holo
    fieldsets = BaseUserAdmin.fieldsets + (
        ("Extra Info", {"fields": ("role", "phone_number")}),
    )
    # "Add user" form e o role, phone dekhabe
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ("Extra Info", {"fields": ("role", "phone_number")}),
    )
    list_display = ("username", "email", "role", "is_staff")
    list_filter = ("role", "is_staff", "is_active")


admin.site.register(User, UserAdmin)
admin.site.register(Category)
admin.site.register(Course)
admin.site.register(Lesson)
admin.site.register(Enrollment)
admin.site.register(LessonProgress)
admin.site.register(Video)
admin.site.register(InstructorProfile)