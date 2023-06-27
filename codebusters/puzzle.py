from . import models
from enum import Enum
import random
from django.forms.models import model_to_dict


ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
ALPHABET_SPANISH = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ"
ALPHABET_LOWER = "abcdefghijklmnopqrstuvwxyz"
class Cipher(Enum):
    ARISTOCRAT = 1
    ARISTOCRAT_K1 = 2
    ARISTOCRAT_K2 = 3
    PATRISTOCRAT = 3

def getPuzzle(cipher):
    quote = models.Quote.objects.order_by('?').first()
    #may be expensive and slow, depending on the db backend i'm using    
    puzzle = None
    cipher = Cipher[cipher]
    if cipher == Cipher.ARISTOCRAT:
        #aristocrat encode the quote
        solution_text = quote.text.upper()
        encoded, key = encodeAristocrat(solution_text)
        print(solution_text)
        print(encoded, key)
        puzzle = models.Puzzle.objects.create(quote_id = quote,
            puzzle_type = "ARISTOCRAT",
            solution_text = solution_text,
            encrypted_text = encoded,
            key = key,
            alphabet=ALPHABET)
    if cipher == Cipher.ARISTOCRAT_K1:
        #aristocrat encode the quote
        print("making a K1 yum yum")
        solution_text = quote.text.upper()
        encoded, key = encodeAristocratK2(solution_text)
        print(solution_text)
        print(encoded, key)
        puzzle = models.Puzzle.objects.create(quote_id = quote,
            puzzle_type = "ARISTOCRAT_K1",
            solution_text = solution_text,
            encrypted_text = encoded,
            key = key,
            alphabet=ALPHABET)
    if cipher == Cipher.ARISTOCRAT_K2:
        #aristocrat encode the quote
        print("making a K2 yum yum")
        solution_text = quote.text.upper()
        encoded, key = encodeAristocratK2(solution_text)
        print(solution_text)
        print(encoded, key)
        puzzle = models.Puzzle.objects.create(quote_id = quote,
            puzzle_type = "ARISTOCRAT_K2",
            solution_text = solution_text,
            encrypted_text = encoded,
            key = key,
            alphabet=ALPHABET)
    return puzzle

def checkMapping(l):
    l = list("".join(l))
    for i in range(26):
        if ord(l[i]) - 65 == i:
            return False
    return True

def keyStringRandom(isSpanish):
    spl = lambda word: [char for char in word]
    if isSpanish:
        A = spl(ALPHABET_SPANISH)
    else:
        A = spl(ALPHABET)
    while not checkMapping(A):
        random.shuffle(A)
    return "".join(A)

def keyStringK1(isSpanish):
    s = keyStringK2(isSpanish)
    A = list(" " * 26)
    for i in range(0, len(s)):
        A[ALPHABET.index(s[i])] = ALPHABET[i]
    return "".join(A)


def keyStringK2(isSpanish):
    spl = lambda word: [char for char in word]
    if isSpanish:
        A = spl(ALPHABET_SPANISH)
    else:
        A = spl(ALPHABET)

    hintLetters = []
    hintWord = random.choice(["thumb", "exotic", "forbid", "report"]).upper()
    for letter in hintWord:
        if letter not in hintLetters:
            hintLetters.append(letter)
            A.remove(letter)
    A = ["".join(A)]
    A.append(hintWord)
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

def encodeAristocratK2(quote_text):
    key = keyStringK2(False)
    encoded = quote_text
    for i in range(26):
        encoded = encoded.replace(ALPHABET[i], ALPHABET_LOWER[i])
    for i in range(26):
        encoded = encoded.replace(ALPHABET_LOWER[i], key[i])
    return (encoded, key)