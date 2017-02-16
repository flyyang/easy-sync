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
    console.log('x'.bold.red, ' .easy-syn.rc not found in user home path'.red)
    console.log('')
    process.exit(1)
  }
  let conf = {}
  try {
    conf = parser.safeLoad(fs.readFileSync(confDefaultPath, 'utf8'))
  } catch (e) {
    console.log('x'.bold.red, ' seems .easy-sync.rc have syntax error'.red)
    console.log(e)
    process.exit(1);
  }
  return conf
}

const raw = parseConf()
const sessions = Object.keys(raw)

module.exports = {
  parseConf,
  raw,
  sessions,
}
