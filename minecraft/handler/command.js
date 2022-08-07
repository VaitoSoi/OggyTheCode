const fs = require('node:fs')

/**
 * Minecraft command handler 
 * @param {Array} array
 */
module.exports = (array) => {
    fs.readdirSync('./minecraft/commands/').filter(
        file => file.endsWith('.js')
    ).forEach((file) => {
        const cmd = require(`../commands/${file}`)
        if (!cmd || !cmd.name || !cmd.run) return
        const command = array.find(e => e.name == cmd.name)
        if (command) throw new Error('Có 1 file command trùng tên nhau!')
        array.push({
            name: cmd.name,
            usage: cmd.usage,
            aliases: cmd.aliases,
            run: cmd.run,
        })
    })
}