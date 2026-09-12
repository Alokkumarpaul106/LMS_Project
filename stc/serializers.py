from rest_framework import serializers
from .models import User,Category,Course,LessonProgress,Lesson,Enrollment, Video, InstructorProfile
from django.contrib.auth.password_validation import validate_password

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model=Category
        fields="__all__"

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model=Course
        fields="__all__"

        extra_kwargs = {
            "instructor": {"read_only": True}   # <-- frontend theke pathate hobe na, view e set hobe
        }


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model=Lesson
        fields="__all__"

class EnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model=Enrollment
        fields="__all__"
        extra_kwargs = {
            "student": {"read_only": True}
        }

class LessonProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model=LessonProgress
        fields="__all__"
        extra_kwargs = {
            "student": {"read_only": True}
        }
        
        
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=['id','username','first_name','last_name','phone_number','email','role','password']
        extra_kwargs={
            "password":{'write_only':True}
        }

    def validate_password(self, value):
            validate_password(value)   # <-- Django er built-in strong-password check
            return value

    def create(self,validated_data):
        user=User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get("first_name",""),
            last_name=validated_data.get("last_name",""),
            phone_number=validated_data.get("phone_number",""),
            role=validated_data.get("role","student"),
        )
        return user


class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model=Video
        fields="__all__"

class InstructorSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=['id','username','first_name','last_name','email','phone_number']


class InstructorProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model=InstructorProfile
        fields=['id','user','bio','profile_picture','social_links']


