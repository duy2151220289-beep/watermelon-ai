from django.apps import AppConfig


class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'
    verbose_name = 'Watermelon AI API'

    def ready(self):
        import os
        from django.contrib.auth.models import User
        
        # Pull credentials from environment variables or use default
        username = os.environ.get('ADMIN_USERNAME', 'admin')
        password = os.environ.get('ADMIN_PASSWORD', 'adminpassword123')
        email = os.environ.get('ADMIN_EMAIL', 'admin@watermelon.ai')
        
        try:
            if not User.objects.filter(username=username).exists():
                User.objects.create_superuser(username=username, email=email, password=password)
                print(f"AUTOMATED STARTUP: Superuser '{username}' created successfully!")
            else:
                print(f"AUTOMATED STARTUP: Superuser '{username}' already exists.")
        except Exception as e:
            # Prevent crashes during migrations or initial setup
            print(f"AUTOMATED STARTUP: Superuser creation skipped: {e}")
