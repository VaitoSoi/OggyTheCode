const { Client, Message, MessageEmbed } = require('discord.js')
const { Bot } = require('mineflayer')

module.exports = {
    name: 'tablist',
    description: 'Hiện tất cả player trong server',
    usage: '',
    server: true,
    /**
    * 
    * @param {Bot} bot
    * @param {Client} client 
    * @param {Message} message 
    * @param {String[]} args 
    */
    run: async (bot, client, message, args) => {
        const ascii = require('ascii-table')
        const table = new ascii()
        let players = Object.values(bot.players).map(p => p.username)

        if (players.length < 15)
            for (let i = 0; i < players.length; i += 2)
                table.addRow(players[i], players[i + 1])
        else for (let i = 0; i < players.length; i += 3)
            table.addRow(players[i], players[i + 1], players[i + 2])
        message.reply({
            embeds: [
                new MessageEmbed()
                    .setDescription(
                        '```' + bot.tablist.header.getText().replace('§', '') + '```' + '\n' +
                        '```' + table.toString().split('\n').slice(1, -1).join('\n') + '```' + '\n' +
                        '```' + bot.tablist.footer.getText().replace('§', '') + '```'
                    )
            ]
        })
    }
}