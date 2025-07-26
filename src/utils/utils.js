const fs = require('fs')
const path = require('path')
const basePath = process.cwd()
const XLSX = require('xlsx')
const xml2js = require('xml2js')
const util = require('util')

const utils = {
  getConfigFile: () => {
    const config = JSON.parse(fs.readFileSync(path.join(basePath, '.thate.json'), 'utf8'))
    if (!config.sourceStf || !config.outputStfRevised) {
      console.error('Configuration file is missing required properties: sourceStf or outputStfRevised')
      process.exit(1)
    }
    return config
  },
  readFolder: (folderPath) => {
    const fullFolderPath = path.join(basePath, folderPath)
    if (!fs.existsSync(fullFolderPath)) {
      console.error(`Folder does not exist: ${fullFolderPath}`)
      return []
    }
    return fs.readdirSync(folderPath)
  },
  readFile: (filePath, fileName) => {
    return fs.readFileSync(path.join(basePath, filePath, fileName), 'utf8')
  },
  writeFile: (folderPath, fileName, data) => {
    const fullFolderPath = path.join(basePath, folderPath)
    if (!fs.existsSync(fullFolderPath)) {
      fs.mkdirSync(fullFolderPath, { recursive: true })
    }
    fs.writeFileSync(path.join(fullFolderPath, fileName), data, 'utf8')
  },
  readExcel: (folderPath, fileName) => {
    return XLSX.read(path.join(basePath, folderPath, fileName), { type: 'file' })
  },
  writeExcel: (workbook, folderPath, fileName) => {
    const fullFolderPath = path.join(basePath, folderPath)
    if (!fs.existsSync(fullFolderPath)) {
      fs.mkdirSync(fullFolderPath, { recursive: true })
    }
    const filePathExcel = path.join(basePath, folderPath, fileName)
    XLSX.writeFile(workbook, filePathExcel, { compression: true })
  },
  parseXml: util.promisify(new xml2js.Parser({ explicitArray: false }).parseString),
  buildItem: (key, value, translatedValue) => {
    const prefixes = key.split('.')
    const itemType = prefixes[0]

    let result = {
      key,
      itemType
    }

    if (itemType === 'CustomField') {
      result = {
        ...result,
        object: prefixes[1],
        field: prefixes[2],
        type: prefixes[3],
        value: value,
        translatedValue: translatedValue
      }
    } else if (itemType === 'LayoutSection') {
      result = {
        ...result,
        object: prefixes[1],
        layout: prefixes[2],
        section: prefixes[3],
        value: value,
        translatedValue: translatedValue
      }
    } else if (itemType === 'PicklistValue') {
      const prefixesSize = prefixes.length
      result = {
        ...result,
        type: prefixesSize === 4 ? prefixes[1] : 'global value set',
        picklist: prefixesSize === 4 ? prefixes[2] : prefixes[1],
        value: value,
        translatedValue: translatedValue
      }
    } else if (itemType === 'StandardFieldHelp') {
      result = {
        ...result,
        object: prefixes[1],
        Field: prefixes[2],
        value: value,
        translatedValue: translatedValue
      }
    } else if (itemType === 'ValidationFormula') {
      result = {
        ...result,
        object: prefixes[1],
        ValidationRule: prefixes[2],
        value: value,
        translatedValue: translatedValue
      }
    } else {
      result = {
        ...result,
        label: key.replace(itemType + '.', ''),
        value: value,
        translatedValue: translatedValue
      }
    }
    return result
  }
}

module.exports = utils