const { CommandInteraction } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clearrole')
        .setDescription('Xóa tất cả data về Roles của Guild'),
    /**
    * 
    * @param {CommandInteraction} interaction 
    */ 
    run: async(interaction) => {
        if (interaction.deferred === false) await interaction.deferReply()
        const client = interaction.client
        require('../models/setrole').findOne({ guildid : message.guild.id }, async(err, data) => {
            if(err) throw err;
            if(data){
                await require('../models/setrole').findOneAndDelete({ guildid : message.guild.id })
                interaction.editReply({ content: 'Đã xóa các data về role.', ephemeral: true })
                data.save()
            } else {
                interaction.editReply({ content: 'Không tìm thấy data.', ephemeral: true })
            }
        })
    }
} 