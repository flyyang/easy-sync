const chokidar = require('chokidar')
const logger = require('./logger.js')
const exec = require('child_process').exec
const conf = require('./conf.js')

function sync(sessionName) {
  const session = conf.getSession(sessionName)

  const {
    'local-path': localPath,
    'remote-path': remotePath,
    host,
    user,
    port,
    password,
  } = session

  const watcher = chokidar.watch('~/lcweb', {
    ignored: /(^|[/\\])\..|node_modules\/|vendor\//,
    persistent: true,
    ignorePermissionErrors: true,
    cwd: '.',
  })
	console.log(localPath)
/*
  watcher
    .on('change', (path) => {
      const lastDirName = localPath.substring(
        localPath.trim('/').lastIndexOf('/'))
      const relativePath = path.substring(lastDirName.length
        + path.lastIndexOf(lastDirName))
      const cmd = `sshpass -p ${password} scp -P ${port} ${localPath} \
${user}@${host}:${remotePath}${relativePath}`

      exec(cmd, (error) => {
        if (error !== null) {
          console.log(`exec error: ${error}`)
        }
      })

      logger.rainbow('copy files success')
    })
    .on('error', error => console.log(`${error}`))
*/
	watcher
  .on('add', path => consle.log(`File ${path} has been added`))
  .on('change', path => console.log(`File ${path} has been changed`))
  .on('unlink', path => console.log(`File ${path} has been removed`));
}


module.exports = {
  sync,
}
