


def removeTag(record,tag):
  if tag in record['tags'] and record['tags_modified']:
    record['tags'].remove(tag)
    record['tags_modified'] = False
  return record


def pushTag(record,tag):
  if tag not in record['tags'] and tag != None:
    record['tags'].append(tag)
    record['tags_modified'] = True
  return record

def setCategory(record,category):
  if record['category'] != category:
    record['category'] = category
    record['category_modified'] = True

  return record
def classifyRecord(record,markers):

  record['category_modified'] = False
  record['tags_modified'] = False

  for marker in markers:

    keywords = [marker['params']['values'][0]['keyword']]
    antiKeywords = marker['params']['values'][0]['antiKeywords']
    outflowIndicator = marker['params']['values'][0]['outflow']
    addTag = marker['addTag']
    category = marker['set']

    descriptionKey = marker['params']['inputProperties'][0]
    description = record[descriptionKey]
    tagsKey = marker['params']['inputProperties'][1]
    tags = record[tagsKey]
    outflowKey = marker['params']['inputProperties'][2]
    outflow = record[outflowKey]

    for keyword in keywords:
      if keyword.upper() in description.upper() and float(outflow) == float(outflowIndicator):
        record = pushTag(record,addTag)
        record = setCategory(record,category)



  return record

def main(records,markers):
  for idx in range(0,len(records)):
    records[idx] = classifyRecord(records[idx],markers)
  return records
