import sys
import json
import pandas as pd



def findTransferCounter(transfer,remainingCandidates,counterMatch):
  def isCounter(transfer, candidate):
    candidateFlows = abs(candidate['amount'])
    transferFlows = abs(transfer['amount'])
    flowsReciprocate = True if candidate['amount'] == -transfer['amount'] else False
    return counterMatch in candidate['memo'] and transferFlows == candidateFlows and flowsReciprocate
  countersFound =  [candidate for candidate in remainingCandidates if isCounter(transfer, candidate)]
  other = [candidate for candidate in remainingCandidates if not isCounter(transfer, candidate)]
  if len(countersFound) > 1:
    aux = countersFound[0]
    countersFound.pop(0)
    other = other + countersFound
    countersFound = [aux]
  return countersFound, other

def findTransferPairsInDay(dayCandidates, config):
  transferPairs = []

  sourceKey = config['source']['labelKey']
  destinationKey = config['destination']['labelKey']
  transfersFound = True
  candidates = dayCandidates.copy()
  while len(candidates)>0:
    current = candidates[0]
    candidates.pop(0)
    currentIsSource = False
    if sourceKey in current['memo']:
      countersFound, candidates = findTransferCounter(current,candidates,destinationKey)
      currentIsSource = True
    elif destinationKey in current['memo']:
      countersFound, candidates = findTransferCounter(current,candidates,sourceKey)
    if len(countersFound) > 0:
      if currentIsSource:
        transferPair = {'pair': {'source':current,'destination':countersFound[0]}}
      else:
        transferPair = {'pair': {'source':countersFound[0],'destination':current}}
      transferPairs.append(transferPair)
  return transferPairs

def selectTransferPairs(candidates,config):
  dates = candidates['date'].unique().tolist()
  transferPairs = []
  for date in dates:
    dayCandidates = candidates[candidates['date'] == date].to_dict('records')
    transferPairs = transferPairs + findTransferPairsInDay(dayCandidates,config)
  return transferPairs

def getTransferCandidates(transactions, labelKey):
  candidates = []
  for transaction in transactions:
    if labelKey in transaction['memo']:
      candidates.append(transaction)
  return candidates

def main(source,destination,config):

  sourceCandidates = getTransferCandidates(source, config['source']['labelKey'])
  destinationCandidates = getTransferCandidates(destination, config['destination']['labelKey'])
  candidates = sourceCandidates + destinationCandidates

  transferPairs = []
  if len(candidates)>0:
    candidates = pd.DataFrame(candidates)
    transferPairs = selectTransferPairs(candidates,config)
  return transferPairs



params = json.loads(sys.argv[1])
source = params[0]
destination = params[1]
config = params[2]


transferPairs = main(source,destination,config)

print(json.dumps(transferPairs))

sys.stdout.flush()
