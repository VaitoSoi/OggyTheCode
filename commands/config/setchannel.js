const setchannel = require('../../models/setchannel')
const { MessageEmbed, Permissions, Message, MessageActionRow, MessageButton } = require('discord.js')

module.exports = {
    name: 'setchannel',
    aliases: ['caikenh'],
    usage: '<id hoặc tag>',
    category: 'user',
    description: 'Để cài 1 channel nào đó.',
    permissions: ['MANAGE_CHANNELS'],
    /** 
     * @param {Message} message 
     */
    run: async (client, message, args) => {
        if (!args[0]) {

            let type = ''
            let type1 = ''
            let type2 = ''
            let channel
            message.channel.send('🔽 | Vui lòng nhập loại channnel dưới đây.\n\n1️⃣ | `mute, ban, kick, warn`\n2️⃣ | `welcome, goodbye, livechat, submitshow, submitnoti`').then(() => {
                type2 = 'type'
            })
            const collector = message.channel.createMessageCollector()
            collector.on('collect', (msg) => {
                if (msg.author.id === client.user.id || msg.author.id !== message.author.id) return;
                if (type2 === 'type') {
                    type = msg.content.toLowerCase()

                    if (!type) return message.channel.send('Vui lòng chọn 1 trong những lựa chọn sau `mute, ban, kick, warn, welcome, goodbye, livechat, submitshow, submitnoti`')
                    if (type !== 'mute' && type !== 'ban' && type !== 'kick' && type !== 'warn' && type !== 'welcome' && type !== 'goodbye' && type !== 'livechat' && type !== 'status' && type !== 'submitshow' && type !== 'submitnoti') {
                        message.channel.send('Chỉ có các loại channel là `mute, ban, kick, warn, welcome, goodbye, livechat, submitshow, submitnoti`')
                    }

                    if (type === 'mute') type1 = 'Mute'
                    if (type === 'ban') type1 = 'Ban'
                    if (type === 'kick') type1 = 'Kick'
                    if (type === 'warn') type1 = 'Warn'
                    if (type === 'welcome') type1 = 'Welcome'
                    if (type === 'goodbye') type1 = 'Goodbye'
                    if (type === 'livechat') type1 = 'Livechat'
                    if (type === 'submitshow') type1 = 'Submit Show'
                    if (type === 'submitnoti') type1 = 'Submit Noti'
                    message.channel.send(`❓ | Có phải loại channel bạn muốn cài là \`${type1}\` không ?\nNhấn ✅ nếu có.\nNhấn ❌ nếu không`).then((mes) => {
                        mes.react('✅')
                        mes.react('❌')
                        const collector2 = mes.createReactionCollector()
                        collector2.on('collect', (react, user) => {
                            if (user.id === client.user.id || user.id !== message.author.id) return;
                            if (type2 !== 'type') return
                            if (react.emoji.name === '✅') {
                                message.channel.send('Mời bạn ghi ID hoặc tag của channnel!').then(() => {
                                    type2 = 'channel'
                                })
                            } else if (react.emoji.name === '❌') {
                                message.channel.send('Mời bạn nhập lại loại channel').then(() => {
                                    type2 = 'type'
                                })
                            }
                        })
                    })
                } else if (type2 === 'channel') {
                    if (isNaN(msg.content.split(' ')[0])) {
                        channel = message.mentions.channels.first()
                    } else {
                        channel = message.guild.channels.cache.get(msg.content.split(' ')[0])
                    }
                    if (!channel) return message.channel.send('ID channel không hợp lệ hoặc không tìm thấy channel')
                    if (!message.guild.me.permissionsIn(channel).has('SEND_MESSAGES')) return message.reply(`Tôi thiếu quyền \`SEND_MESSAGES\` trong channel ${channel.name}`);

                    message.channel.send(`Có phải channel bạn muốn cài là <#${channel.id}> không ?\nNhấn ✅ nếu có.\nNhấn ❌ nếu không`).then((mes) => {
                        mes.react('✅')
                        mes.react('❌')
                            type2 = ''

                        const collector2 = mes.createReactionCollector()
                        collector2.on('collect', (react, user) => {
                            if (user.id === client.user.id || user.id !== message.author.id) return;
                            if (react.emoji.name === '✅') {
                                if (type === 'mute') {
                                    setchannel.findOneAndUpdate({ guildid: message.guild.id }, { $set: { mute: channel } }, async (err, data) => {
                                        if (err) throw err;
                                        if (!data) {
                                            message.channel.send(`Không tìm thấy data.\nVui lòng dùng lệnh "*channel*" để tạo data.`)
                                        }
                                        if (data) {
                                            const embed = new MessageEmbed()
                                                .setAuthor({ name: `${client.user.tag}`, iconURL: client.user.displayAvatarURL() })
                                                .setTitle('Đã set channel thành công')
                                                .setColor('RANDOM')
                                                .addFields({
                                                    name: 'Tên channel',
                                                    value: `${channel}`
                                                },
                                                    {
                                                        name: 'ID của channel',
                                                        value: `${channel.id}`
                                                    },
                                                    {
                                                        name: 'Thể loại',
                                                        value: `${type1}`
                                                    })
                                            message.channel.send({ embeds: [embed] })
                                            channel.send(`Channel đã được set thành "**${type1}**"`)
                                            data.save()
                                        }
                                    })
                                } else if (type === 'kick') {
                                    setchannel.findOneAndUpdate({ guildid: message.guild.id }, { $set: { kick: channel } }, async (err, data) => {
                                        if (err) throw err;
                                        if (!data) {
                                            message.channel.send(`Không tìm thấy data.\nVui lòng dùng lệnh "*channel*" để tạo data.`)
                                        }
                                        if (data) {
                                            const embed = new MessageEmbed()
                                                .setAuthor({ name: `${client.user.tag}`, iconURL: client.user.displayAvatarURL() })
                                                .setTitle('Đã set channel thành công')
                                                .setColor('RANDOM')
                                                .addFields({
                                                    name: 'Tên channel',
                                                    value: `${channel}`
                                                },
                                                    {
                                                        name: 'ID của channel',
                                                        value: `${channel.id}`
                                                    },
                                                    {
                                                        name: 'Thể loại',
                                                        value: `${type1}`
                                                    })
                                            message.channel.send({ embeds: [embed] })
                                            channel.send(`Channel đã được set thành "**${type1}**"`)
                                            data.save()
                                        }
                                    })
                                } else if (type === 'ban') {
                                    setchannel.findOneAndUpdate({ guildid: message.guild.id }, { $set: { ban: channel } }, async (err, data) => {
                                        if (err) throw err;
                                        if (!data) {
                                            message.channel.send(`Không tìm thấy data.\nVui lòng dùng lệnh "*channel*" để tạo data.`)
                                        }
                                        if (data) {
                                            const embed = new MessageEmbed()
                                                .setAuthor({ name: `${client.user.tag}`, iconURL: client.user.displayAvatarURL() })
                                                .setTitle('Đã set channel thành công')
                                                .setColor('RANDOM')
                                                .addFields({
                                                    name: 'Tên channel',
                                                    value: `${channel}`
                                                },
                                                    {
                                                        name: 'ID của channel',
                                                        value: `${channel.id}`
                                                    },
                                                    {
                                                        name: 'Thể loại',
                                                        value: `${type1}`
                                                    })
                                            message.channel.send({ embeds: [embed] })
                                            channel.send(`Channel đã được set thành "**${type1}**"`)
                                            data.save()
                                        }
                                    })
                                } else if (type === 'warn') {
                                    setchannel.findOneAndUpdate({ guildid: message.guild.id }, { $set: { warn: channel } }, async (err, data) => {
                                        if (err) throw err;
                                        if (!data) {
                                            message.channel.send(`Không tìm thấy data.\nVui lòng dùng lệnh "*channel*" để tạo data.`)
                                        }
                                        if (data) {
                                            const embed = new MessageEmbed()
                                                .setAuthor({ name: `${client.user.tag}`, iconURL: client.user.displayAvatarURL() })
                                                .setTitle('Đã set channel thành công')
                                                .setColor('RANDOM')
                                                .addFields({
                                                    name: 'Tên channel',
                                                    value: `${channel}`
                                                },
                                                    {
                                                        name: 'ID của channel',
                                                        value: `${channel.id}`
                                                    },
                                                    {
                                                        name: 'Thể loại',
                                                        value: `${type1}`
                                                    })
                                            message.channel.send({ embeds: [embed] })
                                            channel.send(`Channel đã được set thành "**${type1}**"`)
                                            data.save()
                                        }
                                    })
                                } else if (type === 'welcome') {
                                    setchannel.findOneAndUpdate({ guildid: message.guild.id }, { $set: { welcome: channel } }, async (err, data) => {
                                        if (err) throw err;
                                        if (!data) {
                                            message.channel.send(`Không tìm thấy data.\nVui lòng dùng lệnh "*channel*" để tạo data.`)
                                        }
                                        if (data) {
                                            const embed = new MessageEmbed()
                                                .setAuthor({ name: `${client.user.tag}`, iconURL: client.user.displayAvatarURL() })
                                                .setTitle('Đã set channel thành công')
                                                .setColor('RANDOM')
                                                .addFields({
                                                    name: 'Tên channel',
                                                    value: `${channel}`
                                                },
                                                    {
                                                        name: 'ID của channel',
                                                        value: `${channel.id}`
                                                    },
                                                    {
                                                        name: 'Thể loại',
                                                        value: `${type1}`
                                                    })
                                            message.channel.send({ embeds: [embed] })
                                            channel.send(`Channel đã được set thành "**${type1}**"`)
                                            data.save()
                                        }
                                    })
                                } else if (type === 'goodbye') {
                                    setchannel.findOneAndUpdate({ guildid: message.guild.id }, { $set: { goodbye: channel } }, async (err, data) => {
                                        if (err) throw err;
                                        if (!data) {
                                            message.channel.send(`Không tìm thấy data.\nVui lòng dùng lệnh "*channel*" để tạo data.`)
                                        }
                                        if (data) {
                                            const embed = new MessageEmbed()
                                                .setAuthor({ name: `${client.user.tag}`, iconURL: client.user.displayAvatarURL() })
                                                .setTitle('Đã set channel thành công')
                                                .setColor('RANDOM')
                                                .addFields({
                                                    name: 'Tên channel',
                                                    value: `${channel}`
                                                },
                                                    {
                                                        name: 'ID của channel',
                                                        value: `${channel.id}`
                                                    },
                                                    {
                                                        name: 'Thể loại',
                                                        value: `${type1}`
                                                    })
                                            message.channel.send({ embeds: [embed] })
                                            channel.send(`Channel đã được set thành "**${type1}**"`)
                                            data.save()
                                        }
                                    })
                                } else if (type === 'livechat') {
                                    setchannel.findOneAndUpdate({ guildid: message.guild.id }, { $set: { livechat: channel } }, async (err, data) => {
                                        if (err) throw err;
                                        if (!data) {
                                            message.channel.send(`Không tìm thấy data.\nVui lòng dùng lệnh "*channel*" để tạo data.`)
                                        }
                                        if (data) {
                                            const embed = new MessageEmbed()
                                                .setAuthor({ name: `${client.user.tag}`, iconURL: client.user.displayAvatarURL() })
                                                .setTitle('Đã set channel thành công')
                                                .setColor('RANDOM')
                                                .addFields({
                                                    name: 'Tên channel',
                                                    value: `${channel}`
                                                },
                                                    {
                                                        name: 'ID của channel',
                                                        value: `${channel.id}`
                                                    },
                                                    {
                                                        name: 'Thể loại',
                                                        value: `${type1}`
                                                    })
                                            message.channel.send({ embeds: [embed] })
                                            channel.send(`Channel đã được set thành "**${type1}**"`)
                                            data.save()
                                        }
                                    })
                                } else if (type === 'submitshow') {
                                    setchannel.findOneAndUpdate({ guildid: message.guild.id }, { $set: { submitshow: channel } }, async (err, data) => {
                                        if (err) throw err;
                                        if (!data) {
                                            message.channel.send(`Không tìm thấy data.\nVui lòng dùng lệnh "*channel*" để tạo data.`)
                                        }
                                        if (data) {
                                            const row = new MessageActionRow()
                                                .addComponents(
                                                    new MessageButton()
                                                        .setCustomId('create-submit')
                                                        .setLabel('📨 Tạo submit')
                                                        .setStyle('PRIMARY')
                                                        .setDisabled(false)
                                                )
                                            channel.send({
                                                content: 'Vui lòng nhấn vào nút `Tạo submit` phía dưới để bắt đầu.\nKhông được spam dưới bất kì hình thức nào !',
                                                components: [row]
                                            })
                                            message.channel.send(`Channel đã được set thành "**${type1}**"`)
                                            data.save()
                                        }
                                    })
                                }
                            } else if (react.emoji.name === '❌') {
                                message.channel.send('Mời bạn ghi lại ID hoặc tag của channnel!').then(() => {
                                    type2 = 'channel'
                                })
                            }
                        })
                    })
                }
            })
        } else {
            const type = args[0]
            let channel
            if (isNaN(args[1])) {
                channel = message.mentions.channels.first()
            } else {
                channel = message.guild.channels.cache.get(args[1])
            }
            if (!type) return message.channel.send('Vui lòng chọn 1 trong những lựa chọn sau `mute, ban, kick, warn, welcome, goodbye, livechat, submit, submitshow, submitnoti`')
            if (type !== 'mute' && type !== 'ban' && type !== 'kick' && type !== 'warn' && type !== 'welcome' && type !== 'goodbye' && type !== 'livechat' && type !== 'status' && type !== 'submitshow' && type !== 'submitnoti' && type !== 'submit') {
                message.channel.send('Chỉ có các loại channel là `mute, ban, kick, warn, welcome, goodbye, livechat, submit, submitshow, submitnoti`')
            }
            if (!channel) return message.channel.send('ID channel không hợp lệ hoặc không tìm thấy channel')
            if (!message.guild.me.permissionsIn(channel).has('SEND_MESSAGES')) return message.channel.send(`Tôi thiếu quyền \`SEND_MESSAGES\` trong channel ${channel.name}`);

            if (type === 'mute') type1 = 'Mute'
            if (type === 'ban') type1 = 'Ban'
            if (type === 'kick') type1 = 'Kick'
            if (type === 'warn') type1 = 'Warn'
            if (type === 'welcome') type1 = 'Welcome'
            if (type === 'goodbye') type1 = 'Goodbye'
            if (type === 'livechat') type1 = 'Livechat'
            if (type === 'submit') type1 = 'Submit'
            if (type === 'submitshow') type1 = 'Submit Show'
            if (type === 'submitnoti') type1 = 'Submit Noti'

            if (type === 'mute') {
                setchannel.findOneAndUpdate({ guildid: message.guild.id }, { $set: { mute: channel } }, async (err, data) => {
                    if (err) throw err;
                    if (!data) {
                        message.channel.send(`Không tìm thấy data.\nVui lòng dùng lệnh "*channel*" để tạo data.`)
                    }
                    if (data) {
                        const embed = new MessageEmbed()
                            .setAuthor({ name: `${client.user.tag}`, iconURL: client.user.displayAvatarURL() })
                            .setTitle('Đã set channel thành công')
                            .setColor('RANDOM')
                            .addFields({
                                name: 'Tên channel',
                                value: `${channel}`
                            },
                                {
                                    name: 'ID của channel',
                                    value: `${channel.id}`
                                },
                                {
                                    name: 'Thể loại',
                                    value: `${type1}`
                                })
                        message.channel.send({ embeds: [embed] })
                        channel.send(`Channel đã được set thành "**${type1}**"`)
                        data.save()
                    }
                })
            }
            if (type === 'kick') {
                setchannel.findOneAndUpdate({ guildid: message.guild.id }, { $set: { kick: channel } }, async (err, data) => {
                    if (err) throw err;
                    if (!data) {
                        message.channel.send(`Không tìm thấy data.\nVui lòng dùng lệnh "*channel*" để tạo data.`)
                    }
                    if (data) {
                        const embed = new MessageEmbed()
                            .setAuthor({ name: `${client.user.tag}`, iconURL: client.user.displayAvatarURL() })
                            .setTitle('Đã set channel thành công')
                            .setColor('RANDOM')
                            .addFields({
                                name: 'Tên channel',
                                value: `${channel}`
                            },
                                {
                                    name: 'ID của channel',
                                    value: `${channel.id}`
                                },
                                {
                                    name: 'Thể loại',
                                    value: `${type1}`
                                })
                        message.channel.send({ embeds: [embed] })
                        channel.send(`Channel đã được set thành "**${type1}**"`)
                        data.save()
                    }
                })
            }
            if (type === 'ban') {
                setchannel.findOneAndUpdate({ guildid: message.guild.id }, { $set: { ban: channel } }, async (err, data) => {
                    if (err) throw err;
                    if (!data) {
                        message.channel.send(`Không tìm thấy data.\nVui lòng dùng lệnh "*channel*" để tạo data.`)
                    }
                    if (data) {
                        const embed = new MessageEmbed()
                            .setAuthor({ name: `${client.user.tag}`, iconURL: client.user.displayAvatarURL() })
                            .setTitle('Đã set channel thành công')
                            .setColor('RANDOM')
                            .addFields({
                                name: 'Tên channel',
                                value: `${channel}`
                            },
                                {
                                    name: 'ID của channel',
                                    value: `${channel.id}`
                                },
                                {
                                    name: 'Thể loại',
                                    value: `${type1}`
                                })
                        message.channel.send({ embeds: [embed] })
                        channel.send(`Channel đã được set thành "**${type1}**"`)
                        data.save()
                    }
                })
            }
            if (type === 'warn') {
                setchannel.findOneAndUpdate({ guildid: message.guild.id }, { $set: { warn: channel } }, async (err, data) => {
                    if (err) throw err;
                    if (!data) {
                        message.channel.send(`Không tìm thấy data.\nVui lòng dùng lệnh "*channel*" để tạo data.`)
                    }
                    if (data) {
                        const embed = new MessageEmbed()
                            .setAuthor({ name: `${client.user.tag}`, iconURL: client.user.displayAvatarURL() })
                            .setTitle('Đã set channel thành công')
                            .setColor('RANDOM')
                            .addFields({
                                name: 'Tên channel',
                                value: `${channel}`
                            },
                                {
                                    name: 'ID của channel',
                                    value: `${channel.id}`
                                },
                                {
                                    name: 'Thể loại',
                                    value: `${type1}`
                                })
                        message.channel.send({ embeds: [embed] })
                        channel.send(`Channel đã được set thành "**${type1}**"`)
                        data.save()
                    }
                })
            }
            if (type === 'welcome') {
                setchannel.findOneAndUpdate({ guildid: message.guild.id }, { $set: { welcome: channel } }, async (err, data) => {
                    if (err) throw err;
                    if (!data) {
                        message.channel.send(`Không tìm thấy data.\nVui lòng dùng lệnh "*channel*" để tạo data.`)
                    }
                    if (data) {
                        const embed = new MessageEmbed()
                            .setAuthor({ name: `${client.user.tag}`, iconURL: client.user.displayAvatarURL() })
                            .setTitle('Đã set channel thành công')
                            .setColor('RANDOM')
                            .addFields({
                                name: 'Tên channel',
                                value: `${channel}`
                            },
                                {
                                    name: 'ID của channel',
                                    value: `${channel.id}`
                                },
                                {
                                    name: 'Thể loại',
                                    value: `${type1}`
                                })
                        message.channel.send({ embeds: [embed] })
                        channel.send(`Channel đã được set thành "**${type1}**"`)
                        data.save()
                    }
                })
            }
            if (type === 'goodbye') {
                setchannel.findOneAndUpdate({ guildid: message.guild.id }, { $set: { goodbye: channel } }, async (err, data) => {
                    if (err) throw err;
                    if (!data) {
                        message.channel.send(`Không tìm thấy data.\nVui lòng dùng lệnh "*channel*" để tạo data.`)
                    }
                    if (data) {
                        const embed = new MessageEmbed()
                            .setAuthor({ name: `${client.user.tag}`, iconURL: client.user.displayAvatarURL() })
                            .setTitle('Đã set channel thành công')
                            .setColor('RANDOM')
                            .addFields({
                                name: 'Tên channel',
                                value: `${channel}`
                            },
                                {
                                    name: 'ID của channel',
                                    value: `${channel.id}`
                                },
                                {
                                    name: 'Thể loại',
                                    value: `${type1}`
                                })
                        message.channel.send({ embeds: [embed] })
                        channel.send(`Channel đã được set thành "**${type1}**"`)
                        data.save()
                    }
                })
            }
            if (type === 'livechat') {
                setchannel.findOneAndUpdate({ guildid: message.guild.id }, { $set: { livechat: channel } }, async (err, data) => {
                    if (err) throw err;
                    if (!data) {
                        message.channel.send(`Không tìm thấy data.\nVui lòng dùng lệnh "*channel*" để tạo data.`)
                    }
                    if (data) {
                        const embed = new MessageEmbed()
                            .setAuthor({ name: `${client.user.tag}`, iconURL: client.user.displayAvatarURL() })
                            .setTitle('Đã set channel thành công')
                            .setColor('RANDOM')
                            .addFields({
                                name: 'Tên channel',
                                value: `${channel}`
                            },
                                {
                                    name: 'ID của channel',
                                    value: `${channel.id}`
                                },
                                {
                                    name: 'Thể loại',
                                    value: `${type1}`
                                })
                        message.channel.send({ embeds: [embed] })
                        channel.send(`Channel đã được set thành "**${type1}**"`)
                        data.save()
                    }
                })
            }
            if (type === 'submit') {
                setchannel.findOneAndUpdate({ guildid: message.guild.id }, { $set: { submit: channel } }, async (err, data) => {
                    if (err) throw err;
                    if (!data) {
                        message.channel.send(`Không tìm thấy data.\nVui lòng dùng lệnh "*channel*" để tạo data.`)
                    }
                    if (data) {
                        const row = new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                    .setCustomId('create-submit')
                                    .setLabel('📨 Tạo submit')
                                    .setStyle('PRIMARY')
                                    .setDisabled(false)
                            )
                        channel.send({
                            content: 'Vui lòng nhấn vào nút `Tạo submit` phía dưới để bắt đầu.\nKhông được spam dưới bất kì hình thức nào !',
                            components: [row]
                        })
                        message.channel.send(`Channel đã được set thành "**${type1}**"`)
                        data.save()
                    }
                })
            }
            if (type === 'submitshow') {
                setchannel.findOneAndUpdate({ guildid: message.guild.id }, { $set: { submitshow: channel } }, async (err, data) => {
                    if (err) throw err;
                    if (!data) {
                        message.channel.send(`Không tìm thấy data.\nVui lòng dùng lệnh "*channel*" để tạo data.`)
                    }
                    if (data) {
                        const embed = new MessageEmbed()
                            .setAuthor({ name: `${client.user.tag}`, iconURL: client.user.displayAvatarURL() })
                            .setTitle('Đã set channel thành công')
                            .setColor('RANDOM')
                            .addFields({
                                name: 'Tên channel',
                                value: `${channel}`
                            },
                                {
                                    name: 'ID của channel',
                                    value: `${channel.id}`
                                },
                                {
                                    name: 'Thể loại',
                                    value: `${type1}`
                                })
                        message.channel.send({ embeds: [embed] })
                        channel.send(`Channel đã được set thành "**${type1}**"`)
                        data.save()
                    }
                })
            }
            if (type === 'submitnoti') {
                setchannel.findOneAndUpdate({ guildid: message.guild.id }, { $set: { submitnoti: channel } }, async (err, data) => {
                    if (err) throw err;
                    if (!data) {
                        message.channel.send(`Không tìm thấy data.\nVui lòng dùng lệnh "*channel*" để tạo data.`)
                    }
                    if (data) {
                        const embed = new MessageEmbed()
                            .setAuthor({ name: `${client.user.tag}`, iconURL: client.user.displayAvatarURL() })
                            .setTitle('Đã set channel thành công')
                            .setColor('RANDOM')
                            .addFields({
                                name: 'Tên channel',
                                value: `${channel}`
                            },
                                {
                                    name: 'ID của channel',
                                    value: `${channel.id}`
                                },
                                {
                                    name: 'Thể loại',
                                    value: `${type1}`
                                })
                        message.channel.send({ embeds: [embed] })
                        channel.send(`Channel đã được set thành "**${type1}**"`)
                        data.save()
                    }
                })
            }
        }
    }
}