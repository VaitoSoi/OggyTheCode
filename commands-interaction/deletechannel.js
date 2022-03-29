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
            if (type === 'mute') {
                setchannel.findOneAndUpdate({ guildid: interaction.guild.id }, { $set: { mute: 'No data' } }, async (err, data) => {
                    if (err) throw err;
                    interaction.reply(`Đã xóa data của channel ${type}`)
                    data.save()
                })

            } else if (type === 'ban') {
                setchannel.findOneAndUpdate({ guildid: interaction.guild.id }, { $set: { ban: 'No data' } }, async (err, data) => {
                    if (err) throw err;
                    interaction.reply(`Đã xóa data của channel ${type}`)
                    data.save()
                })
            } else if (type === 'kick') {
                setchannel.findOneAndUpdate({ guildid: interaction.guild.id }, { $set: { kick: 'No data' } }, async (err, data) => {
                    if (err) throw err;
                    interaction.reply(`Đã xóa data của channel ${type}`)
                    data.save()
                })
            } else if (type === 'warn') {
                setchannel.findOneAndUpdate({ guildid: interaction.guild.id }, { $set: { warn: 'No data' } }, async (err, data) => {
                    if (err) throw err;
                    interaction.reply(`Đã xóa data của channel ${type}`)
                    data.save()
                })
            } else if (type === 'welcome') {
                setchannel.findOneAndUpdate({ guildid: interaction.guild.id }, { $set: { welcome: 'No data' } }, async (err, data) => {
                    if (err) throw err;
                    interaction.reply(`Đã xóa data của channel ${type}`)
                    data.save()
                })
            } else if (type === 'goodbye') {
                setchannel.findOneAndUpdate({ guildid: interaction.guild.id }, { $set: { goodbye: 'No data' } }, async (err, data) => {
                    if (err) throw err;
                    interaction.reply(`Đã xóa data của channel ${type}`)
                    data.save()
                })
            } else if (type === 'livechat') {
                setchannel.findOneAndUpdate({ guildid: interaction.guild.id }, { $set: { livechat: 'No data' } }, async (err, data) => {
                    if (err) throw err;
                    interaction.reply(`Đã xóa data của channel ${type}`)
                    data.save()
                })
            } else if (type === 'submitshow') {
                setchannel.findOneAndUpdate({ guildid: interaction.guild.id }, { $set: { submitshow: 'No data' } }, async (err, data) => {
                    if (err) throw err;
                    interaction.reply(`Đã xóa data của channel ${type}`)
                    data.save()
                })
            } else if (type === 'submitnoti') {
                setchannel.findOneAndUpdate({ guildid: interaction.guild.id }, { $set: { submitnoti: 'No data' } }, async (err, data) => {
                    if (err) throw err;
                    interaction.reply(`Đã xóa data của channel ${type}`)
                    data.save()
                })
            }
        })
    }
} 