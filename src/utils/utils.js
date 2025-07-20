const fs = require('fs')
const path = require('path')
const basePath = process.cwd()
const XLSX = require('xlsx')

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
  }
}

module.exports = utils