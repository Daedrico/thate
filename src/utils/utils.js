const fs = require('fs')
const path = require('path')
const basePath = process.cwd()

const utils = {
  getBasePath: () => {
    return basePath
  },
  getConfigFile: () => {
    const config = JSON.parse(fs.readFileSync(path.join(basePath, '.thate.json'), 'utf8'))
    if (!config.sourceStf || !config.outputStfRevised) {
      console.error('Configuration file is missing required properties: sourceStf or outputStfRevised')
      process.exit(1)
    }
    return config
  }
}

module.exports = utils