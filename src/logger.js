const colors = require('colors')

function error(msg, exit = true) {
  console.log('')
  console.log(colors.bold.red('x'), colors.red(msg))
  console.log('')
  if (exit) {
    process.exit(1)
  }
}

function success(msg) {
  console.log('')
  const rainbowMsg = /(\[.*\])(.+)$/.exec(msg)
  if (rainbowMsg !== null) {
    console.log(
      colors.green('√'),
      colors.rainbow(rainbowMsg[1]),
      // eslint-disable-next-line comma-dangle
      colors.green(rainbowMsg[2])
    )
  } else {
    console.log(colors.green('√', msg))
  }
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
