import requests

request_site = 'https://raw.githubusercontent.com/ritza-co/datasets/master/gdp_data.csv'

response = requests.get(request_site, 'r').text

with open('./data.csv', 'w') as f:
    f.write(response)
