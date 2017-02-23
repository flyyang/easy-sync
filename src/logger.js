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

function rainbow(msg) {
  console.log('')
  console.log(colors.rainbow(msg))
  console.log('')
}

module.exports = {
  error,
  success,
  rainbow,
}
