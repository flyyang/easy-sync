#!/usr/bin/env node

const program = require('commander')
const chokidar = require('chokidar')
const exec = require('child_process').exec
const colors = require('colors')
const conf = require('./src/check-conf.js')

program
  .version('0.0.1')
  .option('-l, --lint', 'linting src')
  .option('-s, --sync', 'sync with dst server')
  .option('-p, --path [path]', 'watched path')
  .on('--help', () => {
    console.log('   Examples')
    console.log('')
    console.log('     $ easy-sync -s -p /var/www/app')
  })
  .parse(process.argv)

const path2 = program.path

conf.parseConf()
process.exit()
if (!path2) {
  program.help()
}

if (program.sync) {
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
      const cmd = `sshpass -p yunshan3302 scp -P 61209 ${path} root@192.168.42.153:/var/www/lcweb${relativePath}`

      console.log(colors.green(cmd))
      exec(cmd, (error) => {
        if (error !== null) {
          console.log(`exec error: ${error}`)
        }
      })
      console.log(colors.rainbow('copy files success'))
    })
    .on('error', error => console.log(`${error}`))
}
