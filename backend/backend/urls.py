from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path, re_path
from django.views.generic import TemplateView
from django.views.static import serve

from django.contrib.staticfiles.urls import staticfiles_urlpatterns

urlpatterns = [
    path('', TemplateView.as_view(template_name='index.html'), name='home'),
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    
    # PWA Root Routes
    path('sw.js', serve, {'document_root': settings.BASE_DIR.parent / 'frontend' / 'dist', 'path': 'sw.js'}),
    path('registerSW.js', serve, {'document_root': settings.BASE_DIR.parent / 'frontend' / 'dist', 'path': 'registerSW.js'}),
    path('manifest.webmanifest', serve, {'document_root': settings.BASE_DIR.parent / 'frontend' / 'dist', 'path': 'manifest.webmanifest'}),
    re_path(r'^(?P<path>workbox-[a-f0-9]+\.js)$', serve, {'document_root': settings.BASE_DIR.parent / 'frontend' / 'dist'}),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += staticfiles_urlpatterns()

