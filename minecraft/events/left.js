const mineflayer = require('mineflayer')
const discord = require('discord.js')
const send = require('../modules/chat').chat
const color = require('../modules/chat').colors

module.exports = {
    name: 'playerLeft',
    /**
     * 
     * @param {mineflayer.Bot} bot 
     * @param {mineflayer.Player} player 
     */
    async run (bot, player) {
        return
        require('../modules/data').seen(player.username, Math.floor(Date.now() / 1000))
        send(bot.client1, bot.client2, new discord.MessageEmbed()
            .setDescription(`${player.username} vừa thoát server`)
            .setColor(color.red), false, true)
    }
}