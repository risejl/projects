import spacy
import requests
from collections import Counter
from bs4 import BeautifulSoup

HEADLINE_URL = "https://lite.cnn.com/en"

nlp = spacy.load('en_core_web_sm')
response = requests.get(HEADLINE_URL)
soup = BeautifulSoup(response.content, 'html.parser')
text = soup.get_text()
doc = nlp(text)

names = []
for word in doc.ents:
    if word.label_ == 'PERSON':
        names.append(word.lemma_)
print("The following is the names in today's headline: ")
print(names)
