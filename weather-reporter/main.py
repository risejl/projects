import requests

API_URL = 'http://api.weatherstack.com/current'
ACCESS_KEY = ''

cities = []

with open('cities.txt', 'r') as f:
    for line in f:
        cities.append(line.strip())

for city in cities:
    parameters  = {
        "access_key": ACCESS_KEY,
        "query": city
    }
    response = requests.get(API_URL, parameters)
    js = response.json()
    temperature = js['current']['temperature']
    date = js['location']['localtime']

    with open(f"{city}.txt", 'a') as f:
        f.write(f"{date}, {temperature}\n")
