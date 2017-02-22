const conf = require('./conf.js')
const logger = require('./logger.js')
const exec = require('child_process').exec


function login(sessionName) {
  const session = conf.raw[sessionName]
  let cmd = `sshpass -p ${session.password} ssh -t -p ${session.port} \
${session.user}@${session.host}`
  console.log(cmd)
  var child = exec(cmd, (error, stdout, stderr) => {
    logger.error(`exec error: ${error}`)
    console.log("stdout: ", stdout);
    console.log("stderr: ", stderr);
  })
}

module.exports = {
  login,
}
