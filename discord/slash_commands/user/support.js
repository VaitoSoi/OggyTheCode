const { CommandInteraction } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('support')
        .setDescription('Link dẫn vào Support Server của Oggy'),
    /**
    * 
    * @param {CommandInteraction} interaction 
    */ 
    run: async(interaction) => {
        const client = interaction.client
        interaction.editReply('👇 | Support Sever link: https://discord.gg/NBsnNGDeQd')
    }
}