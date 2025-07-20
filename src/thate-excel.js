const XLSX = require('xlsx')
const utils = require('./utils/utils.js')
const config = utils.getConfigFile()

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
    // const
    const key = v[0]
    const prefixes = key.split('.')
    const itemType = prefixes[0]
    if (!(itemType in acc)) acc[itemType] = []

    let item = {
      key
    }

    if (itemType === 'CustomField') {
      item = {
        ...item,
        object: prefixes[1],
        field: prefixes[2],
        type: prefixes[3],
        value: v[1],
        translatedValue: v[2]
      }
    } else if (itemType === 'LayoutSection') {
      item = {
        ...item,
        object: prefixes[1],
        layout: prefixes[2],
        section: prefixes[3],
        value: v[1],
        translatedValue: v[2]
      }
    } else if (itemType === 'PicklistValue') {
      const prefixesSize = prefixes.length
      item = {
        ...item,
        type: prefixesSize === 4 ? prefixes[1] : 'global value set',
        picklist: prefixesSize === 4 ? prefixes[2] : prefixes[1],
        value: v[1],
        translatedValue: v[2]
      }
    } else if (itemType === 'StandardFieldHelp') {
      item = {
        ...item,
        object: prefixes[1],
        Field: prefixes[2],
        value: v[1],
        translatedValue: v[2]
      }
    } else if (itemType === 'ValidationFormula') {
      item = {
        ...item,
        object: prefixes[1],
        ValidationRule: prefixes[2],
        value: v[1],
        translatedValue: v[2]
      }
    } else {
      item = {
        ...item,
        label: key.replace(itemType + '.', ''),
        value: v[1],
        translatedValue: v[2]
      }
    }

    acc[itemType].push(item)

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