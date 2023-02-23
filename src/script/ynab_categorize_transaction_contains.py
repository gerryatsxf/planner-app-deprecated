

def setCategory(transaction,category):
  transaction['category_name'] = category
  return transaction

def hasNoAntiKeywords(memo,antiKeywords):
  doesntHave = True
  for antiKeyword in antiKeywords:
    if antiKeyword.upper() in memo.upper():
      doesntHave = False
      break
  return doesntHave


def classifyTransaction(transaction,markers):

  for marker in markers:
    keywords = marker['params']['keywords']
    antiKeywords = marker['params']['antiKeywords']
    category = marker['set']
    memo = transaction['memo']
    if memo == None:
      memo = 'NO_MEMO'
    for keyword in keywords:
      if keyword.upper() in memo.upper() and hasNoAntiKeywords(memo,antiKeywords):
        transaction = setCategory(transaction,category)
  return transaction

def main(transactions,markers):
  for idx in range(0,len(transactions)):
    transactions[idx] = classifyTransaction(transactions[idx],markers)
  return transactions


