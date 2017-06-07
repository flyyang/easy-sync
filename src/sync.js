const chokidar = require('chokidar')
const logger = require('./logger.js')
const exec = require('child_process').exec
const conf = require('./conf.js')
const glob = require('glob')

const ignorePattern = /(^|[/\\])\..|node_modules\/|vendor\/|.git\//

function execCmd(cmd, successMsg) {
  if (!cmd) return
  exec(cmd, (error) => {
    if (error !== null) {
      logger.error(`exec error: ${error}`, false)
    } else {
      logger.success(successMsg)
    }
  })
}

function getRelativePath(localPath, path) {
  return path.replace(localPath.replace('~', '/root'), '')
}

function prepareCmd(path, session, type, extraCmd = '') {
  // vim create a 4913 temp file
  // see: https://groups.google.com/forum/#!msg/vim_dev/sppdpElxY44/v9fOtS1ji-cJ
  if (/4913$/.test(path)) return
  // vim backup file rejected
  if (/.swp$/.test(path)) return

  const {
    'remote-path': remotePath,
    'local-path': localPath,
    host,
    user,
    port,
    password,
  } = session

  const sshpassCmd = `sshpass -p ${password} `
  let cmd = ''
  const relativePath = getRelativePath(localPath, path)
  if (type === 'ssh') {
    cmd = `ssh -p ${port}  -o StrictHostKeyChecking=no ${user}@${host}`
  } else if (type === 'scp') {
    cmd = `scp -o StrictHostKeyChecking=no -P ${port} ${path} \
    ${user}@${host}:${remotePath}/${relativePath}`
  }
  // eslint-disable-next-line consistent-return
  return (sshpassCmd + cmd + extraCmd).replace('//', '/')
}

function onAdd(path, session) {
  const cmd = prepareCmd(path, session, 'scp')
  execCmd(cmd, `[add file] success ${path}`)
}

function onChange(path, session) {
  const cmd = prepareCmd(path, session, 'scp')
  execCmd(cmd, `[change file] success ${path}`)
}

function onAddDir(path, session) {
  const extraCmd = ` "mkdir -p ${session['remote-path']}/`
  const relativePath = getRelativePath(session['local-path'], `${path} "`)
  const cmd = prepareCmd(path, session, 'ssh', extraCmd + relativePath)
  execCmd(cmd, ` [add directory] success ${path}`)
}


function onUnlink(path, session) {
  const extraCmd = ` " yes | rm  ${session['remote-path']}/`
  const relativePath = getRelativePath(session['local-path'], `${path} "`)
  const cmd = prepareCmd(path, session, 'ssh', extraCmd + relativePath)
  execCmd(cmd, ` [delete file] success ${path}`)
}

function onUnlinkDir(path, session) {
  const extraCmd = ` " rm -rf ${session['remote-path']}/`
  const relativePath = getRelativePath(session['local-path'], `${path} "`)
  const cmd = prepareCmd(path, session, 'ssh', extraCmd + relativePath)
  execCmd(cmd, `[delete directory] success ${path}`)
}

function initRemote(session) {
  glob(`${session['local-path']}/**/**`, { mark: true, dot: true },
    (er, files) => {
      const dir = []
      const ignore = []
      const path = []
      files.forEach((file) => {
        if (ignorePattern.test(file)) {
          ignore.push(file)
          return
        }
        if (/\/$/.test(file)) {
          dir.push(file)
        } else {
          path.push(file)
        }
      })

      logger.success(`${files.length - dir.length} files found`)
      logger.success(`${ignore.length} file ignored `)
      logger.success(`${dir.length} directory found `)
      logger.success(`${path.length} file will be transfered`)
      if (path.length > 0) logger.warn('This may take a while')
      dir.forEach((d) => {
        onAddDir(d, session)
      })
      setTimeout(() => {
        path.forEach((p) => {
          onAdd(p, session)
        })
      }, 5000)
    })
}

function sync(sessionName, init) {
  if (!sessionName) logger.error('session name is required')
  const session = conf.getSession(sessionName)

  if (init) {
    initRemote(session)
    return
  }

  const watcher = chokidar.watch(session['local-path'].replace('~', '/root'), {
    ignored: /(^|[/\\])\..|node_modules\/|vendor\/|.git\//,
    persistent: true,
    ignorePermissionErrors: true,
    ignoreInitial: true,
  })

  logger.success(`Watching path ${session['local-path']}`)
  watcher
    .on('change', (path) => {
      onChange(path, session)
    })
    .on('add', (path) => {
      onAdd(path, session)
    })
    .on('addDir', (path) => {
      onAddDir(path, session)
    })
    .on('unlink', (path) => {
      onUnlink(path, session)
    })
    .on('unlinkDir', (path) => {
      onUnlinkDir(path, session)
    })
    .on('error', error => console.log(`${error}`))
}


module.exports = {
  sync,
}
