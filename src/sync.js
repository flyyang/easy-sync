const chokidar = require('chokidar')

function sync(session) {
  const watcher = chokidar.watch(path2, {
    ignored: /(^|[/\\])\..|node_modules\/|vendor\//,
    persistent: true,
    ignorePermissionErrors: true,
    cwd: '.',
  })

  watcher
    .on('change', (path) => {
      const path3 = path2.substring(path2.lastIndexOf('/'))
      const relativePath = path.substring(path3.length + path.lastIndexOf(path3))
      const cmd = `sshpass -p yunshan3302 scp -P 61209 ${path} root@192.168.42.153:/var/www/lcweb_bss${relativePath}`
      exec(cmd, (error) => {
        if (error !== null) {
          console.log(`exec error: ${error}`)
        }
      })
      console.log(colors.rainbow('copy files success'))
    })
    .on('error', error => console.log(`${error}`))
}

module.exports = {
  sync,
}
