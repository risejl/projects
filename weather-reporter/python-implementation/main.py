import requests

cities = []

with open('./cities.txt', 'r') as f:
    for line in f:
        cities.append(line.strip())

request_site = 'https://api.weatherstack.com/current'
access_key = ''

for city in cities:
    params = {
        'access_key': access_key,
        'query': city
    }
    response = requests.get(request_site, params)
    result = response.json()
    date = result['location']['localtime']
    temperature = result['current']['temperature']

    with open(f'{city}.txt', 'a') as f:
        f.write(f'date: {date} ,temperature: {temperature}\n')
