from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Todo


# Register your models here.


class TodoAdmin(admin.ModelAdmin):
    list_display = ('title', 'description', 'complete')


admin.site.register(Todo, TodoAdmin)
