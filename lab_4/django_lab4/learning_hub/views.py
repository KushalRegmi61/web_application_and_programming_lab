from django.contrib import messages
from django.contrib.auth import get_user_model, login
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseForbidden, JsonResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.utils import timezone

from .forms import CourseForm, DocumentRecordForm, RegistrationForm, SessionFeedbackForm
from .models import Course, DocumentRecord


def home(request):
    if request.GET.get("format") == "json":
        return JsonResponse(
            {
                "message": "Welcome to the Lab 4 Django demo.",
                "time": timezone.now().isoformat(),
                "authenticated": request.user.is_authenticated,
            }
        )

    context = {
        "course_count": Course.objects.count(),
        "document_count": DocumentRecord.objects.count(),
        "theme_cookie": request.COOKIES.get("theme", "not-set"),
    }
    return render(request, "learning_hub/home.html", context)


def hello(request, name):
    return HttpResponse(f"Hello, {name.title()}! This response was returned by a Django view.")


def register_user(request):
    if request.user.is_authenticated:
        return redirect("learning_hub:home")

    if request.method == "POST":
        form = RegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, "Registration successful. You are now logged in.")
            return redirect("learning_hub:home")
    else:
        form = RegistrationForm()
    return render(request, "learning_hub/register.html", {"form": form})


def feedback_session_view(request):
    form = SessionFeedbackForm(request.POST or None)
    feedback_history = request.session.get("feedback_history", [])
    submission_count = request.session.get("feedback_submission_count", 0)

    if request.method == "POST" and form.is_valid():
        feedback_data = {
            "full_name": form.cleaned_data["full_name"],
            "topic": form.cleaned_data["topic"],
            "message": form.cleaned_data["message"],
            "submitted_at": timezone.now().strftime("%Y-%m-%d %H:%M:%S"),
        }
        feedback_history.insert(0, feedback_data)
        feedback_history = feedback_history[:5]
        request.session["feedback_history"] = feedback_history
        request.session["feedback_submission_count"] = submission_count + 1

        response = redirect("learning_hub:feedback")
        response.set_cookie(
            "last_feedback_user",
            feedback_data["full_name"],
            max_age=3600,
            httponly=True,
            samesite="Lax",
        )
        messages.success(request, "Feedback saved in session storage.")
        return response

    context = {
        "form": form,
        "feedback_history": feedback_history,
        "submission_count": submission_count,
        "last_feedback_user": request.COOKIES.get("last_feedback_user", "N/A"),
    }
    return render(request, "learning_hub/feedback.html", context)


def set_theme_cookie(request, theme):
    safe_theme = "dark" if theme.lower() == "dark" else "light"
    response = redirect("learning_hub:home")
    response.set_cookie("theme", safe_theme, max_age=86400, samesite="Lax")
    messages.info(request, f"Theme cookie set to '{safe_theme}'.")
    return response


def course_list(request):
    courses = Course.objects.select_related("department", "created_by")
    return render(request, "learning_hub/courses/course_list.html", {"courses": courses})


@login_required
def course_create(request):
    form = CourseForm(request.POST or None)
    if request.method == "POST" and form.is_valid():
        course = form.save(commit=False)
        course.created_by = request.user
        course.save()
        messages.success(request, "Course created successfully.")
        return redirect("learning_hub:course_list")
    return render(request, "learning_hub/courses/course_form.html", {"form": form, "mode": "Create"})


def course_detail(request, pk):
    course = get_object_or_404(Course.objects.select_related("department", "created_by"), pk=pk)
    return render(request, "learning_hub/courses/course_detail.html", {"course": course})


def _can_manage_course(user, course):
    return user.is_staff or course.created_by_id == user.id


@login_required
def course_update(request, pk):
    course = get_object_or_404(Course, pk=pk)
    if not _can_manage_course(request.user, course):
        return HttpResponseForbidden("You are not allowed to edit this course.")

    form = CourseForm(request.POST or None, instance=course)
    if request.method == "POST" and form.is_valid():
        form.save()
        messages.success(request, "Course updated successfully.")
        return redirect("learning_hub:course_detail", pk=course.pk)
    return render(request, "learning_hub/courses/course_form.html", {"form": form, "mode": "Edit"})


@login_required
def course_delete(request, pk):
    course = get_object_or_404(Course, pk=pk)
    if not _can_manage_course(request.user, course):
        return HttpResponseForbidden("You are not allowed to delete this course.")

    if request.method == "POST":
        course.delete()
        messages.success(request, "Course deleted successfully.")
        return redirect("learning_hub:course_list")
    return render(request, "learning_hub/courses/course_confirm_delete.html", {"course": course})


@login_required
def document_list(request):
    queryset = DocumentRecord.objects.filter(owner=request.user)
    if request.user.is_staff:
        queryset = DocumentRecord.objects.select_related("owner")

    return render(request, "learning_hub/documents/document_list.html", {"documents": queryset})


@login_required
def document_create(request):
    form = DocumentRecordForm(request.POST or None)
    if request.method == "POST" and form.is_valid():
        document = form.save(commit=False)
        document.owner = request.user
        document.save()
        messages.success(request, "Document stored successfully.")
        return redirect("learning_hub:document_list")
    return render(
        request,
        "learning_hub/documents/document_form.html",
        {"form": form, "mode": "Create"},
    )


def _get_document_for_user(user, pk):
    if user.is_staff:
        return get_object_or_404(DocumentRecord, pk=pk)
    return get_object_or_404(DocumentRecord, pk=pk, owner=user)


@login_required
def document_update(request, pk):
    document = _get_document_for_user(request.user, pk)
    form = DocumentRecordForm(request.POST or None, instance=document)
    if request.method == "POST" and form.is_valid():
        form.save()
        messages.success(request, "Document updated successfully.")
        return redirect("learning_hub:document_list")
    return render(
        request,
        "learning_hub/documents/document_form.html",
        {"form": form, "mode": "Edit"},
    )


@login_required
def document_delete(request, pk):
    document = _get_document_for_user(request.user, pk)
    if request.method == "POST":
        document.delete()
        messages.success(request, "Document deleted successfully.")
        return redirect("learning_hub:document_list")
    return render(
        request,
        "learning_hub/documents/document_confirm_delete.html",
        {"document": document},
    )


@login_required
def staff_dashboard(request):
    if not request.user.is_staff:
        return HttpResponseForbidden("Staff access only.")

    context = {
        "total_courses": Course.objects.count(),
        "total_documents": DocumentRecord.objects.count(),
        "total_users": get_user_model().objects.count(),
    }
    return render(request, "learning_hub/staff_dashboard.html", context)


def api_status(request):
    if not request.session.session_key:
        request.session.save()

    return JsonResponse(
        {
            "status": "ok",
            "method": request.method,
            "session_key": request.session.session_key,
            "authenticated": request.user.is_authenticated,
            "current_user": request.user.username if request.user.is_authenticated else "anonymous",
        }
    )


def raise_demo_error(request):
    raise RuntimeError("Intentional error route for middleware error handling demo.")


def error_403(request, exception):
    return render(
        request,
        "errors/403.html",
        {"error_message": "You do not have permission to access this resource."},
        status=403,
    )


def error_404(request, exception):
    return render(
        request,
        "errors/404.html",
        {"error_message": "The requested page could not be found."},
        status=404,
    )


def error_500(request):
    return render(
        request,
        "errors/500.html",
        {"error_message": "The server encountered an internal error."},
        status=500,
    )
