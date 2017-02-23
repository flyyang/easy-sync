const conf = require('./conf.js')
const logger = require('./logger.js')
const exec = require('child_process').exec

function login(sessionName) {
  const session = conf.getSession(sessionName)
  const cmd = `sshpass -p ${session.password} ssh -t -p ${session.port} \
${session.user}@${session.host}`

  exec(cmd, (error, stdout, stderr) => {
    if (error === null) {
      logger.error(`exec error: ${error}`)
    }
    logger.error('stdout: ', stdout)
    logger.error('stderr: ', stderr)
  })
}

module.exports = {
  login,
}
