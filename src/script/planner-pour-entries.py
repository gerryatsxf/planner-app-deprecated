import pandas as pd
import json
import sys
def main(entries, pourConfig):

  writer = pd.ExcelWriter(pourConfig["pourExcelFilePath"])
  df = pd.DataFrame(entries)
  # df['idEntry'] = df['id']
  # df['modified'] = 0
  # df['datePlanned'] = pd.to_datetime(df['datePlanned'], format="%Y-%m-%dT%H:%M:%S")
  # df['datePlanned'] = df['datePlanned'].dt.strftime('%Y-%m-%d')
  # df = df[pourConfig["includes"]]

  df.to_excel(writer,sheet_name='Month entries',index=False)
  #   # Auto-adjust columns' width
  # for column in df:
  #     column_width = max(df[column].astype(str).map(len).max(), len(column))
  #     col_idx = df.columns.get_loc(column)
  #     writer.sheets['Month entries'].set_column(col_idx, col_idx, column_width)

  writer.save()
  return df.to_dict('records')


params = json.loads(sys.argv[1])
entries = pd.DataFrame(params[0])
pourConfig = params[1]
dataTable = main(entries, pourConfig)
print(json.dumps(dataTable))
sys.stdout.flush()
