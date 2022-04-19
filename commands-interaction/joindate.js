const { CommandInteraction, MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('joindate')
        .setDescription('Xem ngày lưu dữ liệu của user trong server 2y2c.org')
        .addStringOption(option => option
            .setName('user')
            .setDescription('Tên người muốn tìm. VD: VaitoSoi.')
            .setRequired(true)
        ),
    /**
    * 
    * @param {CommandInteraction} interaction 
    */ 
    run: async(interaction) => {
        if (interaction.deferred === false) await interaction.deferReply()
        const client = interaction.client
        const kd = require('../models/kd')
        const user = interaction.options.getString('user')
        kd.findOne({ username: user }, async(err, data) => {
            if (err) throw err;
            if (data) {
                if (!data.firstdeath) return interaction.editReply('Không tìm thấy dữ liệu')
                interaction.editReply({embeds:[new MessageEmbed()
                    .setDescription(`Dữ liệu được lưu vào ${data.joinDate}`)
                    .setColor('RANDOM')]}
                )
            } else {
                interaction.editReply('Không tìm thấy dữ liệu')
            }
        })
    }
} 