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
    run: async(interaction) => {
        const client = interaction.client
        const setrole = require('../models/setrole');
        const type = interaction.options.getString('type')
        setrole.findOne({ guildid: interaction.guild.id }, async (err, data) => {
            if (err) throw err;
            if (type === 'mute') {
                setrole.findOneAndUpdate({ guildid: interaction.guild.id }, { $set: { mute: 'No data' } }, async (err, data) => {
                    if (err) throw err;
                    interaction.reply(`Đã xóa data của role \`${type}\``)
                    data.save()
                })

            }
            if (type === 'restart') {
                setrole.findOneAndUpdate({ guildid: interaction.guild.id }, { $set: { restart: 'No data' } }, async (err, data) => {
                    if (err) throw err;
                    interaction.reply(`Đã xóa data của role \`${type}\``)
                    data.save()
                })
            }
        })
    }
} 