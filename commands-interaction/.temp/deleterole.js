const { CommandInteraction } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deleterole')
        .setDescription('Xóa 1 Data về 1 loại Role của Guild')
        .addStringOption(option => option
            .setName('type')
            .setDescription('Loại channel muốn xóa')
            .setRequired(true)
            .addChoice('Mute', 'mute')
            .addChoice('Restart', 'restart')
        ),
    /**
    * 
    * @param {CommandInteraction} interaction 
    */
    run: async (interaction) => {
        if (interaction.deferred === false) await interaction.deferReply()
        const client = interaction.client
        const setrole = require('../models/setrole');
        const type = interaction.options.getString('type')
        setrole.findOne({ guildid: interaction.guild.id }, async (err, data) => {
                 if (type === 'mute') data.mute = 'No data'
            else if (type === 'restart') data.ban = 'No data'
            await interaction.editReply(`Đã xóa dữ liệu về role \`${type.toUpperCase()}\``)
            await data.save()
        })
    }
} 