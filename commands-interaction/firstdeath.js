const { CommandInteraction, MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('firstdeath')
        .setDescription('Xem cái chết đầu tiên của user trong server 2y2c.org')
        .addStringOption(option => option
            .setName('user')
            .setDescription('Tên người muốn tìm. VD: VaitoSoi.')
            .setRequired(true)
        ),
    /**
    * 
    * @param {CommandInteraction} interaction 
    */
    run: async (interaction) => {
        const client = interaction.client

        const kd = require('../models/kd')
        const user = interaction.options.getString('user')
        kd.findOne({ username: user }, async (err, data) => {
            if (err) throw err;
            if (data) {
                if (!data.firstdeath) return interaction.editReply('Không tìm thấy dữ liệu')
                interaction.editReply({
                    embeds: [
                        new MessageEmbed()
                            .setDescription(data.firstdeath)
                            .setColor('RANDOM')]
                })
            } else {
                interaction.editReply('Không tìm thấy dữ liệu')
            }
        })
    }
} 