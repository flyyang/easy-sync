const chokidar = require('chokidar')
const logger = require('./logger.js')
const exec = require('child_process').exec
const conf = require('./conf.js')

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
  const extraCmd = ` "mkdir -p ${session['remote-path']}/"`
  const relativePath = getRelativePath(session['local-path'], path)
  const cmd = prepareCmd(path, session, 'ssh', extraCmd + relativePath)
  execCmd(cmd, ` [add directory] success ${path}`)
}


function onUnlink(path, session) {
  const extraCmd = ` " yes | rm  ${session['remote-path']}/"`
  const relativePath = getRelativePath(session['local-path'], path)
  const cmd = prepareCmd(path, session, 'ssh', extraCmd + relativePath)
  execCmd(cmd, ` [delete file] success ${path}`)
}

function onUnlinkDir(path, session) {
  const extraCmd = ` " rm -rf ${session['remote-path']}/"`
  const relativePath = getRelativePath(session['local-path'], path)
  const cmd = prepareCmd(path, session, 'ssh', extraCmd + relativePath)
  execCmd(cmd, `[delete directory] success ${path}`)
}

function initRemote(session) {
  const {
    'remote-path': remotePath,
    'local-path': localPath,
    host,
    user,
    port,
    password,
  } = session

  const nomalizedRemotePath = remotePath.replace(/\/$/, '').replace('~', '/root')
  const arr = nomalizedRemotePath.split('/')
  arr.pop()
  const newPath = arr.join('/')

  const cmd = `sshpass -p ${password} scp -P ${port} -r ${localPath}\
    -o StrictHostKeyChecking=no ${user}@${host}:${newPath}`
  // eslint-disable-next-line no-multi-str
  logger.success('[warning]... it may taker a while cause some directory like \
node_moules, vendor etc...')
  logger.success('consider use rysnc in next release')
  execCmd(cmd, '[init] remote server success')
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
