import matplotlib.pyplot as plt
import numpy as np
import seaborn as sns 
import pandas as pd

sns.set_theme()
data_frame = pd.read_csv('./data.csv')

life = data_frame['lifeExp']
gdp = data_frame['gdpPercap']
correlation = np.corrcoef(data_frame['gdpPercap'], data_frame['lifeExp'])[0][1]

plt.scatter(gdp, life)
plt.xlabel('GDP Per Cap')
plt.ylabel('Life Expectance')
plt.title(f'The relation between GDP and life expectance are: {correlation}')

sns.lmplot(data=data_frame, x='gdpPercap', y='lifeExp').set_axis_labels('GDP Per cap', 'Life Exp')

plt.show()
