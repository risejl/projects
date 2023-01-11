import requests
import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt

DATA_URL = "https://raw.githubusercontent.com/ritza-co/datasets/master/gdp_data.csv"

response = requests.get(DATA_URL)

with open("gdp-life.csv", "w") as f:
    f.write(response.text)

data_frame = pd.read_csv('gdp-life.csv').head()
print(data_frame)

print('___')
print("The correlation is: ", np.corrcoef(data_frame['gdpPercap'], data_frame['lifeExp'])[0,1])
print('___')

sns.lmplot(data=data_frame, x='gdpPercap', y='lifeExp')
plt.title('Countries with higher gdp have higher life expectancy')
plt.show()
