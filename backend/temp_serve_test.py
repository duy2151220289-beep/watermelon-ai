import os
import sys
from pathlib import Path

sys.path.insert(0, os.getcwd())
os.environ["DJANGO_SETTINGS_MODULE"] = "backend.settings"
import django
django.setup()

from django.test import Client
client = Client()

# Test root index.html
print("Testing GET /")
r1 = client.get('/')
print("Status:", r1.status_code)
if r1.status_code == 200:
    print("Content preview:", r1.content[:200])

from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.conf import settings
import django.urls

# Modify URLs dynamically in the test script to include staticfiles_urlpatterns
django.urls.clear_script_prefix()
from backend.urls import urlpatterns
urlpatterns += staticfiles_urlpatterns()

# Test static JS asset again
print("\nTesting GET /static/assets/index-DV_PsGyx.js with explicit routing")
r2 = client.get('/static/assets/index-DV_PsGyx.js')
print("Status:", r2.status_code)
if r2.status_code == 200:
    print("JS Size:", len(r2.content), "bytes")
