const { CommandInteraction } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const { Bot } = require('mineflayer')
const ascii = require('ascii-table')
const table = new ascii()

module.exports = {
    data: new SlashCommandBuilder()
        .setName('players')
        .setDescription('Hiện tất cả player trong server'),
    /**
    * 
    * @param {CommandInteraction} interaction 
    * @param {Bot} bot
    */
    run: async (interaction, bot) => {
        const client = interaction.client
        if (bot.login == 0) interaction.editReply('🛑 | Bot đang mất kết nối với server')
        else {
            let players = Object.values(bot.players).map(p => p.username)

            if (players.length < 15)
                for (let i = 0; i < players.length; i += 2)
                    table.addRow(players[i], players[i + 1])
            else for (let i = 0; i < players.length; i += 3)
                table.addRow(players[i], players[i + 1], players[i + 2])
            
            let i = 0
            interaction.editReply('```' +
                table.toString()
                    .split('\n')
                    .slice(1, -1)
                    .join('\n')
                + '```')
        }
    }
}