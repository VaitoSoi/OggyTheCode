const { Message } = require('discord.js')
const ms = require('ms')

/**
 * 
 * @param {Message} message
 */
module.exports = async (message) => {
    const msg = await message.channel.send(
        '👇 | Vui lòng tag hoặc ghi ID của channel `livechat`\n'
        + '⏭ | Ghi `SKIP` hoặc `NO` để bỏ qua\n'
        + 'Nếu gặp các trường hợp kênh không hợp lệ thì vui lòng nhập lại!')
    const collector = message.channel.createMessageCollector({
        time: 5 * 60 * 1000,
        filter: (msg) => msg.author.id == message.author.id
    })
    const data = await require('../../../../models/option').findOne({
        guildid: message.guildId
    })
    /**
     * 
     * @param {Message} msg 
     * @param {String | Number} timeout 
     * @returns 
     */
    const deleteMsg = (msg, timeout) => setTimeout(() => {
        msg.delete()
    }, ms(timeout ? timeout : '5m'));
    collector.on('collect', async (m) => {
        m.delete()
        if (m.content.toLowerCase() == 'skip'
            || m.content.toLowerCase() == 'no') { collector.stop(); msg.delete(); return require('./channel_restart')(message) }
        let channel
        if (isNaN(msg.content)) channel = m.mentions.channels.first()
        else channel = m.guild.channels.cache.get(msg.content)
        if (!channel)
            return m.channel.send('🛑 | Channel không hợp lệ hoặc không tồn tại!').then(m => deleteMsg(m, '5m'))
        if (!channel.isText)
            return m.channel.send('🛑 | Channel phải là channel văn bản!').then(m => deleteMsg(m, '5m'))
        if (!message.guild.me.permissionsIn(channel).has('SEND_MESSAGES'))
            return m.channel.send('🛑 | Bot thiếu quyền `SEND_MESSAGES` (Gửi tin nhắn) trong kênh ' + channel).then(m => deleteMsg(m, '5m'))
        data.config.channels.livechat = channel.id
        await data.save()
        collector.stop()
        msg.delete()
        return require('./channel_restart')(message)
    })
}