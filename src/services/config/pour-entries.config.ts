import path from 'path';
export default {
  pourExcelFilePath: path.join(__dirname, '../../../.sandbox/aux_entry_pour_excel.xlsx'),
  hourOffset: 5,
  includes: [        // a list of the columns to be included in the download
    "modified",
    "idEntry",
    "datePlanned",
    "description",
    "inflow",
    "outflow",
    // "category",
    "linked"
  ]
}
