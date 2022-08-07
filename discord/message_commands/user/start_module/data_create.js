const { Message } = require('discord.js')

/**
 * 
 * @param {Message} message
 */
module.exports = async (message) => {
    const db = require('../../../../models/option')
    let data = await db.findOne({
        guildid: message.guildId
    })
    if (!data) {
        data = new db({
            guildid: message.guildId,
            guildname: message.guild.name,
            config: {
                channels: {
                    livechat: '',
                    restart: '',
                    status: ''
                },
                messages: {
                    restart: '',
                    status: '',
                },
                roles: {
                    restart: ''
                },
                chatType: 'embed',
                prefix: 'og.'
            }
        })
        await data.save()
        message.channel.send('✅ | Đã tạo data').then(m => setTimeout(() => m.delete, 5 * 1000))
    } else message.channel.send('✅ | Đã có data').then(m => setTimeout(() => m.delete, 5 * 1000))
    message.channel.send('2️⃣ | Tạo các dữ liệu về kênh')
    return require('./channel_livechat')(message)
}