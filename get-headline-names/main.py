import requests
from bs4 import BeautifulSoup
import spacy

nlp = spacy.load('en_core_web_sm')

HEADLINE = 'https://lite.cnn.com/'

response = requests.get(HEADLINE).text
soup = BeautifulSoup(response, 'html.parser')

result_set = soup.find_all('li')
result_string = ''
for result in result_set:
    result_string += result.get_text()

doc = nlp(result_string)

for ent in doc.ents:
    if ent.label_ == 'PERSON':
        with open('./names.txt', 'a') as f:
            f.write(ent.text + '\n')


            
