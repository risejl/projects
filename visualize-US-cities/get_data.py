import requests

data = 'https://raw.githubusercontent.com/sixhobbits/ritza/master/data/us-cities.txt'

response = requests.get(data).text

with open('./cities.csv', 'w') as f:
    f.write(response)

