from .models import User,Lesson,LessonProgress,Enrollment,Course,Category,Video, InstructorProfile
from rest_framework import viewsets
from .serializers import UserSerializer,CategorySerializer,CourseSerializer,EnrollmentSerializer,LessonSerializer,LessonProgressSerializer,VideoSerializer,InstructorProfileSerializer
from .permissions import IsAdmin
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework.decorators import permission_classes
from rest_framework.exceptions import PermissionDenied

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    def get_permissions(self):
        if self.action in ["list","retrieve"]:
            permission_classes=[IsAuthenticated]

        else:
            permission_classes=[IsAdmin]
        return [permission() for permission in permission_classes]
    




class CourseViewSet(viewsets.ModelViewSet):
    queryset=Course.objects.all()
    serializer_class=CourseSerializer
    permission_classes=[IsAuthenticated]

    def get_queryset(self):
        user=self.request.user

        if user.role=='admin':
            return Course.objects.all()

        if user.role=="instructor":
            return Course.objects.filter(instructor=user)
        if user.role=="student":
            return Course.objects.all()
        return Course.objects.none()


    def perform_create(self,serializer):
        if self.request.user.role=="instructor":
            serializer.save(instructor=self.request.user)

        elif self.request.user.role=='admin':
            serializer.save(instructor=self.request.user)

        else:
            raise PermissionDenied("Student cannot create course.")

    def perform_update(self, serializer):
        course=self.get_object()

        if self.request.user.role=="admin":
            serializer.save()

        elif(
            self.request.user.role=="instructor"
            and course.instructor==self.request.user
        ):
            serializer.save()
        else:
            raise PermissionDenied("you can only uqdate your own course.")

    def perform_destroy(self, instance):
        if self.request.user.role=="admin":
            instance.delete()
        elif(self.request.user.role=="instructor" and instance.instructor==self.request.user ):
            instance.delete()

        else:
            raise PermissionDenied("you can only delete your own course.")



class LessonViewSet(viewsets.ModelViewSet):
    queryset=Lesson.objects.all()
    serializer_class=LessonSerializer
    permission_classes=[IsAuthenticated]

    def get_queryset(self):
        user=self.request.user

        if user.role=="admin":
            qs= Lesson.objects.all()

        elif user.role=="instructor":
            qs= Lesson.objects.filter(course__instructor=user)

        elif user.role=="student":
            qs= Lesson.objects.filter(course__enrollments__student=user)
        else:
            return Lesson.objects.none() 
        # akane course onujaiee lesson asbe
        course_id = self.request.query_params.get("course")
        if course_id:
            qs = qs.filter(course_id=course_id)

        return qs
    
    
    def perform_create(self, serializer):
        user=self.request.user
        course=serializer.validated_data["course"]

        if user.role=="admin":
            serializer.save()
        elif user.role=="instructor" and course.instructor==user:
            serializer.save()

        else:
            raise PermissionDenied("you can only create lessos for your own couse.")
    def perform_update(self, serializer):
        user=self.request.user
        lesson=self.get_object()

        if user.role=="admin":
            serializer.save()
        elif user.role=="instructor" and lesson.course.instructor==user:
            serializer.save()

        else:
            raise PermissionDenied("You can only update lessons from your own course.")

    def perform_destroy(self, instance):
        user=self.request.user

        if user.role=="admin":
            instance.delete()
        elif user.role=="instructor" and instance.course.instructor==user:
            instance.delete()
        else:
            raise PermissionDenied("You can only delete lessons from your own course.")
        


    
        

class LessonProgressViewSet(viewsets.ModelViewSet):
    queryset=LessonProgress.objects.all()
    serializer_class=LessonProgressSerializer
    permission_classes=[IsAuthenticated]

    def get_queryset(self):
        user=self.request.user

        if user.role=="admin":
            return LessonProgress.objects.all()

        if user.role=="student":
            return LessonProgress.objects.filter(student=user)
        return LessonProgress.objects.none()

    def perform_create(self, serializer):
        user=self.request.user

        if user.role=="student":
            serializer.save(student=user)
        elif user.role=="admin":
            serializer.save()
        else:
            raise PermissionDenied("Instructor cannot create lesson progress.")



class EnrollmentViewSet(viewsets.ModelViewSet):
    queryset=Enrollment.objects.all()
    serializer_class=EnrollmentSerializer
    permission_classes=[IsAuthenticated]

    def get_queryset(self):
        user=self.request.user

        if user.role=="admin":
            return Enrollment.objects.all()

        if user.role=="student":
            return Enrollment.objects.filter(student=user)
        return Enrollment.objects.none()

    def perform_create(self, serializer):
        user=self.request.user

        if user.role == "student":
            serializer.save(student=user)

        elif user.role == "admin":
            serializer.save()

        else:
            raise PermissionDenied(
                "Instructor cannot create enrollment."
            )

    def perform_update(self, serializer):
        user=self.request.user
        enrollment=self.get_object()

        if user.role == "admin":
            serializer.save()

        elif user.role == "student" and enrollment.student == user:
            serializer.save()

        else:
            raise PermissionDenied(
                "You can only update your own enrollment."
            )

    def perform_destroy(self, instance):
        user=self.request.user

        if user.role == "admin":
            instance.delete()

        elif user.role == "student" and instance.student == user:
            instance.delete()

        else:
            raise PermissionDenied(
                "You can only delete your own enrollment."
            )



        

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action == "create":
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        user = self.request.user
        # admin shobai ke dekhbe, baki keu sudhu nijeke
        if user.is_authenticated and user.role == "admin":
            return User.objects.all()
        return User.objects.filter(id=user.id)

    def perform_create(self, serializer):
        request_user = self.request.user

        if request_user and request_user.is_authenticated and request_user.role == "admin":
            serializer.save()
        else:
            serializer.save(role="student")

    def perform_update(self, serializer):
        user = self.request.user
        target = self.get_object()

        if user.role == "admin":
            serializer.save()
        elif target.id == user.id:
            serializer.save(role=target.role)  # nijer role nijei change korte parbe na
        else:
            raise PermissionDenied("You can only update your own profile.")

    def perform_destroy(self, instance):
        user = self.request.user

        if user.role == "admin":
            if instance.role == "admin" and User.objects.filter(role="admin").count() == 1:
                raise PermissionDenied("Cannot delete the last remaining admin.")
            instance.delete()
        else:
            raise PermissionDenied("Only admin can delete an account.")

class VideoViewSet(viewsets.ModelViewSet):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.role == "admin":
            return Video.objects.all()

        if user.role == "instructor":
            return Video.objects.all()  # Instructors can view all videos

        if user.role == "student":
            return Video.objects.all()  # Students can view all videos

        return Video.objects.none()

class InstructorViewSet(viewsets.ModelViewSet):
    queryset = InstructorProfile.objects.all()
    serializer_class = InstructorProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.role == "admin":
            return InstructorProfile.objects.all()

        if user.role == "instructor":
            return InstructorProfile.objects.filter(user=user)

        if user.role == "student":
            return InstructorProfile.objects.all()

        return InstructorProfile.objects.none()