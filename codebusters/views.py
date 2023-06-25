from django.shortcuts import render
from django.http import HttpResponse
from django.views import View
from . import models
from . import puzzle
from django.forms.models import model_to_dict
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
                      "encrypted_text": myPuzzle.encrypted_text}
        return HttpResponse(json.dumps(userPuzzle, cls= DjangoJSONEncoder))

class FetchPuzzleView(View):
    def get(self, request, *args, **kwargs):
        #get random quote from DB
        cipher = request.GET.get('cipher', 'ARISTOCRAT').upper()
        myPuzzle = puzzle.getPuzzle(cipher)
        userPuzzle = {"id": myPuzzle.puzzle_id, 
                      "type": myPuzzle.puzzle_type,
                      "encrypted_text": myPuzzle.encrypted_text}
        return HttpResponse(json.dumps(userPuzzle, cls= DjangoJSONEncoder))