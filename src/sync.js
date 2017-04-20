const chokidar = require('chokidar')
const logger = require('./logger.js')
const exec = require('child_process').exec
const conf = require('./conf.js')

function sync(sessionName) {
  if (!sessionName) logger.error('session name is required')
  const session = conf.getSession(sessionName)

  const {
    'local-path': localPath,
    'remote-path': remotePath,
    host,
    user,
    port,
    password,
  } = session

  const watcher = chokidar.watch(localPath.replace('~', '/root'), {
    ignored: /(^|[/\\])\..|node_modules\/|vendor\/|.git\//,
    persistent: true,
    ignorePermissionErrors: true,
    cwd: '.',
  })
  logger.success(`Watching path ${localPath}`)
  watcher
    .on('change', (path) => {
      syncFile(path)
    })
    .on('add', (path) => {
      syncFile(path)
    })
    .on('error', error => console.log(`${error}`))

  function syncFile(path){
      const lastDirName = localPath.substring(
        localPath.trim('/').lastIndexOf('/'))
      const relativePath = path.substring(lastDirName.length
        + path.lastIndexOf(lastDirName))
      const cmd = `sshpass -p ${password} scp -P ${port} ${path} \
  ${user}@${host}:${remotePath}${relativePath}`

      logger.success(`copy from ${path} to ${remotePath}${relativePath}`)

      exec(cmd, (error) => {
        if (error !== null) {
          logger.error(`exec error: ${error}`, false)
        }
        logger.rainbow('copy files success')
      })
  }
}


module.exports = {
  sync,
}
