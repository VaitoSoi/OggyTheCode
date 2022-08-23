const mineflayer = require('mineflayer')
const discord = require('discord.js')
const chat = require('../modules/chat')
const mc = require('../modules/mc')

module.exports = {
    name: 'playerJoined',
    /**
     * 
     * @param {mineflayer.Bot} bot 
     * @param {mineflayer.Player} player 
     */
    async run(bot, player) {
        if (bot.login != 2 || Date.now() - bot.joinAt < 1000) return
        chat.chat(bot.client1, bot.client2, new discord.MessageEmbed()
            .setDescription(`${player.username} vừa vào server`)
            .setColor(chat.colors.green), false, true)
    }
}