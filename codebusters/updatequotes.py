#loads quote into database
from models import Quote 

f = open("quotes.txt")

for line in f.readlines():
    q = Quote.objects.create(text=line.strip())
