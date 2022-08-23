const { CommandInteraction, MessageEmbed, MessageButton, MessageActionRow } = require('discord.js')

/**
 * 
 * @param {CommandInteraction} interaction 
 */
module.exports = async (interaction) => {
    let m = await interaction.channel.send({
        content: 'Vui lòng chọn 1 trong các lựa chọn dưới:\n'
            + '1️⃣ Embed\n'
            + '2️⃣ Message\n'
            + 'ℹ Thông tin thêm',
        components: [
            new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('embed')
                        .setStyle('PRIMARY')
                        .setLabel('Embed')
                )
                .addComponents(
                    new MessageButton()
                        .setCustomId('message')
                        .setStyle('PRIMARY')
                        .setLabel('Message')
                )
                .addComponents(
                    new MessageButton()
                        .setCustomId('info')
                        .setStyle('PRIMARY')
                        .setLabel('Info')
                )
        ]
    })
    let msg
    let button_collector = m.createMessageComponentCollector({
        time: 5 * 60 * 1000,
        filter: (inter) => inter.user.id == interaction.user.id
    })
    const data = await require('../../../../models/option').findOne({
        guildid: interaction.guildId
    })
    const embedImageLink = 'https://cdn.discordapp.com/attachments/936994104884224020/997858841351962707/unknown.png'
    const messageImageLink = 'https://cdn.discordapp.com/attachments/936994104884224020/997859375790174289/unknown.png'
    const rickRoll = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    button_collector.on('collect', async (inter) => {
        if (inter.customId != 'info') data.config.chatType = inter.customId
        else return msg = await inter.reply({
            content: 'Các loại hiển thị tin nhắn: \n'
                + '1️⃣ Embed (mặc định):\n'
                + '> Ưu điểm: hiển thị màu sắc,...\n'
                + '> Nhược điểm: yêu cầu nhiều quyền, không gọn gàng,...\n'
                + '2️⃣ Message:\n'
                + '> Ưu điểm: yêu cầu ít quyền, gọn gàng,...\n'
                + '> Nhược điểm: không hiền thị màu,...'
                + '*Vui lòng chọn lại ở phía trên*',
            embeds: [
                new MessageEmbed()
                    .setTitle('Minh họa cho dạng hiển thị tin nhắn `Embed`')
                    .setURL(Math.floor(Math.random() * 10) == 10 ? rickRoll : embedImageLink)
                    .setImage(embedImageLink),
                new MessageEmbed()
                    .setTitle('Minh họa cho dạng hiển thị tin nhắn `Message`')
                    .setURL(Math.floor(Math.random() * 10) == 10 ? rickRoll : messageImageLink)
                    .setImage(messageImageLink)
            ]
        }).then(msg => setTimeout(() => msg.delete, 5000))
        await data.save()
        button_collector.stop()
        m.delete()
        if (msg) msg.delete()
        require('./join_leave')(interaction)
    })
}