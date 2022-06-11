#%%
import json

with open('../stocks.json', 'r') as f:
    stocks = json.load(f)

from matplotlib import pyplot as plt
for i in range(10):
    y = [stock[0][i][4] * stock[0][i][5] for stock in stocks]
    #print(y)
    plt.plot(range(0, len(stocks)), y)
plt.show()
# %%
