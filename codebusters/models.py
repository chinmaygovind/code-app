from django.db import models
from accounts.models import CustomUser
import uuid

# Create your models here.
class Quote(models.Model):
    text = models.CharField(max_length=512, unique=True)
    num_solves = models.BigIntegerField(default=0)
    

class Puzzle(models.Model):
    puzzle_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    puzzle_type = models.CharField(max_length=32)
    quote_id = models.ForeignKey(Quote, on_delete=models.DO_NOTHING)
    encrypted_text = models.CharField(max_length=512)
    solution_text = models.CharField(max_length=512)
    key = models.CharField(max_length=512)
    creation_datetime = models.DateTimeField(auto_now=True)
    alphabet = models.CharField(max_length=64)

class Solve(models.Model):
    puzzle_id = models.ForeignKey(Puzzle, on_delete=models.DO_NOTHING)
    solver_id = models.ForeignKey(CustomUser, on_delete=models.DO_NOTHING)
    time_solved = models.DecimalField(decimal_places=3, max_digits=7)
    solve_datetime = models.DateTimeField(auto_now=True)