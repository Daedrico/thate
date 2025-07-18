#!/usr/bin/env node

const { program } = require('commander')
const packageInfo = require('../package.json')

program
  .version(packageInfo.version, '-v, --version')
  .description(packageInfo.description)
  .usage('<command> [options]')
  .command('excel', 'Generate Excel files from STF')
  .command('stf', 'Generate STF files from Excel')
  .parse(process.argv)
