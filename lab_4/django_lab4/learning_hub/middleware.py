import logging
import time

from django.shortcuts import render
from django.utils.deprecation import MiddlewareMixin

logger = logging.getLogger("learning_hub.requests")


class RequestLoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        start = time.perf_counter()
        response = self.get_response(request)
        elapsed_ms = (time.perf_counter() - start) * 1000
        username = request.user.username if request.user.is_authenticated else "anonymous"
        logger.info(
            "%s %s -> %s | user=%s | %.2fms",
            request.method,
            request.get_full_path(),
            response.status_code,
            username,
            elapsed_ms,
        )
        return response


class SecurityHeadersMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        response["X-Content-Type-Options"] = "nosniff"
        response["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
        response["Content-Security-Policy"] = (
            "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; "
            "script-src 'self';"
        )
        return response


class GlobalExceptionMiddleware(MiddlewareMixin):
    def process_exception(self, request, exception):
        logger.exception("Unhandled server exception on path %s", request.path, exc_info=exception)
        return render(
            request,
            "errors/500.html",
            {"error_message": "An unexpected error occurred while processing your request."},
            status=500,
        )
