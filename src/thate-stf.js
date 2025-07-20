const XLSX = require('xlsx')
const utils = require('./utils/utils.js')
const config = utils.getConfigFile()

utils.readFolder(config.sourceXlsxTranslated).forEach(fileName => {
  console.log(`Processing file: ${fileName}`)

  // read the excel
  const workbook = utils.readExcel(config.sourceXlsxTranslated, fileName)

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

  utils.writeFile(config.outputStf, `${fileName}.stf`, dataString)
})