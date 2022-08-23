const { Message, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const ms = require('ms')

/**
 * 
 * @param {Message} message
 */
module.exports = async (message) => {
    let m = await message.channel.send({
        content: 'Vui chọn có bật chế độ hiển thị thời gian:\n'
            + '1️⃣ On\n'
            + '2️⃣ Off\n'
            + 'ℹ Thông tin thêm',
        components: [
            new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('on')
                        .setStyle('PRIMARY')
                        .setLabel('1️⃣ On')
                )
                .addComponents(
                    new MessageButton()
                        .setCustomId('off')
                        .setStyle('PRIMARY')
                        .setLabel('2️⃣ Off')
                )
                .addComponents(
                    new MessageButton()
                        .setCustomId('info')
                        .setStyle('PRIMARY')
                        .setLabel('ℹ Info')
                )
        ]
    })
    let button_collector = m.createMessageComponentCollector({
        time: 5 * 60 * 1000,
        filter: (inter) => inter.user.id == message.author.id
    })
    const data = await require('../../../../models/option').findOne({
        guildid: message.guildId
    })
    const timestamp_on = 'https://cdn.discordapp.com/attachments/936994104884224020/1011133039448952842/unknown.png'
    const timestamp_off = 'https://cdn.discordapp.com/attachments/936994104884224020/1011133423647195196/unknown.png'
    const rickRoll = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    button_collector.on('collect', async (inter) => {
        if (inter.customId != 'info') data.config.join_leave = inter.customId.toLowerCase()
        else return inter.reply({
            content:
                'Nếu bật chế độ hiển thị này thì khi gửi tin nhắn sẽ có kèm thời gian tin nhắn được gửi',
            embeds: [
                new MessageEmbed()
                    .setTitle('Minh họa khi bật chế độ hiển thị thời gian')
                    .setURL(Math.floor(Math.random() * 10) == 10 ? rickRoll : timestamp_on)
                    .setImage(timestamp_on),
                new MessageEmbed()
                    .setTitle('Minh họa khi tắt chế độ hiển thị thời gian')
                    .setURL(Math.floor(Math.random() * 10) == 10 ? rickRoll : timestamp_off)
                    .setImage(timestamp_off)
            ]
        }).then(msg => setTimeout(() => msg.delete, 5000))
        await data.save()
        button_collector.stop()
        m.delete()
        require('./support')(message)
    })
}