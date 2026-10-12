from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from django.contrib.auth.models import User


class SimpleLoginForm(AuthenticationForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # Custom short error message
        self.error_messages['invalid_login'] = 'Invalid username or password.'


class SimpleRegistrationForm(UserCreationForm):
    class Meta:
        model = User
        fields = ("username",)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # Delete all help messages
        for field in self.fields.values():
            field.help_text = ''
