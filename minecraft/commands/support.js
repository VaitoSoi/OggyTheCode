const mineflayer = require('mineflayer')

module.exports = {
    name: 'support',
    aliases: ['sp'],
    usage: '',
    description: 'Thông tin về support server',
    /**
     * 
     * @param {mineflayer.Bot} bot 
     * @param {String[]} args 
     */
    run: async (bot, args) => {
        let str = ''
        if (Object.values(bot.players).map(p => p.username).includes(args[0])) str = `/w ${args[0]} `
        bot.chat(str + 'Support Sever link: https://discord.gg/NBsnNGDeQd')
    }
}