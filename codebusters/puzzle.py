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
    ARISTOCRAT_SPANISH = 4
    ARISTOCRAT_ERRORS = 5
    PATRISTOCRAT = 6,
    HILL_2X2 = 7,
    HILL_3x3 = 8

def getPuzzle(cipher):
    quote = models.Quote.objects.order_by('?').first()
    #may be expensive and slow, depending on the db backend i'm using    
    puzzle = None
    userPuzzle = None
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
        userPuzzle = {"id": puzzle.puzzle_id, 
                    "type": puzzle.puzzle_type,
                    "encrypted_text": puzzle.encrypted_text,
                    "alphabet": puzzle.alphabet}
    elif cipher == Cipher.ARISTOCRAT_K1:
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
        userPuzzle = {"id": myPuzzle.puzzle_id, 
                    "type": myPuzzle.puzzle_type,
                    "encrypted_text": myPuzzle.encrypted_text,
                    "alphabet": myPuzzle.alphabet}
    elif cipher == Cipher.ARISTOCRAT_K2:
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
        
        userPuzzle = {"id": myPuzzle.puzzle_id, 
                    "type": myPuzzle.puzzle_type,
                    "encrypted_text": myPuzzle.encrypted_text,
                    "alphabet": myPuzzle.alphabet}
    elif cipher == Cipher.HILL_2X2:
        solution_text = ''.join(filter(str.isalnum, quote.text)).upper()
        encrypted, matrix = createHill2x2(solution_text)
        puzzle = models.Puzzle.objects.create(quote_id = quote,
            puzzle_type = "HILL",
            solution_text = solution_text,
            encrypted_text = encrypted,
            key = str(matrix),
            alphabet=ALPHABET)
        userPuzzle = {"id": puzzle.puzzle_id, 
                    "type": puzzle.puzzle_type,
                    "encrypted_text": puzzle.encrypted_text,
                    "matrix": matrix,
                    "alphabet": puzzle.alphabet}
    return puzzle, userPuzzle

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

def createHill2x2(quote_text):
    #create matrix
    matrix = [[0, 0], [0, 0]]
    while matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0] == 0:
        for i in range(4):
            matrix[i//2][i%2] = int(random.random() * 26)
    
    padded_quote = list((quote_text + ("Z" if len(quote_text) % 2 == 1 else "")).upper())
    print(padded_quote)
    for i in range(len(padded_quote) -1, -1, -1):
        if padded_quote[i] not in ALPHABET:
            padded_quote.pop(i)
        else:
            padded_quote[i] = int(ord(padded_quote[i]) - 65)
    encrypted_text = ""
    for i in range(0, len(padded_quote), 2):
        encrypted_text += ALPHABET[(matrix[0][0] * padded_quote[i] + matrix[0][1] * padded_quote[i + 1])%26]
        encrypted_text += ALPHABET[(matrix[1][0] * padded_quote[i] + matrix[1][1] * padded_quote[i + 1])%26]
    return  encrypted_text,  matrix


#print(createHill2x2("this is my test hill"))