import requests
import matplotlib.pyplot as plt
import random

CITIES_DATA_URL = "https://raw.githubusercontent.com/sixhobbits/ritza/master/data/us-cities.txt"
response = requests.get(CITIES_DATA_URL)

with open('cities.txt', 'wb') as f:
    f.write(response.content)

ALL_COLORS = ['b', 'g', 'r', 'c', 'm', 'y', 'k']

lats = []
lons = []
colors = []
city_colors = {}

with open('cities.txt', 'r') as f:
    for i, line in enumerate(f):
        city, lat, lon = line.split()
        lats.append(float(lat))
        lons.append(float(lon))

        if city not in city_colors:
            city_colors[city] = random.choice(ALL_COLORS)
        colors.append(city_colors[city])
plt.scatter(lons, lats, c=colors)
plt.show()
