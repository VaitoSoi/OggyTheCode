const { CommandInteraction } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setrole')
        .setDescription('Setup 1 role')
        .addStringOption(option => option
            .setName('type')
            .setDescription('Thể loại muốn setup')
            .setRequired(true)
            .addChoice('Mute', 'mute')
            .addChoice('Restart', 'restart')
        )
        .addRoleOption(option => option
            .setName('role')
            .setDescription('Role muốn setup')
        ),
    /**
    * 
    * @param {CommandInteraction} interaction 
    */
    run: async (interaction) => {
        const client = interaction.client

        const setrole = require('../models/setrole')
        const type = interaction.options.getString('type')
        const id = interaction.options.getRole('role').id
        setrole.findOne({ guildid: interaction.guildId }, async (err, data) => {
            if (err) throw err;
            if (data) {
                if (type === 'mute') data.mute = id
                else if (type === 'restart') data.restart = id
                await data.save()
                interaction.editReply(`Đã cài vai trò \`@${id.name}\` thành Restart role`)
            } else if (!data) {
                interaction.editReply('Không tìm thấy dữ liệu.\nĐang tạo dữ liệu...')
                data = new setrole({
                    guildid: interaction.guildId,
                    guildname: interaction.guild.name,
                    restart: 'No data',
                    mute: 'No data',
                })
                if (type === 'mute') data.mute = id
                else if (type === 'restart') data.restart = id
                data.save()
                interaction.editReply(`Đã tạo dữ liệu.\nĐã cài vai trò \`@${id.name}\` thành Restart role`)
            }
        })
    }
} 