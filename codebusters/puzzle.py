from . import models
from enum import Enum
import random
from django.forms.models import model_to_dict


ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
ALPHABET_LOWER = "abcdefghijklmnopqrstuvwxyz"
class Cipher(Enum):
    ARISTOCRAT = 1

def getPuzzle(cipher):
    quote = models.Quote.objects.order_by('?').first()
    #may be expensive and slow, depending on the db backend i'm using    
    puzzle = models.Puzzle.objects.create(quote_id = quote)
    cipher = Cipher[cipher]
    if cipher == Cipher.ARISTOCRAT:
        #aristocrat encode the quote
        solution_text = quote.text.upper()
        encoded, key = encodeAristocrat(solution_text)
        print(solution_text)
        print(encoded, key)
        puzzle.puzzle_type = "ARISTOCRAT"
        puzzle.solution_text = solution_text
        puzzle.encrypted_text = encoded
        puzzle.key = key

    return puzzle

def checkMapping(l):
    for i in range(26):
        if ord(l[i]) - 65 == i:
            return False
    return True

def keyStringRandom(isSpanish):
    spl = lambda word: [char for char in word]
    if isSpanish:
        A = spl("ABCDEFGHIJKLMNÑOPQRSTUVWXYZ")
    else:
        A = spl("ABCDEFGHIJKLMNOPQRSTUVWXYZ")
    while not checkMapping(A):
        random.shuffle(A)
    return "".join(A)


def encodeAristocrat(quote_text):
    key = keyStringRandom(False)
    encoded = quote_text
    for i in range(26):
        encoded = encoded.replace(ALPHABET[i], ALPHABET_LOWER[i])
    for i in range(26):
        encoded = encoded.replace(ALPHABET_LOWER[i], key[i])
    return (encoded, key)