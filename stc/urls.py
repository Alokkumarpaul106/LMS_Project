from django.urls import path,include
from .views import CategoryViewSet,CourseViewSet,UserViewSet,EnrollmentViewSet,LessonViewSet,LessonProgressViewSet,VideoViewSet,InstructorViewSet
from rest_framework.routers import DefaultRouter
# api er jonno router create kora holo, jekhane amra viewset gulo register korbo
router=DefaultRouter()
router.register("users",UserViewSet)
router.register("categories",CategoryViewSet)
router.register("courses",CourseViewSet)
router.register("lessons",LessonViewSet)
router.register("enrollments",EnrollmentViewSet)
router.register("progress",LessonProgressViewSet)
router.register("videos",VideoViewSet)
router.register("instructors",InstructorViewSet)
urlpatterns=[
   path('',include(router.urls))
]