const mineflayer = require('mineflayer')
const chat = require('../modules/chat').chat
const { MessageEmbed } = require('discord.js')
const color = require('../modules/chat').colors

module.exports = {
    name: 'login',
    /**
     * 
     * @param {mineflayer.Bot} bot 
     */
    async run(bot) {
        clearTimeout(bot.reconnect)
        bot.login++
        bot.joinAt = Date.now()
        bot.anti_bot = false
        let sv = ' '
        switch (bot.login) {
            case 1: sv = 'PIN'; break;
            case 2: sv = 'QUEUE'; break;
            case 3: sv = 'MAIN'; break;
            default: bot.login = 0; break;
        }
        chat(bot.client1, bot.client2, new MessageEmbed()
            .setDescription(`Bot đã vào cụm \`${sv}\``)
            .setColor(color.green), true)
        if (sv.toLowerCase() == 'main') {
            bot.afk.stop()
            setTimeout(() => bot.afk.start(), 5 * 60 * 1000)
        }
    }
}