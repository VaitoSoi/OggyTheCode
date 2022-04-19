const { CommandInteraction } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clearchannel')
        .setDescription('Xóa tất cả data về Chnanel của Guild'),
    /**
    * 
    * @param {CommandInteraction} interaction 
    */ 
    run: async(interaction) => {
        if (interaction.deferred === false) await interaction.deferReply()
        const client = interaction.client
        require('../models/setchannel').findOne({ guildid: interaction.guild.id }, async (err, data) => {
            if (err) throw err;
            if (data) {
                await require('../models/setchannel').findOneAndDelete({ guildid: interaction.guild.id })
                interaction.editReply({ content: 'Đã xóa các data về channel.', ephemeral: true })
                data.save()
            } else {
                interaction.editReply({ content: 'Không tìm thấy data.', ephemeral: true })
            }
        })
    }
} 