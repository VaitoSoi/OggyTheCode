const { CommandInteraction, Message } = require('discord.js')
const ms = require('ms')

/**
 * 
 * @param {CommandInteraction} interaction 
 */
module.exports = async (interaction) => {
    const msg = await interaction.channel.send(
        '👇 | Vui lòng tag hoặc ghi ID của channel `restart`\n'
        + '⏭ | Ghi `SKIP` hoặc `NO` để bỏ qua\n'
        + 'Nếu gặp các trường hợp kênh không hợp lệ thì vui lòng nhập lại!')
    const collector = interaction.channel.createMessageCollector({
        time: 5 * 60 * 1000,
        filter: (msg) => msg.author.id == interaction.user.id
    })
    const data = await require('../../../../models/option').findOne({
        guildid: interaction.guildId
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
            || m.content.toLowerCase() == 'no') { collector.stop(); msg.delete(); return require('./channel_status')(interaction) }
        let channel
        if (isNaN(msg.content)) channel = m.mentions.channels.first()
        else channel = m.guild.channels.cache.get(msg.content)
        if (!channel)
            return m.channel.send('🛑 | Channel không hợp lệ hoặc không tồn tại!').then(m => deleteMsg(m, '5m'))
        if (!channel.isText)
            return m.channel.send('🛑 | Channel phải là channel văn bản!').then(m => deleteMsg(m, '5m'))
        if (!interaction.guild.me.permissionsIn(channel).has('SEND_MESSAGES'))
            return m.channel.send('🛑 | Bot thiếu quyền `SEND_MESSAGES` (Gửi tin nhắn) trong kênh ' + channel).then(m => deleteMsg(m, '5m'))
        data.config.channels.restart = channel.id
        await data.save()
        collector.stop()
        msg.delete()
        let send = (role) => {
            if (!interaction.guild.me.permissions.has('MANAGE_ROLES')) return require('./channel_status')(interaction)
            interaction.channel.send('Bạn có muốn tạo một reaction-role không').then((msg) => {
                msg.react('✅'); msg.react('❌')
                let reaction_collector = msg.createReactionCollector({
                    time: 5 * 60 * 1000,
                    filter: (react, user) => user.id == interaction.user.id
                })
                reaction_collector.on('collect', async (react, user) => {
                    if (react.emoji.name == '✅') {
                        react.message.delete()
                        channel.send(
                            `Click 📢 để nhận role ${role}.\n` +
                            `Role sẽ được mention khi có thông báo và khi server restart.\n`
                        ).then(async (msg) => {
                            msg.react('📢')
                            data.config.messages.restart = msg.id
                            await data.save()
                            return require('./channel_status')(interaction)
                        })
                        reaction_collector.stop()
                    } else if (react.emoji.name == '❌') {
                        react.message.delete()
                        react.message.channel.send('✅ | Đã hủy')
                        reaction_collector.stop()
                        return require('./channel_status')(interaction)
                    }
                })
            })
        }
        let m2 = await interaction.channel.send(
            'Vui lòng chọn 1 trong 2 lựa chọn sau:\n' +
            '🟢 | Lấy một role restart có sẵn.\n' +
            `${interaction.guild.me.permissions.has('MANAGE_ROLES')
                ? '🆕 | Tạo một role restart mới' : ''}`
        )
        m2.react('🟢')
        if (interaction.guild.me.permissions.has('MANAGE_ROLES')) m2.react('🆕')
        let m_reaction_collector = m2.createReactionCollector({
            time: 5 * 60 * 1000,
            filter: (react, user) => user.id == interaction.user.id
        })
        m_reaction_collector.on('collect', async (react, user) => {
            react.users.remove(user)
            if (react.emoji.name == '🆕') {
                if (!interaction.guild.me.permissions.has('MANAGE_ROLES'))
                    return interaction.channel.send('🛑 | Bot thiếu quyền `MANAGE_ROLES` (Quản lý vai trò) nên không thể tạo role!')
                m2.delete()
                let role = await interaction.guild.roles.create({
                    name: 'restart-notification',
                    reason: 'Oggy restart role',
                })
                interaction.channel.send(
                    `✅ | Đã tạo restart-role thành công.\n` +
                    `ℹ | Thông tin về role:\n` +
                    `> Tên: ${role}` +
                    `> ID: ${role.id}`
                )
                data.config.roles.restart = role.id
                await data.save()
                m_reaction_collector.stop()
                send(role)
            } else if (react.emoji.name == '🟢') {
                m2.delete()
                let msg = await interaction.channel.send('👇 | Vui lòng ghi ID hoặc mention role.')
                let interaction_message_collector = interaction.channel.createMessageCollector({
                    time: 5 * 60 * 1000,
                    filter: (m) => m.author.id == interaction.user.id
                })
                interaction_message_collector.on('collect', async (m3) => {
                    let role = null
                    if (isNaN(m.content)) role = m.mentions.roles.first()
                    else role = interaction.guild.roles.cache.get(m.content)
                    m3.delete()
                    if (!role)
                        return m.channel.send('🔴 | Không tìm thấy role!')
                            .then(msg => setTimeout(() => msg.delete(), 20 * 1000))
                    msg.delete()
                    data.config.roles.restart = role.id
                    await data.save()
                    interaction.channel.send('✅ | Đã lưu role!').then(m => setTimeout(() => m.delete, 5 * 1000))
                    interaction_message_collector.stop()
                    send(role)
                })
            }
        })
    })
}