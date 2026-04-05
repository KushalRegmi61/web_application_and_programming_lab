import json

from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

from .models import Course, DocumentRecord


class RegistrationForm(UserCreationForm):
    email = forms.EmailField(required=True)

    class Meta:
        model = User
        fields = ("username", "email", "password1", "password2")


class CourseForm(forms.ModelForm):
    class Meta:
        model = Course
        fields = ("department", "title", "code", "description", "credits")
        widgets = {
            "description": forms.Textarea(attrs={"rows": 4}),
        }


class SessionFeedbackForm(forms.Form):
    full_name = forms.CharField(max_length=80)
    topic = forms.CharField(max_length=80)
    message = forms.CharField(widget=forms.Textarea(attrs={"rows": 4}), max_length=400)


class DocumentRecordForm(forms.ModelForm):
    payload_text = forms.CharField(
        label="JSON payload",
        widget=forms.Textarea(attrs={"rows": 8}),
        help_text='Example: {"tags": ["django", "orm"], "priority": 2}',
    )

    class Meta:
        model = DocumentRecord
        fields = ("label",)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance and self.instance.pk:
            self.fields["payload_text"].initial = json.dumps(self.instance.payload, indent=2)

    def clean_payload_text(self):
        raw_payload = self.cleaned_data["payload_text"]
        try:
            payload = json.loads(raw_payload)
        except json.JSONDecodeError as exc:
            raise forms.ValidationError(f"Invalid JSON format: {exc.msg}") from exc

        if not isinstance(payload, dict):
            raise forms.ValidationError("Payload must be a JSON object.")
        return payload

    def save(self, commit=True):
        self.instance.payload = self.cleaned_data["payload_text"]
        return super().save(commit=commit)
