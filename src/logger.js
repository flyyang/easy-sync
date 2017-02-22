const colors = require('colors')

function error(msg) {
  console.log('')
  console.log(colors.bold.red('x'), colors.red(msg))
  console.log('')
  process.exit(1)
}

function success(msg) {
  console.log(colors.green(msg))
}

module.exports = {
  error,
  success,
}
