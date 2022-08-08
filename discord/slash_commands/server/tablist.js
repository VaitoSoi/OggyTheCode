const { CommandInteraction, MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const { Bot } = require('mineflayer')
module.exports = {
    data: new SlashCommandBuilder()
        .setName('tablist')
        .setDescription('Hiện tablist trong server'),
    server: true,
    /**
    * 
    * @param {CommandInteraction} interaction 
    * @param {Bot} bot
    */
    run: async (interaction, bot) => {
        const client = interaction.client
        const ascii = require('ascii-table')
        const table = new ascii()

        if (bot.login == 0) interaction.editReply('🛑 | Bot đang mất kết nối với server')
        else {
            let players = Object.values(bot.players).map(p => p.username)

            if (players.length < 15)
                for (let i = 0; i < players.length; i += 2)
                    table.addRow(players[i], players[i + 1])
            else for (let i = 0; i < players.length; i += 3)
                table.addRow(players[i], players[i + 1], players[i + 2])

            interaction.editReply({
                embeds: [
                    new MessageEmbed()
                        .setDescription(
                            '```' + bot.tablist.header.getText().replace('§', '') + '```' + '\n'
                            + '```' + table.toString().split('\n').slice(1, -1).join('\n') + '```' + '\n'
                            + '```' + bot.tablist.footer.getText().replace('§', '') + '```'
                        )
                ]
            })
        }
    }
}