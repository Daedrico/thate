const fs = require('fs')
const path = require('path')
const XLSX = require('xlsx')

const basePath = process.cwd()
const config = JSON.parse(fs.readFileSync(path.join(basePath, '.thate.json'), 'utf8'))
if (!config.sourceStf || !config.outputStfRevised) {
  console.error('Configuration file is missing required properties: sourceStf or outputStfRevised')
  process.exit(1)
}

fs.readdirSync(path.join(basePath, config.sourceStf)).forEach(fileName => {
  console.log(`Processing file: ${fileName}`)
  const filePath = path.join(basePath, config.sourceStf, fileName)
  const revisedFilePath = path.join(basePath, config.outputStfRevised, fileName)

  // create the revised stf
  const revisedText = fs.readFileSync(filePath, 'utf8')
    .split('\n')
    .filter(v => {
      return !config.stuffToRemove.some(s => v.includes(s))
    })

  fs.writeFileSync(revisedFilePath, revisedText.join('\n'), 'utf8')

  // create the excel
  const filePathExcel = path.join('utils', 'translations', 'output-xlsx', `${fileName}.xlsx`)

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

  XLSX.writeFile(workbook, filePathExcel, { compression: true })
})