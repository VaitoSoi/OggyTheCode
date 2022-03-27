module.exports = minecraftbot => {
  let rotater
  let rotated = false
  minecraftbot.afk = {}

  minecraftbot.afk.start = () => {
    if (rotater) return
    rotater = setInterval(rotate, 3000)
    minecraftbot.setControlState('jump', true)
  }

  minecraftbot.afk.stop = () => {
    if (!rotater) return
    clearInterval(rotater)
    minecraftbot.setControlState('jump', false)
  }

  function rotate() {
    minecraftbot.look(rotated ? 0 : Math.PI, 0)
    rotated = !rotated
  }
}