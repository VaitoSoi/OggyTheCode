const { CommandInteraction } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('chat')
        .setDescription('Gửi chat đến server minecraft anarchyvn.net')
        .addStringOption(option => option
            .setName('chat')
            .setDescription('Chat muốn gửi đi.')
            .setRequired(true)
        ),
    /**
    * 
    * @param {CommandInteraction} interaction 
    */ 
    run: async(interaction) => {
        const client = interaction.client
        return
    }
} 