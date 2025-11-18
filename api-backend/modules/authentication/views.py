from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.conf import settings

from .serializers import (
    UserSerializer,
    UserRegistrationSerializer,
    UserLoginSerializer,
    PasswordChangeSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer,
    UserUpdateSerializer
)


class RegisterView(APIView):
    """
    API endpoint for user registration
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {
                    "message": "User registered successfully",
                    "user": UserSerializer(user).data
                },
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    """
    API endpoint for user login
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']

            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                return Response(
                    {
                        "message": "Login successful",
                        "user": UserSerializer(user).data
                    },
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    {"error": "Invalid credentials"},
                    status=status.HTTP_401_UNAUTHORIZED
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    """
    API endpoint for user logout
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response(
            {"message": "Logout successful"},
            status=status.HTTP_200_OK
        )


class CurrentUserView(APIView):
    """
    API endpoint to get current authenticated user
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class PasswordChangeView(APIView):
    """
    API endpoint for password change
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = PasswordChangeSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            old_password = serializer.validated_data['old_password']
            new_password = serializer.validated_data['new_password']

            if not user.check_password(old_password):
                return Response(
                    {"error": "Old password is incorrect"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            user.set_password(new_password)
            user.save()

            return Response(
                {"message": "Password changed successfully"},
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetRequestView(APIView):
    """
    API endpoint to request password reset
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            try:
                user = User.objects.get(email=email)

                # Generate password reset token
                token = default_token_generator.make_token(user)
                uid = urlsafe_base64_encode(force_bytes(user.pk))

                # Build reset URL
                reset_url = f"{settings.FRONTEND_URL}/auth/password/reset/confirm?uid={uid}&token={token}"

                # Send email
                send_mail(
                    subject='Password Reset Request',
                    message=f'Click the link to reset your password: {reset_url}',
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[email],
                    fail_silently=False,
                )

                return Response(
                    {"message": "Password reset email sent"},
                    status=status.HTTP_200_OK
                )
            except User.DoesNotExist:
                # Don't reveal if user exists or not
                return Response(
                    {"message": "Password reset email sent"},
                    status=status.HTTP_200_OK
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PasswordResetConfirmView(APIView):
    """
    API endpoint to confirm password reset
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        if serializer.is_valid():
            try:
                uid = serializer.validated_data['uidb64']
                token = serializer.validated_data['token']
                new_password = serializer.validated_data['new_password']

                # Decode user ID
                user_id = force_str(urlsafe_base64_decode(uid))
                user = User.objects.get(pk=user_id)

                # Verify token
                if default_token_generator.check_token(user, token):
                    user.set_password(new_password)
                    user.save()
                    return Response(
                        {"message": "Password reset successful"},
                        status=status.HTTP_200_OK
                    )
                else:
                    return Response(
                        {"error": "Invalid or expired token"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            except (User.DoesNotExist, ValueError, TypeError):
                return Response(
                    {"error": "Invalid reset link"},
                    status=status.HTTP_400_BAD_REQUEST
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    API endpoint to get and update user profile
    """
    permission_classes = [IsAuthenticated]
    serializer_class = UserUpdateSerializer

    def get_object(self):
        return self.request.user

    def get(self, request, *args, **kwargs):
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)
