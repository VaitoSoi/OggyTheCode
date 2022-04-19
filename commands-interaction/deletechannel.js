const { CommandInteraction } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deletechannel')
        .setDescription('Xóa data về 1 Channel của Guild')
        .addStringOption(option => option
            .setName('type')
            .setDescription('Loại channel muốn xóa')
            .setRequired(true)
            .addChoice('Mute', 'mute')
            .addChoice('Ban', 'ban')
            .addChoice('Kick', 'Kick')
            .addChoice('Warn', 'warn')
            .addChoice('Welcome', 'welcome')
            .addChoice('Goodbye', 'goodbye')
            .addChoice('Livechat', 'livechat')
        ),
    /**
    * 
    * @param {CommandInteraction} interaction 
    */
    run: async (interaction) => {
        const client = interaction.client
        const setchannel = require('../models/setchannel');
        const type = interaction.options.getString('type')
        
        setchannel.findOne({ guildid: interaction.guild.id }, async (err, data) => {
            if (err) throw err;
                 if (type === 'mute') data.mute = 'No data'
            else if (type === 'ban') data.ban = 'No data'
            else if (type === 'kick') data.kick = 'No data'
            else if (type === 'warn') data.warn = 'No data'
            else if (type === 'welcome') data.welcome = 'No data'
            else if (type === 'goodbye') data.goodbye = 'No data'
            else if (type === 'livechat') data.livechat = 'No data'
            interaction.editReply(`Đã xóa data của channel \`${type.toUpperCase()}\``)
            data.save()
        })
    }
} 