import sys
import json
import pandas as pd
import datetime
import ynab_categorize_transaction_contains as pr_contains
import ynab_categorize_transaction_subscription as pr_subscription

def main(transactions,categories,config):
  idxCategory = {}
  for category in categories:
    idxCategory[category['name']] = category['id']
  categorized = pr_contains.main(transactions,config["markers"])
  for transaction in categorized:
    transaction['category_modified'] = False
    if transaction['category_name'] in idxCategory.keys():
      if (not transaction['category_id'] == idxCategory[transaction['category_name']]) and (not transaction['category_name'] == 'Uncategorized'):
        transaction['category_modified'] = True
      transaction['category_id'] = idxCategory[transaction['category_name']]
  return categorized

params = json.loads(sys.argv[1])
transactions = params[0]
categories = params[1]
config = params[2]

categorized = main(transactions,categories,config)
print(json.dumps(categorized))
sys.stdout.flush()


