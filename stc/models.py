from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
# Create your models here.

class User(AbstractUser):
    email=models.EmailField(unique=True)
    phone_number=models.CharField(max_length=15,blank=True)
    ROLE_CHOICES=(
         ("admin", "Admin"),
        ("student",'Student'),
        ("instructor","Instructor")

    )

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default='student'
    )

    def __str__(self):
        return self.username

# category

class Category(models.Model):
    name=models.CharField(max_length=100)
    description=models.TextField(blank=True)
    created_at=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

# course

class Course(models.Model):
    title=models.CharField(max_length=100)
    description=models.TextField()
    thumbnail=models.ImageField(upload_to='courses/',blank=True,null=True)
    instructor=models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,related_name="courses")
    category=models.ForeignKey(Category,on_delete=models.SET_NULL,null=True,blank=True,related_name="courses")
    price=models.DecimalField(max_digits=10,decimal_places=2,default=0)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

# lesson

class Lesson(models.Model):
    course=models.ForeignKey(Course,on_delete=models.CASCADE,related_name="lessons")
    title=models.CharField(max_length=100)
    content=models.TextField()
    video_url=models.URLField(blank=True)
    order=models.PositiveIntegerField(default=1)
    created_at=models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title

# enrollment

class Enrollment(models.Model):
    student=models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,related_name="enrollments")
    course=models.ForeignKey(Course,on_delete=models.CASCADE,related_name="enrollments")
    enrolled_at=models.DateTimeField(auto_now_add=True)
    status=models.CharField(max_length=20,choices=[
        ("pending","pending"),
        ("approved","approved"),
        ("rejected","rejected")

    ],
    default="pending"
    )

    class Meta:
        unique_together=('student','course')


    def __str__(self):
        return f"{self.student.username}-{self.course.title}"

# lesson progress

class LessonProgress(models.Model):
    student=models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,related_name="lesson_progress")
    lesson=models.ForeignKey(Lesson,on_delete=models.CASCADE,related_name="progress")
    completed=models.BooleanField(default=False)
    completed_at=models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together=('student','lesson')

    def __str__(self):
        return f"{self.student.username}-{self.lesson.title}"


class Video(models.Model):
    title = models.CharField(max_length=100)
    video_url = models.URLField(blank=True)
    duration=models.DurationField()
    views = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class InstructorProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="instructor_profile")
    bio = models.TextField(blank=True)
    profile_picture = models.ImageField(upload_to='instructors/', blank=True, null=True)
    social_links = models.JSONField(blank=True, null=True)  # Store social media links as JSON

    def __str__(self):
        return self.user.username









