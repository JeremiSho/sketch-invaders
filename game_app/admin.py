from django.contrib import admin
from .models import Score, Level


@admin.register(Score)
class ScoreAdmin(admin.ModelAdmin):
    list_display = ('user', 'level', 'best_score')
    list_filter = ('level',)
    search_fields = ('user__username',)
    list_editable = ('best_score',)
    ordering = ('-best_score',)


@admin.register(Level)
class LevelAdmin(admin.ModelAdmin):
    list_display = ('number', 'name', 'description')
    list_filter = ('number',)
    search_fields = ('name',)
    ordering = ('-number',)
