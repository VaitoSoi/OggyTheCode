const { Message, MessageEmbed } = require('discord.js')
const ms = require('ms')
const util = require('minecraft-server-util')

/**
 * 
 * @param {Message} message
 */
module.exports = async (message) => {
    const client = message.client
    const msg = await message.channel.send(
        '👇 | Vui lòng tag hoặc ghi ID của channel `status`\n'
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
            || m.content.toLowerCase() == 'no') { collector.stop(); msg.delete(); return require('./message_chatType')(message) }
        let channel
        if (isNaN(msg.content)) channel = m.mentions.channels.first()
        else channel = m.guild.channels.cache.get(msg.content)
        if (!channel)
            return m.channel.send('🛑 | Channel không hợp lệ hoặc không tồn tại!').then(m => deleteMsg(m, '5m'))
        if (!channel.isText || channel.isVoice())
            return m.channel.send('🛑 | Channel phải là channel văn bản!').then(m => deleteMsg(m, '5m'))
        if (!message.guild.me.permissionsIn(channel).has('SEND_MESSAGES'))
            return m.channel.send('🛑 | Bot thiếu quyền `SEND_MESSAGES` (Gửi tin nhắn) trong kênh ' + channel).then(m => deleteMsg(m, '5m'))
        data.config.channels.status = channel.id
        await data.save()
        collector.stop()
        msg.delete()
        const embed = new MessageEmbed()
            .setAuthor({
                name: `${client.user.tag} Server Utils`,
                iconURL: client.user.displayAvatarURL()
            })
            .setTitle(`\`${process.env.MC_HOST.toUpperCase()}\` Status`)
            .setFooter({
                text: `${message.author.tag}`,
                iconURL: message.author.displayAvatarURL()
            })
            .setTimestamp()
            .setThumbnail(`https://mc-api.net/v3/server/favicon/${process.env.MC_HOST}`)
        const now = Date.now()
        await util.status(process.env.MC_HOST, Number(process.env.MC_PORT))
            .then((response) => {
                const ping = Date.now() - now
                embed
                    .setColor('GREEN')
                    .setDescription(
                        `**Status:** 🟢 Online\n` +
                        `**Player:** ${response.players.online}/${response.players.max}\n` +
                        `**Version:** ${response.version.name}\n` +
                        `**Ping:** ${ping}\n` +
                        `**MOTD:** \n>>> ${response.motd.clean}\n`
                    )
            })
            .catch(e => {
                embed
                    .setColor('RED')
                    .setDescription(
                        '**Status:** 🔴 Offline\n' +
                        'Phát hiện lỗi khi lấy dữ liệu từ server:' +
                        '```' + `${e}` + '```'
                    )
            })
        let m2 = await channel.send({
            embeds: [embed]
        })
        m2.react('🔁')
        data.config.messages.status = m2.id
        await data.save()
        return require('./message_chatType')(message)
    })
}