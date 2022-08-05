const { CommandInteraction } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('checkonline')
        .setDescription('Kiểm tra xem player có onl tại server anarchyvn.net hay không.')
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
