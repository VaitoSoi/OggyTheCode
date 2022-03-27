const { CommandInteraction } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resetprefix')
        .setDescription('Chuyển prefix về mặc định'),
    /**
    * 
    * @param {CommandInteraction} interaction 
    */ 
    run: async(interaction) => {
        const client = interaction.client

        const prefixSchema = require('../models/prefix')
        const prefix = process.env.PREFIX

        await prefixSchema.findOneAndDelete({ GuildId: interaction.guild.id })
        interaction.reply(`Đã chuyển prefix về "**${prefix}**"`)
    }
} 