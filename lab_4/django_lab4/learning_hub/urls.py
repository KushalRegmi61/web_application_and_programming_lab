from django.contrib.auth import views as auth_views
from django.urls import path

from . import views

app_name = "learning_hub"

urlpatterns = [
    path("", views.home, name="home"),
    path("hello/<str:name>/", views.hello, name="hello"),
    path("auth/register/", views.register_user, name="register"),
    path(
        "auth/login/",
        auth_views.LoginView.as_view(template_name="registration/login.html"),
        name="login",
    ),
    path("auth/logout/", auth_views.LogoutView.as_view(), name="logout"),
    path("session/feedback/", views.feedback_session_view, name="feedback"),
    path("cookies/theme/<str:theme>/", views.set_theme_cookie, name="set_theme_cookie"),
    path("courses/", views.course_list, name="course_list"),
    path("courses/new/", views.course_create, name="course_create"),
    path("courses/<int:pk>/", views.course_detail, name="course_detail"),
    path("courses/<int:pk>/edit/", views.course_update, name="course_update"),
    path("courses/<int:pk>/delete/", views.course_delete, name="course_delete"),
    path("documents/", views.document_list, name="document_list"),
    path("documents/new/", views.document_create, name="document_create"),
    path("documents/<int:pk>/edit/", views.document_update, name="document_update"),
    path("documents/<int:pk>/delete/", views.document_delete, name="document_delete"),
    path("staff/dashboard/", views.staff_dashboard, name="staff_dashboard"),
    path("api/status/", views.api_status, name="api_status"),
    path("debug/raise-error/", views.raise_demo_error, name="raise_demo_error"),
]
