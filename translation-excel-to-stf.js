const fs = require('fs')
const path = require('path')
const XLSX = require('xlsx')

const translatedExcelFolder = path.join('utils', 'translations', 'translated-xlsx')

fs.readdirSync(translatedExcelFolder).forEach(fileName => {
  console.log(`Processing file: ${fileName}`)
  const excelFilePath = path.join('utils', 'translations', 'translated-xlsx', fileName)
  const stfFilePath = path.join('utils', 'translations', 'output-stf', `${fileName}.stf`)

  // read the excel
  const workbook = XLSX.read(excelFilePath, { type: 'file' })

  const rawSheetValues = workbook.SheetNames
    .flatMap(v => {
      return XLSX.utils.sheet_to_json(
        workbook.Sheets[v]
      )
    })

  const items = rawSheetValues
    .filter(v => v.key && v.translatedValue)
    .map(v => {
      return [v.key, v.value, v.translatedValue, '-'].join('\t')
    })

  const language = fileName.split('_')[1]

  const dataString = [
    `Language code: ${language}`,
    'Type: Bilingual',
    'Translation type: Metadata',
    null,
    '------------------TRANSLATED-------------------',
    null,
    '# KEY\tLABEL\tTRANSLATION\tOUT OF DATE',
    null
  ]
    .concat(items)
    .join('\n')

  fs.writeFileSync(stfFilePath, dataString, 'utf8')
})