const mineflayer = require('mineflayer')

module.exports = {
    name: 'server',
    aliases: ['sv'],
    usage: '',
    description: 'Thông tin về server',
    /**
     * Server command
     * @param {mineflayer.Bot} bot 
     * @param {String[]} args 
     */
    run: async (bot, args) => {
        bot.chat(`TPS: ${bot.getTps()} | Players: ${Object.values(bot.players).map(player => player.username).length}`)
    }
}