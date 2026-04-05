from django.contrib import admin

from .models import Course, Department, DocumentRecord


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ("name", "code")
    search_fields = ("name", "code")


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ("code", "title", "department", "credits", "created_by", "updated_at")
    list_filter = ("department", "credits")
    search_fields = ("code", "title", "description")


@admin.register(DocumentRecord)
class DocumentRecordAdmin(admin.ModelAdmin):
    list_display = ("label", "owner", "updated_at")
    search_fields = ("label", "owner__username")
