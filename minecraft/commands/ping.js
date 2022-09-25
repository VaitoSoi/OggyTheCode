const mineflayer = require('mineflayer')

module.exports = {
    name: 'ping',
    aliases: ['ms'],
    usage: '',
    description: 'Bot ping',
    /**
     * 
     * @param {mineflayer.Bot} bot 
     * @param {String[]} args 
     */
    run: async (bot, args) => {
        bot.chat(`Ping: ${bot.player.ping}ms`)
    }
}