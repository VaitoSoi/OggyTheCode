const { CommandInteraction } = require('discord.js')

/**
 * 
 * @param {CommandInteraction} interaction 
 */
module.exports = async (interaction) => {
    const db = require('../../../../models/option')
    let data = await db.findOne({
        guildid: interaction.guildId
    })
    if (!data) {
        data = new db({
            guildid: interaction.guildId,
            guildname: interaction.guild.name,
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
        interaction.channel.send('✅ | Đã tạo data').then(m => setTimeout(() => m.delete, 5 * 1000))
    } else interaction.channel.send('✅ | Đã có data').then(m => setTimeout(() => m.delete, 5 * 1000))
    interaction.channel.send('2️⃣ | Tạo các dữ liệu về kênh')
    return require('./channel_livechat')(interaction)
}