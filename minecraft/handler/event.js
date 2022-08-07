const fs = require('node:fs')
const mineflayer = require('mineflayer')

/**
 * Minecraft event handler
 * @param {mineflayer.Bot} bot Mineflayer Bot
 */
module.exports = (bot) => {
    fs.readdirSync('./minecraft/events/').filter(
        file => file.endsWith('.js')
    ).forEach((file) => {
        const event = require(`../events/${file}`)
        if (!event.discord || event.discord == false) bot.on(event.name, (...args) => { event.run(bot, ...args) })
        else {
            bot.client1.on(event.name, (...args) => event.run(bot, ...args))
            bot.client2.on(event.name, (...args) => event.run(bot, ...args))
        }
    })
}