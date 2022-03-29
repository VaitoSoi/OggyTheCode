const { CommandInteraction } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('checkonline')
        .setDescription('Kiểm tra xem player có onl tại server 2y2c.org hay không.')
        .addStringOption(option => option
            .setName('player')
            .setDescription('Player bạn muốn kiểm tra')
            .setRequired(true)
        ),
    /**
    * 
    * @param {CommandInteraction} interaction 
    */
    run: async (interaction) => {
        const client = interaction.client
        return
    }
}
