const highway = require('../models/highway')
    , { CommandInteraction } = require('discord.js')
    , { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('update')
        .setDescription('Update tiến độ Highway')
        .addStringOption(option => option
            .setName('direction')
            .setDescription('Hướng cao tốc muốn chỉnh.')
            .addChoice('X+', 'x+')
            .addChoice('X-', 'x-')
            .addChoice('Z+', 'z+')
            .addChoice('Z-', 'z-')
            .setRequired(true)
        )
        .addNumberOption(option => option
            .setName('update')
            .setDescription('Tiến độ muốn cập nhật.')
            .setMaxValue(3750)
            .setMinValue(1)
            .setRequired(true)
        ),
    /**
    * 
    * @param {CommandInteraction} interaction 
    */
    run: async (interaction) => {
        const client = interaction.client
        let data = highway.findOne({ which: 'straight' })
            , updatedata = interaction.options.getString('direction')
            , how = interaction.options.getNumber('update')
            , old = 0
            , name = {}
        if (interaction.user.id !== '692271452053045279' && interaction.user.id !== '749964743854522439' && interaction.user.id !== '485419430885457930' && interaction.user.id !== '321553911716642822') return interaction.editReply('M là ai, m là thg nào, t ko quen m, tránh xa t ra!')
        if (updatedata === 'x+') {
            old = Number(data.xplus)
            name = { 'xplus': how }
        } else if (updatedata === 'z+') {
            old = Number(data.zplus)
            name = { 'zplus': how }
        } else if (updatedata === 'x-') {
            old = Number(data.xminus)
            name = { 'xminus': how }
        } else if (updatedata === 'z-') {
            old = Number(data.zminus)
            name = { 'xminus': how }
        }
        if (how < old) return interaction.editReply(`Data mới không thể nhỏ hơn \`${old}\``)
        if (old >= 3750) return interaction.editReply('Không thể thay đổi giá trị của đoạn đường đã đạt đến 3750k')
        await highway.findOneAndUpdate({
            which: 'straight'
        }, {
            $set: name
        }).then(() => interaction.editReply('✅ | Đã cập nhật data!'))
    }
}