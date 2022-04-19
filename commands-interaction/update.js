const { CommandInteraction } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('update')
        .setDescription('Update tiến độ Highway tại server 2y2c.org')
        .addStringOption(option => option
            .setName('highway')
            .setDescription('Hướng cao tốc muốn cập nhật')
            .setRequired(true)
            .addChoice('X+', 'x+')
            .addChoice('X-', 'x-')
            .addChoice('Z+', 'z+')
            .addChoice('Z-', 'z-')
        )
        .addIntegerOption(option => option
            .setName('how')
            .setDescription('Tiến trình cao tốc | Đơn vị: k (ngàn/nghìn)')
            .setRequired(true)
        ),
    /**
    * 
    * @param {CommandInteraction} interaction 
    */
    run: async (interaction) => {
        const client = interaction.client

        const highway = require('../../models/highway')

        if (interaction.user.id !== '692271452053045279' && interaction.user.id !== '749964743854522439' && interaction.user.id !== '485419430885457930' && interaction.user.id !== '321553911716642822') return interaction.editReply('🛑 | Lệnh này chỉ hoạt động với Highway worker cấp cao!')
        const updatedata = interaction.options.getstring('highway')
        const how = args[1]
        if (how > 3750) return interaction.editReply('Không thể nhập giá trị lớn hơn **"3750"**')

        highway.findOne({ which: 'straight' }, async (err, data) => {
            if (type === 'x+') {
                if (how < data.xplus) return interaction.editReply(`Data mới không thể nhỏ hơn "${data.xplus}"`)
                if (Number(data.xplus) >= 3750) return interaction.editReply('Không thể thay đổi giá trị của đoạn đường đã đạt đến 3750k')
                await highway.findOneAndUpdate({ which: 'straight' }, { $set: { xplus: how } })
                interaction.editReply('Đã cập nhật thông tin!')
            } else if (type === 'x-') {
                if (how < data.xminus) return interaction.editReply(`Data mới không thể nhỏ hơn "${data.xminus}"`)
                if (Number(data.xminus) >= 3750) return interaction.editReply('Không thể thay đổi giá trị của đoạn đường đã đạt đến 3750k')
                await highway.findOneAndUpdate({ which: 'straight' }, { $set: { xminus: how } })
                interaction.editReply('Đã cập nhật thông tin!')
            } else if (type === 'z+') {
                if (how < data.zplus) return interaction.editReply(`Data mới không thể nhỏ hơn "${data.zplus}"`)
                if (Number(data.zplus) >= 3750) return interaction.editReply('Không thể thay đổi giá trị của đoạn đường đã đạt đến 3750k')
                await highway.findOneAndUpdate({ which: 'straight' }, { $set: { zplus: how } })
                interaction.editReply('Đã cập nhật thông tin!')
            } else if (type === 'z-') {
                if (how < data.zminus) return interaction.editReply(`Data mới không thể nhỏ hơn "${data.zminus}"`)
                if (Number(data.zminus) >= 3750) return interaction.editReply('Không thể thay đổi giá trị của đoạn đường đã đạt đến 3750k')
                await highway.findOneAndUpdate({ which: 'straight' }, { $set: { zminus: how } })
                interaction.editReply('Đã cập nhật thông tin!')
            } 
        })
    }
} 