from django.db import models
from django.contrib.auth.models import User


class Level(models.Model):
    number = models.IntegerField(unique=True)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    def __str__(self):
        return f"Level {self.number}: {self.name}"


class Score(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    level = models.ForeignKey(Level, on_delete=models.CASCADE)
    best_score = models.PositiveIntegerField(default=0)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'level'], name='unique_user_level_score'
            )
        ]

    def __str__(self):
        return f"{self.user.username} - Level {self.level.number}: {self.best_score}"
