import sys
import json
from bs4 import BeautifulSoup
import pandas as pd
import numpy as np

def convert(s):
    ls = s.split()
    monthMap = {
        "Ene":"01",
        "Feb":"02",
        "Mar":"03",
        "Abr":"04",
        "May":"05",
        "Jun":"06",
        "Jul":"07",
        "Ago":"08",
        "Sep":"09",
        "Oct":"10",
        "Nov":"11",
        "Dic":"12",
    }
    months = monthMap.keys()
    for month in months:
        if month in s:
            s = s.replace(month,monthMap[month])
            s = s.replace('/','-')
    return s

def parseDates(df):
    df['dateExecuted'] = pd.to_datetime(df["FECHA"].apply(convert), format='%d-%m-%Y', errors='coerce').dt.strftime('%Y-%m-%d')
    df = df.drop(columns='FECHA')
    return df

def parseData(records):
    return pd.DataFrame(data=records,columns=records[0])[1:]

def cleanHeaders(soup):
    data = []
    for table in soup.find_all("table"):
        if table.parent.name == "td":
            myTable =  table
    for row in myTable.find_all('tr'):
        if len(row.find_all('td')) == 4 or len(row.find_all('td')) == 8: # comparing 4 for credit and 8 for debit
            current = []
            for col in row.find_all('td'):
                current.append(col.text)
            data.append(current)
    return data

def cleanDescription(df):
  df['description'] = df['description'].str.strip()
  return df

def renameColumns(df, fileType):
  df = df.rename(columns={ "CONCEPTO":"description" })
  return df

def transformFlows(df, fileType):
  if fileType == 'credit':
    df['IMPORTE'] = df['IMPORTE'].astype(float)
    df['inflow'] = np.where(df['IMPORTE'] < 0, df['IMPORTE']*(-1),0)
    df['outflow'] = np.where(df['IMPORTE'] >= 0, df['IMPORTE'],0)
    df = df.drop(columns='IMPORTE')
  elif fileType == 'debit':
    df['inflow'] = np.where(df['DEPOSITO'] == '', 0,df['DEPOSITO']).astype(float)
    df['outflow'] = np.where(df['RETIRO'] == '', 0,df['RETIRO']).astype(float)
    df = df.drop(columns=["RETIRO","DEPOSITO"])
  return df

def dropColumns(df,fileType):
  if fileType == 'credit':
    df = df.drop(columns=[ "CONSECUTIVO" ])
  elif fileType == 'debit':
    df = df.drop(columns=[
      "HORA",
      "SUCURSAL",
      "SALDO",
      "REFERENCIA"
    ])
  return df

class Serial:
  def __init__(self):
    self.counter = 0
    self.year = "1970"
    self.month = "01"
  def count(self, rowYear, rowMonth, rowTransactionIdx):
    if rowYear == self.year and rowMonth == self.month:
      rowTransactionIdx = self.counter
      self.counter += 1
    return rowTransactionIdx
  def reset(self):
    self.counter = 0

def toStrMonth(month):
  return '0' + str(month) if len(str(month)) == 1 else str(month)

def toStrSerial(rowMonth, rowTransactionIdx):
  return rowMonth + str(rowTransactionIdx).zfill(3)

def assignSerial(df, fileType):
  df['year'] = pd.to_datetime(df["dateExecuted"], format='%Y-%m-%d', errors='coerce').dt.year.astype(str)
  df['month'] = pd.to_datetime(df["dateExecuted"], format='%Y-%m-%d', errors='coerce').dt.month.apply(toStrMonth)
  df['serial'] = '00000'
  df['transactionIdx'] = 0
  serial = Serial()
  df = df.reindex(index=df.index[::-1]) if fileType == 'credit' else df # flip since original order for credit given is descending
  for year in df['year'].unique().tolist():
    serial.year = year
    for month in df['month'].unique().tolist():
      serial.month = month
      serial.reset()
      df['transactionIdx'] = df.apply(lambda row : serial.count(row['year'],row['month'],row['transactionIdx']),axis=1)
  df['serial'] = df.apply(lambda row: toStrSerial(row['month'],row['transactionIdx']),axis=1)
  return df

def filterByTimeInterval(df,sinceDate,untilDate):
  return df.loc[(df.dateExecuted >= sinceDate) & (df.dateExecuted <= untilDate)]

def main(fileContent, config):
  soup = BeautifulSoup(fileContent, 'lxml')
  clean = cleanHeaders(soup)
  df = parseData(clean)
  df = parseDates(df)
  df = transformFlows(df, config["fileAccountType"])
  df = assignSerial(df, config["fileAccountType"])
  df = renameColumns(df, config["fileAccountType"])
  df = cleanDescription(df)
  df = dropColumns(df,config["fileAccountType"])
  df = filterByTimeInterval(df,config["sinceDate"],config["untilDate"])
  return df.to_dict('records')

params = json.loads(sys.argv[1])
fileContent = params[0]
config = params[1]

result = main(fileContent,config)
print(json.dumps(result))
sys.stdout.flush()
