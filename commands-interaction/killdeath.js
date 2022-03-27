const { CommandInteraction, MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('killdeath')
        .setDescription('Xem KDA của user trong server 2y2c.org')
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
        const client = interaction.client
        const kd = require('../models/kd')
        const user = interaction.options.getString('user')
        kd.findOne({ username: user }, async(err, data) => {
            if(err) throw err;
            if(data) {
                var kd = data.kill / data.death
                if (!data.death && !data.kill) kd = `No data`
                if (data.death === '0' && data.kill === '0') kd = '0'
                if (data.death === '0' || !data.death) kd = `Kill: ${data.kill}`
                if (data.kill === '0' || !data.kill) kd = ` Death: ${data.death}`
                interaction.reply({embeds:[new MessageEmbed()
                    .setTitle(`Số kill/death của ${user}`)
                    .addFields({
                        name: 'Kill',
                        value: `${data.kill}`,
                        inline: true
                    }, 
                    {
                        name: 'Death',
                        value: `${data.death}`,
                        inline: true
                    },
                    {
                        name: 'K/D',
                        value: `${kd}`,
                        inline: true
                    })
                    .setColor('RANDOM')]}
                )
            } else {
                interaction.reply('Không thấy data.\nHãy bóp bird tự tử để tạo data')
            }
        })
    }
} 