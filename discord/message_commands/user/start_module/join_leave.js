const { Message, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const ms = require('ms')

/**
 * 
 * @param {Message} message
 */
module.exports = async (message) => {
    let m = await message.channel.send({
        content: 'Vui chọn có bật chế độ hiển thị người chơi khi vào hoặc thoát server:\n'
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
    const join_leave_image = 'https://cdn.discordapp.com/attachments/936994104884224020/1011130997527560252/unknown.png'
    const rickRoll = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    button_collector.on('collect', async (inter) => {
        if (inter.customId != 'info') data.config.join_leave = inter.customId.toLowerCase()
        else return inter.reply({
            content:
                'Nếu bật chế độ hiển thị này thì bot sẽ thông báo khi: \n' +
                '> Có người vào cụm Main\n' +
                '> Có người thoát cụm Main\n' +
                'Lưu ý: Bot không thông báo khi có người vào hoặc ra trong cụm PIN\n' +
                '* Vui lòng chọn lại ở phía trên *',
            embeds: [
                new MessageEmbed()
                    .setTitle('Minh họa cho chế độ hiển thị người chơi')
                    .setURL(Math.floor(Math.random() * 10) == 10 ? rickRoll : join_leave_image)
                    .setImage(join_leave_image)
            ]
        }).then(msg => setTimeout(() => msg.delete, 5000))
        await data.save()
        button_collector.stop()
        m.delete()
        require('./timestamp')(message)
    })
}