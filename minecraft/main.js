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

/**
 * Create mineflayer bot
 * @param {Client} client1 
 * @param {Client} client2 
 */
async function run(client1, client2) {
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
    })
    /**
     * 
     * Load Plugin
     * 
     */

    bot.loadPlugin(tpsPlugin)
    bot.loadPlugin(require('./handler/afk'))

    /**
     * 
     * Event Handler
     * 
     */

    bot.client1 = client1
    bot.client2 = client2
    bot.login = 0
    bot.cmds = []
    bot.readyAt = Math.floor(Date.now() / 1000)
    require('./handler/event')(bot)
    require('./handler/command')(bot.cmds)

    /**
     * 
     * Set presence
     * 
     */
    let m = '.'
    setInterval(() => {
        if (bot.login != 0) {
            const tps = bot.getTps() ? bot.getTps() : 20
            const player = bot.players ? Object.values(bot.players).map(p => p.username).length : 1
            const ping = bot.player ? bot.player.ping : 0
            const discordStatus = 'online'
            client1.user.setPresence({
                activities: [{ name: `TPS: ${tps} | Players: ${player} | Ping: ${ping}ms`, type: 'PLAYING' }],
                status: discordStatus
            })
            client2.user.setPresence({
                activities: [{ name: `TPS: ${tps} | Players: ${player} | Ping: ${ping}ms`, type: 'PLAYING' }],
                status: discordStatus
            })
        } else if (bot.login == 0) {
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