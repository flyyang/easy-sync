#!/usr/bin/env node

const program = require('commander')
const chokidar = require('chokidar')

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

if (!path2) {
  program.help()
}

if (program.sync) {
  // Initialize watcher.
  const watcher = chokidar.watch(path2, {
    ignored: /(^|[/\\])\..|node_modules\/|vendor\//,
    persistent: true,
    ignorePermissionErrors: true,
  })

  watcher
    .on('change', path => console.log(`File ${path} has been changed`))
    .on('error', error => console.log(`${error}`))
}
