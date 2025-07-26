const { program } = require('commander')
const XLSX = require('xlsx')
const utils = require('./utils/utils.js')
const config = utils.getConfigFile()

program
  .option('-o, --omit', 'Omit translated values from the Excel file output')
  .parse(process.argv)

const options = program.opts()

utils.readFolder(config.sourceStf).forEach(fileName => {
  console.log(`Processing file: ${fileName}`)

  // create the revised stf
  const revisedText = utils.readFile(config.sourceStf, fileName, 'utf8')
    .split('\n')
    .filter(v => {
      return !config.stuffToRemove.some(s => v.includes(s))
    })

  utils.writeFile(config.outputStfRevised, fileName, revisedText.join('\n'))

  // create the excel
  const revisedExcelData = revisedText
    .filter(v => v && !v.startsWith('#') && !v.startsWith('-') && v.trim() !== '')
    .map(v => {
      const values = v.split('\t')
      if (values.length < 2) {
        console.log(`Skipping line: ${v}`)
        return null
      }
      return values
    })
    .filter(v => v)

  const revisedExcelDataReduced = revisedExcelData.reduce((acc, v) => {
    const key = v[0]
    const item = utils.buildItem(key, v[1], v[2])
    if (!(item.itemType in acc)) acc[item.itemType] = []
    if (!(options.omit && item.translatedValue)) acc[item.itemType].push(item)
    return acc
  }, {})

  const workbook = XLSX.utils.book_new()
  Object.entries(revisedExcelDataReduced)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([itemType, v]) => {
      const worksheet = XLSX.utils.json_to_sheet(v)
      XLSX.utils.book_append_sheet(workbook, worksheet, itemType)
    })

  utils.writeExcel(workbook, config.outputXlsx, `${fileName}.xlsx`)
})

utils.readFolder(config.sourceXml).forEach(async fileName => {
  console.log(`Processing file: ${fileName}`)

  // read xml file
  const revisedText = utils.readFile(config.sourceXml, fileName, 'utf8')
  const xmlData = await utils.parseXml(revisedText)

  const revisedXmlData = xmlData.xliff.file.body['trans-unit']
    .filter(v => {
      return !config.stuffToRemove.some(s => v['$'].id.includes(s))
    })

  console.log(revisedXmlData)

  // create the revised xml
  // utils.writeFile(config.outputXmlRevised, fileName, JSON.stringify(revisedXmlData))

  const revisedExcelDataReduced = revisedXmlData.reduce((acc, v) => {
    const key = v['$'].id
    const item = utils.buildItem(key, v.source, v.target)
    if (!(item.itemType in acc)) acc[item.itemType] = []
    if (!(options.omit && item.translatedValue)) acc[item.itemType].push(item)
    return acc
  }, {})

  const workbook = XLSX.utils.book_new()
  Object.entries(revisedExcelDataReduced)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([itemType, v]) => {
      const worksheet = XLSX.utils.json_to_sheet(v)
      XLSX.utils.book_append_sheet(workbook, worksheet, itemType)
    })

  utils.writeExcel(workbook, config.outputXlsx, `${fileName}.xlsx`)
})