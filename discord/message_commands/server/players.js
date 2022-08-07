const { Bot } = require('mineflayer')
const ascii = require('ascii-table')
const table = new ascii()
const { Client, Message } = require('discord.js')

module.exports = {
    name: 'tablist',
    description: 'Hiện tablist trong server',
    usage: '',
    /**
    * 
    * @param {Bot} bot
    * @param {Client} client 
    * @param {Message} message 
    * @param {String[]} args 
    */
    run: async (bot, client, message, args) => {
        if (bot.login == 0) message.reply('🛑 | Bot đang mất kết nối với server')
        else {
            let players = Object.values(bot.players).map(p => p.username)

            if (players.length < 15)
                for (let i = 0; i < players.length; i += 2)
                    table.addRow(players[i], players[i + 1])
            else for (let i = 0; i < players.length; i += 3)
                table.addRow(players[i], players[i + 1], players[i + 2])
            message.reply('```' +
                table.toString()
                    .split('\n')
                    .slice(1, -1)
                    .join('\n')
                + '```')
        }
    }
}