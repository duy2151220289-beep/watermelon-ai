import os
import uuid
from django.db import models
from django.contrib.auth.models import User


def upload_path(instance, filename):
    ext = filename.split('.')[-1]
    name = f"{uuid.uuid4().hex}.{ext}"
    return os.path.join('uploads', name)


def result_path(instance, filename):
    ext = filename.split('.')[-1]
    name = f"detected_{uuid.uuid4().hex}.{ext}"
    return os.path.join('results', name)


class DetectionRecord(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True, related_name='scans')
    source = models.CharField(max_length=20, default='upload')
    original_image = models.ImageField(upload_to=upload_path)
    detected_image = models.ImageField(upload_to=result_path, blank=True, null=True)
    label = models.CharField(max_length=100, default='watermelon')
    confidence = models.FloatField(default=0.0)
    predicted_weight = models.FloatField(default=0.0)
    ripeness = models.CharField(max_length=50, default='Unknown')
    sweetness = models.FloatField(default=0.0)
    bbox = models.JSONField(default=dict)
    duration_ms = models.FloatField(default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.label} @ {self.confidence:.2f}%"


class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True, related_name='reviews')
    name = models.CharField(max_length=100)
    rating = models.IntegerField(default=5)  # 1 to 5 stars
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.rating} stars"


class Post(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    likes = models.IntegerField(default=0)
    dislikes = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, default='consumer', choices=[('consumer', 'Consumer'), ('merchant', 'Merchant')])

    def __str__(self):
        return f"{self.user.username} - {self.role}"


# Django signals to automatically create and save UserProfile when User is created
from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.get_or_create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    profile, _ = UserProfile.objects.get_or_create(user=instance)
    profile.save()


