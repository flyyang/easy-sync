const parser = require('js-yaml')
const fs = require('fs')
const os = require('os')

const confDefaultPath = `${os.homedir()}/.easy-sync.rc`

function confExists() {
  return fs.existsSync(confDefaultPath)
}

function parseConf() {
  console.log(confDefaultPath)
  if (!confExists()) {
    console.log('')
    console.log('x'.bold.red, '.easy-syn.rc not found in user home path'.red)
    console.log('')
    process.exit(1)
  }
  try {
    const doc = parser.safeLoad(fs.readFileSync(confDefaultPath, 'utf8'))
    console.log(doc)
  } catch (e) {
    console.log(e)
  }
}
module.exports = {
  confExists,
  parseConf,
}
