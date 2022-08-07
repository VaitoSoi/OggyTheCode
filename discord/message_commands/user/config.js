const { Client, Message, MessageEmbed } = require('discord.js')
const util = require('minecraft-server-util')

module.exports = {
    name: 'config',
    description: 'Chỉnh cài đặt của bot',
    usage: 'Dùng lệnh config đi rồi biết :v',
    /**
    * 
    * @param {Client} client 
    * @param {Message} message 
    * @param {String[]} args 
    */
    run: async (client, message, args) => {
        let action = args[1]
        let id = args[2]
        if (!action) return message.reply(
            '🔴 | Thiếu action (create, set, show, delete)\n' +
            '🟦 | Cách dùng:\n' +
            '+ og.config create\n' +
            '+ og.config set:\n' +
            '> og.config set channel <livechat|status|restart> <#channel|channel_id>\n' +
            '> og.config set role <@role|role_id>\n' +
            '> og.config set livechat_type <message|embed>\n' +
            '+ og.config show\n' +
            '+ og.config delete'
        )
        const db = require('../../../models/option')
        let data = await db.findOne({
            'guildid': message.guildId
        })
        if (action == 'create') {
            if (data)
                return message.reply('🟡 | Đã có cài đặt!')
            else {
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
                message.reply('✅ | Đã tạo cài đặt')
            }
        } else if (action == 'set') {
            if (!data)
                return message.reply('🔴 | Không có dữ liệu về cài đặt của bot.\n' +
                    '🟡 | Dùng lệnh `og.config create` để tạo cài đặt')
            if (id === 'channel') {
                let type = args[3]
                let channel
                if (isNaN(args[4])) channel = message.mentions.channels.first()
                else channel = message.guild.channels.cache.get(args[4])
                if (!channel.isText()) return message.reply(`🔴 | <#${channel.id}> phải là một kênh văn bản !`)
                if (type === 'livechat')data.config.channel.livechat = channel.id
                else if (type === 'restart') data.config.channel.restart = channel.id
                else if (type === 'status') data.config.channel.status = channel.id
                await data.save()
                if (type == 'status' || type == 'restart') {
                    try {
                        channel.permissionOverwrites.edit(message.guild.roles.everyone, {
                            'SEND_MESSAGES': false,
                        }, {
                            reason: 'Oggy set-channel',
                            type: 0
                        })
                        message.reply('✅ | Đã chỉnh role cho `@everyone`').then((msg) => setTimeout(() => {
                            msg.delete()
                        }, 20 * 1000))
                        channel.permissionOverwrites.edit(message.guild.me, {
                            'SEND_MESSAGES': true,
                            'EMBED_LINKS': true
                        }, {
                            reason: 'Oggy set-channel',
                            type: 1
                        })
                        message.channel.send('✅ | Đã chỉnh role cho bot').then((msg) => setTimeout(() => {
                            msg.delete()
                        }, 20 * 1000))
                    } catch {
                        message.channel.send(`🟡 | Vui lòng khóa kênh ${channel} tránh tình trạng trôi tin nhắn!`)
                    }
                }
                if (type == 'status') {
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
                    let m = await channel.send({
                        embeds: [embed]
                    })
                    m.react('🔁')
                    data.config.messages.restart = m.id
                    await data.save()
                } else if (type == 'restart') {
                    let send = (role) => {
                        message.channel.send('Bạn có muốn tạo một reaction-role không').then((msg) => {
                            msg.react('✅'); msg.react('❌')
                            let reaction_collector = msg.createReactionCollector({
                                time: 5 * 60 * 1000,
                                filter: (react, user) => user.id == interaction.user.id
                            })
                            reaction_collector.on('collect', (react, user) => {
                                if (react.emoji.name == '✅') {
                                    react.message.delete()
                                    channel.send(
                                        `Click 📢 để nhận role ${role}.\n` +
                                        `Role sẽ được mention khi có thông báo và khi server restart.\n`
                                    ).then(async (msg) => {
                                        msg.react('📢')
                                        data.config.messages.restart = msg.id
                                        await data.save()
                                    })
                                    reaction_collector.stop()
                                } else if (react.emoji.name == '❌') {
                                    react.message.delete()
                                    react.message.channel.send('✅ | Đã hủy')
                                    reaction_collector.stop()
                                }
                            })
                        })
                    }
                    let m = await message.channel.send(
                        'Vui lòng chọn 1 trong 2 lựa chọn sau:\n' +
                        '🟢 | Lấy một role restart có sẵn.\n' +
                        `${message.guild.me.permissions.has('MANAGE_ROLES')
                            ? '🆕 | Tạo một role restart mới' : ''}`
                    )
                    m.react('🟢');
                    if (message.guild.me.permissions.has('MANAGE_ROLES')) m.react('🆕')
                    let react_m_collector = m.createReactionCollector({
                        time: 5 * 60 * 1000,
                        filter: (react, user) => user.id == message.author.id
                    })
                    react_m_collector.on('collect', async (react, user) => {
                        m.delete()
                        if (react.emoji.name == '🆕') {
                            if (!message.guild.me.permissions.has('MANAGE_ROLES'))
                                return message.channel.send('🛑 | Bot thiếu quyền `MANAGE_ROLES` (Quản lý vai trò) nên không thể tạo role!')
                            let role = await message.guild.roles.create({
                                name: 'restart-notification',
                                reason: 'Oggy restart reaction-role',
                            })
                            message.channel.send(
                                `✅ | Đã tạo restart-role thành công.\n` +
                                `ℹ | Thông tin về role:\n` +
                                `> Tên: ${role}` +
                                `> ID: ${role.id}`
                            )
                            data.config.roles.restart = role.id
                            await data.save()
                            react_m_collector.stop()
                            send(role)
                        } else if (react.emoji.name == '🟢') {
                            let msg = await message.channel.send('👇 | Vui lòng ghi ID hoặc mention role.')
                            let react_msg_collector = message.channel.createMessageCollector({
                                time: 5 * 60 * 1000
                            })
                            react_msg_collector.on('collect', async (m) => {
                                if (m.author.id != message.author.id) return
                                let role = null
                                if (isNaN(m.content)) role = m.mentions.roles.first()
                                else role = message.guild.roles.cache.get(m.content)
                                m.delete()
                                if (!role)
                                    return m.channel.send('🔴 | Không tìm thấy role!')
                                        .then(msg => setTimeout(() => msg.delete(), 20 * 1000))
                                msg.delete()
                                data.config.roles.restart = role.id
                                await data.save()
                                message.channel.send('✅ | Đã lưu role!')
                                react_m_collector.stop()
                                react_msg_collector.stop()
                                send(role)
                            })
                        }
                    })
                }
            } else if (id == 'role') {
                let type = 'restart'
                let role
                if (isNaN(args[4])) role = message.mentions.roles.first()
                else role = message.guild.roles.cache.get(args[3])
                if (type == 'restart') set = {
                    'config.roles.restart': role.id
                }
                await db.findOneAndUpdate({
                    guildid: message.guildId
                }, {
                    $set: set
                }).then(() =>
                    message.reply('✅ | Đã chỉnh role thành công')
                ).catch(e =>
                    message.reply(
                        '🔴 | Xảy ra lỗi trong quá trình chỉnh sửa.\n' +
                        '```' + e + '```'
                    )
                )
            } else if (id == 'livechat_type') {
                data.config.chatType = args[3]
                await data.save()
                message.reply('✅ | Đã chỉnh chế độ hiển thị thành công')
            }
        } else if (action == 'show') {
            if (!data)
                return message.reply('🔴 | Không có dữ liệu về cài đặt của bot.\n' +
                    '🟡 | Dùng lệnh `og.config create` để tạo cài đặt')
            const embed = new MessageEmbed()
                .setAuthor({
                    name: `Config Menu`,
                    iconURL: `https://discord.com/assets/a6d05968d7706183143518d96c9f066e.svg`
                })
                .setTitle(`${message.guild.name} Config`)
                .addFields({
                    name: 'CHANNELS',
                    value:
                        '```\n' +
                        `livechat: ${data.config.channels.livechat}\n` +
                        `restart: ${data.config.channels.restart}\n` +
                        `status: ${data.config.channels.status}\n` +
                        '```',
                    inline: true
                }, {
                    name: 'MESSAGES',
                    value:
                        '```\n' +
                        `restart: ${data.config.messages.restart}\n` +
                        `status: ${data.config.messages.status}\n` +
                        '```',
                    inline: true
                }, {
                    name: 'ROLES',
                    value:
                        '```\n' +
                        `restart: ${data.config.roles.restart}\n` +
                        '```',
                    inline: false
                })
                .setFooter({
                    text: `${client.user.tag}`,
                    iconURL: client.user.displayAvatarURL()
                })
                .setTimestamp()
                .setColor('RANDOM')
            message.reply({
                embeds: [embed]
            })
        } else if (action == 'delete') {
            await db.findOneAndDelete({
                'guildid': message.guildId
            })
            message.reply('🟢 | Đã xóa thành công.')
        }
    }
}