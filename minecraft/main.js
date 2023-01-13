const mineflayer = require('mineflayer')
const env = process.env
const config = {
    username: env.MC_NAME,
    version: env.MC_VERSION,
    host: env.MC_HOST,
    port: env.MC_PORT,
    pass: env.MC_PASS,
}
const { Client } = require('discord.js')
const tpsPlugin = require('mineflayer-tps')(mineflayer)
const path_finder = require('mineflayer-pathfinder').pathfinder

/**
 * Create mineflayer bot
 * @param {Client} client1 
 * @param {Client} client2 
 * @param {Boolean} handler
 */
async function run(client1, client2, handler) {
    /**
     * 
     * Create Bot
     * 
     */
    let bot = mineflayer.createBot({
        username: config.username,
        port: config.port,
        host: config.host,
        version: config.version,
        checkTimeoutInterval: 10 * 60 * 1000
    })
    /**
     * 
     * Load Plugin
     * 
     */

    bot.loadPlugin(tpsPlugin)
    bot.loadPlugin(path_finder)
    bot.loadPlugin(require('./modules/afk'))
    //bot.loadPlugin(death_event)

    /**
     * 
     * Event Handler
     * 
     */
    bot.lastChat = Date.now()
    bot.readyAt = Math.floor(Date.now() / 1000)
    bot.client1 = client1
    bot.client2 = client2
    bot.login = 0
    bot.cmds = []
    bot.reconnect = 0
    bot.joinAt = 0
    bot.view = false
    require('./handler/event')(bot, handler)
    require('./handler/command')(bot.cmds)

    /**
     * 
     * Set presence
     * 
     */
    let m = '.'
    setInterval(() => {
        if (bot.players) {
            if (!bot.getTps() || !bot.players || !bot.player) return
            const tps = bot.getTps()
            const player = Object.keys(bot.players).length
            const ping = bot.player.ping
            const discordStatus = 'online'
            client1.user.setPresence({
                activities: [{ name: `TPS: ${tps} | Players: ${player} | Ping: ${ping}ms`, type: 'PLAYING' }],
                status: discordStatus
            })
            client2.user.setPresence({
                activities: [{ name: `TPS: ${tps} | Players: ${player} | Ping: ${ping}ms`, type: 'PLAYING' }],
                status: discordStatus
            })
        } else {
            if (m.length < 5) m += '.'
            else m = '.'
            client1.user.setPresence({
                activities: [{ name: `Reconnecting${m}`, type: 'LISTENING' }],
                status: 'idle'
            })
            client2.user.setPresence({
                activities: [{ name: `Reconnecting${m}`, type: 'LISTENING' }],
                status: 'idle'
            })
        }
    }, 5 * 1000);
}

module.exports = run