const fs = require('fs')
const path = require('path')
const XLSX = require('xlsx')
const utils = require('./utils/utils.js')
const basePath = utils.getBasePath()
const config = utils.getConfigFile()

fs.readdirSync(path.join(basePath, config.sourceXlsxTranslated)).forEach(fileName => {
  console.log(`Processing file: ${fileName}`)
  const excelFilePath = path.join(basePath, config.sourceXlsxTranslated, fileName)
  const stfFilePath = path.join(basePath, config.outputStf, `${fileName}.stf`)

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