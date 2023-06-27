from django.shortcuts import render
from django.http import HttpResponse, HttpResponseBadRequest
from django.views import View
from . import models
from . import puzzle
from django.forms.models import model_to_dict
import urllib
import json
from django.core.serializers.json import DjangoJSONEncoder

# Create your views here.


class FetchPuzzleView(View):
    def get(self, request, *args, **kwargs):
        #get random quote from DB
        cipher = request.GET.get('cipher', 'ARISTOCRAT').upper()
        myPuzzle = puzzle.getPuzzle(cipher)
        userPuzzle = {"id": myPuzzle.puzzle_id, 
                      "type": myPuzzle.puzzle_type,
                      "encrypted_text": myPuzzle.encrypted_text,
                      "alphabet": myPuzzle.alphabet}
        return HttpResponse(json.dumps(userPuzzle, cls= DjangoJSONEncoder))

class CheckPuzzleView(View):
    def get(self, request, *args, **kwargs):
        #get random quote from DB
        puzzle_id = request.GET.get('puzzle_id', None)
        answer = urllib.parse.unquote(request.GET.get('answer', None))
        time_solved = request.GET.get('time_solved', None)
        if not puzzle_id or not answer or not time_solved:
            return HttpResponseBadRequest()
        print(answer)
        myPuzzle = models.Puzzle.objects.get(puzzle_id=puzzle_id)
        #add mistakes catching later
        if myPuzzle and myPuzzle.solution_text == answer:
            solve = models.Solve.objects.create(
                puzzle_id=myPuzzle,
                solver_id=request.user,
                time_solved=time_solved
            )
            completedSolve = {
            "solved": True,
            "time_solved": time_solved
            }
            return HttpResponse(json.dumps(completedSolve, cls = DjangoJSONEncoder))
        failedSolve = {
            "solved": False
        }
        return HttpResponse(json.dumps(failedSolve, cls = DjangoJSONEncoder))
