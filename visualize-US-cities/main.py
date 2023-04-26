import matplotlib.pyplot as plt
import random

lats = []
lons = []
all_colors = ['b', 'g', 'r', 'c', 'm', 'y', 'k']
colors = []
state_colors = {}


with open('./cities.csv', 'r') as f:
    for line in f:
        state, latitude, longtitude = line.split()
        lats.append(float(latitude))
        lons.append(float(longtitude))

        if state not in state_colors:
            state_colors[state] = random.choice(all_colors)
        colors.append(state_colors[state])

plt.scatter(lons, lats, c=colors)
plt.title('US-cities')
plt.show()
