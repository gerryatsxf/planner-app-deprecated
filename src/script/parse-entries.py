import sys
import json
import pandas as pd
import bs4 as bs

def main(filePath):
  entries = pd.read_excel(filePath).fillna(0)
  #categoryIds = set(entries['idCategory'])
  categories = set(entries['category'])
  entries = entries.to_dict('records')
  categories = list(categories)
  return{"entries":entries,"categories":categories}

params = json.loads(sys.argv[1])
filePath = params[0]
result = main(filePath)
print(json.dumps(result))
sys.stdout.flush()

