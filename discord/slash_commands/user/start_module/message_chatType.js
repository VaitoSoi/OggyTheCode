const { CommandInteraction, MessageEmbed } = require('discord.js')

/**
 * 
 * @param {CommandInteraction} interaction 
 */
module.exports = async (interaction) => {
    let m = await interaction.channel.send(
        'Vui lòng chọn 1 trong các lựa chọn dưới:\n'
        + '1️⃣ Embed\n'
        + '2️⃣ Message\n'
        + 'ℹ Thông tin thêm'
    )
    let msg 
    m.react('1️⃣'); m.react('2️⃣'); m.react('ℹ')
    let reaction_collector = m.createReactionCollector({
        time: 5 * 60 * 1000,
        filter: (react, user) => user.id == interaction.user.id
    })
    const data = await require('../../../../models/option').findOne({
        guildid: interaction.guildId
    })
    const embedImageLink = 'https://cdn.discordapp.com/attachments/936994104884224020/997858841351962707/unknown.png'
    const messageImageLink = 'https://cdn.discordapp.com/attachments/936994104884224020/997859375790174289/unknown.png'
    const rickRoll = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    reaction_collector.on('collect', async (react, user) => {
        if (react.emoji.name == '1️⃣') data.config.chatType = 'embed'
        else if (react.emoji.name == '2️⃣') data.config.chatType = 'message'
        else if (react.emoji.name == 'ℹ') return msg = await react.message.reply({
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
        })
        await data.save()
        reaction_collector.stop()
        m.delete()
        if (msg) msg.delete()
        require('./support')(interaction)
    })
}