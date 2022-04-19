const { Client, Message, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')

module.exports = { 
    name: 'config',
    description: 'Dùng để chỉnh các cài đặt về Guild trên CSDL',
    usage: '<Action[Show/Set/Create]> <ID[Livechat-Message/Disable-Enable/Channels/Roles]>',
    /**
    * 
    * @param {Client} client 
    * @param {Message} message 
    * @param {String[]} args 
    */ 
    run: async(client, message, args) => {
        let action = message.content.split(' ')[1].toLowerCase()
            , id = message.content.split(' ')[2]
            , db = require('../models/option')
            , data = await db.findOne({ guildid: message.guildId })
        if (action === 'show') {
            if (!data) return message.reply('🛑 | Không thấy `DATA`\n🆕 | Vui lòng dùng lệnh `config create`')
            if (!id) {
                let embed = new MessageEmbed()
                    .setTitle('Các cài đặt tại ' + message.guild.name)
                    .setColor('RANDOM')
                    .setAuthor({
                        name: `${client.user.tag}`,
                        iconURL: client.user.displayAvatarURL()
                    })
                    .setFooter({
                        text: `Yêu cầu: ${message.author.tag}`,
                        iconURL: message.author.displayAvatarURL()
                    })
                    .setTimestamp()
                let num = 0
                Object.keys(data.config).forEach(key => {
                    num++
                    let value = ''
                    if (typeof data.config[key] === 'string') value = data.config[key]
                    else if (typeof data.config[key] === 'object')
                        Object.keys(data.config[key]).forEach(k => {
                            value = value + '\n' + k + ': ' + data.config[key][k]
                        });
                    else if (typeof data.config[key] === 'array') value = data.config[key].join('\n')
                    if (value.split(' ').length == 0) value = 'Nothing :Đ'
                    if (num == 3) {
                        embed.addFields({
                            name: '\u200b',
                            value: '\u200b',
                            inline: true
                        },
                            {
                                name: `${key.toUpperCase()}`,
                                value: '```' + value + ' ```',
                                inline: true
                            })
                    } else {
                        embed.addFields({
                            name: `${key.toUpperCase()}`,
                            value: '```' + value + ' ```',
                            inline: true
                        })
                    }
                })
            } else if (id === 'channels') {
                let embed = new MessageEmbed()
                    .setTitle('Các cài đặt về CHANNELS')
                    .setColor('RANDOM')
                    .setAuthor({
                        name: `${client.user.tag}`,
                        iconURL: client.user.displayAvatarURL()
                    })
                    .setFooter({
                        text: `Yêu cầu: ${message.author.tag}`,
                        iconURL: message.author.displayAvatarURL()
                    })
                    .setTimestamp()
                Object.keys(data.config.channels).forEach((k) => {
                    let id = ''
                        , channel = ''
                        , config = require('../info/channeldes.json')
                        , des = config[k]
                    if (!message.guild.channels.cache.get(data.config.channels[k])) {
                        id = 'No data'
                        channel = 'No data'
                    } else {
                        id = message.guild.channels.cache.get(data.config.channels[k]).id
                        channel = `<#${id}>`
                    }
                    embed.addFields({
                        name: `${k.split('')[0].toUpperCase()}${k.split('').slice(1).join('').toLowerCase()}`,
                        value: `> Channel: ${channel}\n> ID: ${id}\n> Mô tả: ${des}`,
                        inline: true
                    })
                })
                message.reply({ embeds: [embed] })
            } else if (id === 'roles') {
                let embed = new MessageEmbed()
                    .setTitle('Các cài đặt về ROLES')
                    .setColor('RANDOM')
                    .setAuthor({
                        name: `${client.user.tag}`,
                        iconURL: client.user.displayAvatarURL()
                    })
                    .setFooter({
                        text: `Yêu cầu: ${message.author.tag}`,
                        iconURL: message.author.displayAvatarURL()
                    })
                    .setTimestamp()
                Object.keys(data.config.roles).forEach((k) => {
                    let id = ''
                        , role = ''
                        , config = require('../info/roledes.json')
                        , des = config[k]
                    if (!message.guild.roles.cache.get(data.config.roles[k])) {
                        id = 'No data'
                        role = 'No data'
                    } else {
                        id = message.guild.roles.cache.get(data.config.roles[k]).id
                        role = `<#${id}>`
                    }
                    embed.addFields({
                        name: `${k.split('')[0].toUpperCase()}${k.split('').slice(1).join('').toLowerCase()}`,
                        value: `> Role: ${role}\n> ID: ${id}\n> Mô tả: ${des}`,
                        inline: true
                    })
                })
                message.reply({ embeds: [embed] })
            } else if (id === 'disable-enable') {
                let embed = new MessageEmbed()
                    .setTitle('Các lệnh chưa bị tắt và đã bị tắt')
                    .setColor('RANDOM')
                    .setAuthor({
                        name: `${client.user.tag}`,
                        iconURL: client.user.displayAvatarURL()
                    })
                    .setFooter({
                        text: `Yêu cầu: ${message.author.tag}`,
                        iconURL: message.author.displayAvatarURL()
                    })
                    .setTimestamp()
                const { readdirSync } = require('fs')

                const getDirectories = () =>
                    readdirSync('./commands/', { withFileTypes: true })
                        .filter(dirent => dirent.isDirectory())
                        .map(dirent => dirent.name)
                let disable = []
                    , enable = []
                    , category = getDirectories()
                category.forEach(async (cate) => {
                    let cmds = readdirSync(`./commands/${cate}/`).filter((file) => file.endsWith('.js'))
                    cmds.forEach((cmd) => {
                        if (data.config['disable-enable'].includes(cmd)) disable.push(cmd)
                        else enable.push(cmd)
                    })
                })
                let enabletext = ''
                    , disabletext = ''
                if (disable.length == 0) { enabletext = 'Toàn bộ lệnh đang bật'; disabletext = 'Nothing :Đ' }
                else if (enable.length > 18) enabletext = enable.slice(0, 18).join('\n') + `'\nVà hơn ${enable.length - 18} lệnh...`
                if (disable.length > 18) disabletext = disable.slice(0, 18).join('\n') + `'\nVà hơn ${disable.length - 18} lệnh...`
                embed.addFields({
                    name: 'ENABLE',
                    value: 'Là các lệnh đang bật.\n```' + enabletext + ' ```',
                    inline: true
                },
                    {
                        name: 'DISABLE',
                        value: 'Là các lệnh đã tắt.\n```' + disabletext + ' ```',
                        inline: true
                    })
                message.reply({ embeds: [embed] })
            } else if (id === 'livechat-message') {
                message.reply(`▶ | Cài đặt của \`${('livechat-message').toUpperCase()}\` là ${data.config['livechat-message'].toUpperCase()}`)
            }
        } else if (action === 'create') {
            if (message.options.getString('id')) message.channel.send('`ID` chỉ phù hợp khi `ACTION` là `Set`')
            if (data) return message.reply('🟡 | Data đã có sẵn')
            message.reply('⏳ | Đang tạo `DATA_CONFIG`')
            require('../../util/delay')(1000)
            data1 = new db({
                guildid: message.guildId,
                guildname: message.guild.name,
                config: {
                    'livechat-message': 'client-embed',
                    'disable-enable': [],
                    channels: {
                        mute: 'No data',
                        ban: 'No data',
                        kick: 'No data',
                        warn: 'No data',
                        welcome: 'No data',
                        goodbye: 'No data',
                        livechat: 'No data',
                    },
                    roles: {
                        restart: 'No data',
                        mute: 'No data',
                    }
                }
            })
            await data1.save()
            message.reply('✅ | Đã tạo `DATA_CONFIG`')
        } else if (action === 'set') {
            if (id === 'channels') {
                if (!message.member.permissions.has('MANAGE_CHANNELS')) return
                let channel
                let type = ''
                const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('warn')
                            .setLabel('Warn')
                            .setDisabled(false)
                            .setStyle('PRIMARY')
                    )
                    .addComponents(
                        new MessageButton()
                            .setCustomId('mute')
                            .setLabel('Mute')
                            .setDisabled(false)
                            .setStyle('PRIMARY')
                    )
                    .addComponents(
                        new MessageButton()
                            .setCustomId('kick')
                            .setLabel('Kick')
                            .setDisabled(false)
                            .setStyle('PRIMARY')
                    )
                    .addComponents(
                        new MessageButton()
                            .setCustomId('ban')
                            .setLabel('Ban')
                            .setDisabled(false)
                            .setStyle('PRIMARY')
                    )
                const row1 = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('welcome')
                            .setLabel('Welcome')
                            .setDisabled(false)
                            .setStyle('PRIMARY')
                    )
                    .addComponents(
                        new MessageButton()
                            .setCustomId('goodbye')
                            .setLabel('Goodbye')
                            .setDisabled(false)
                            .setStyle('PRIMARY')
                    )
                    .addComponents(
                        new MessageButton()
                            .setCustomId('livechat')
                            .setLabel('Livechat')
                            .setDisabled(false)
                            .setStyle('PRIMARY')
                    )
                message.reply({
                    content: '🔽 | Vui lòng ghi 1 trong những loại channel phía dưới:\n>>> Mute / Ban / Kick / Warn \nWelcome / Goodbye / Livechat',
                    components: [row, row1]
                })
                const componentCollector = message.channel.createMessageComponentCollector({
                    componentType: 'BUTTON'
                })
                const messageCollector = message.channel.createMessageCollector()
                componentCollector.on('collect', (inter) => {
                    if (inter.user.id !== message.author.id) return
                    type = inter.customId
                    inter.message.edit({
                        content: '🔽 | Vui lòng ghi ID hoặc tag channel muốn cài!',
                        components: []
                    })
                })
                messageCollector.on('collect', async (msg) => {
                    if (msg.author.id !== message.author.id) return
                    if (msg.content.startsWith('<#') && msg.content.endsWith('>')) channel = msg.mentions.channels.first()
                    else channel = message.guild.channels.cache.get(msg.content)
                    if (msg.deletable) msg.delete()
                    if (!channel) return msg.channel.send('🛑 | Không tìm thấy channel!')
                    if (!channel.isText()) return msg.channel.send(`🛑 | <#${channel.id}> không phải channel văn bản.\n▶ | Vui lòng tag hoặc ghi ID của 1 channel văn bản!`)
                    else {
                        data.config.channels[type] = channel.id
                        try {
                            await data.save()
                            msg.channel.send('✅ | Đã lưu `DATA`')
                            channel.send(`✅ | Channel đã chỉnh thành \`${type.toUpperCase()}\``)
                        } catch (e) {
                            msg.channel.send('🛑 | Phát hiện lỗi khi lưu `DATA`')
                            msg.channel.send('```' + e + '```')
                        }
                    }
                    if (channel.fetchWebhooks().find(wh => wh.token)) return
                    if (data.config['livechat-message'].split('').slice(0, 7).join('').toLowerCase() === 'webhook') {
                        try {
                            channel.createWebhook('Oggy - Livechat', {
                                avatar: client.user.displayAvatarURL(),
                                reason: 'Livechat'
                            })
                            inter.channel.send('✅ | Đã tạo Webhook tại <#' + channel.id + '>')
                        } catch (e) {
                            inter.channel.send('🛑 | Gặp lỗi trong quá trình tạo Webhook.\n▶ | Lỗi: `' + e + '`')
                        }
                    }
                })
            } else if (action === 'roles') {
                if (!message.member.permissions.has('MANAGE_ROLES')) return
                let role
                let type = ''
                const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('restart')
                            .setLabel('Restart')
                            .setDisabled(true)
                            .setStyle('DANGER')
                    )
                    .addComponents(
                        new MessageButton()
                            .setCustomId('mute')
                            .setLabel('Mute')
                            .setDisabled(false)
                            .setStyle('PRIMARY')
                    )
                message.reply({
                    content: '🔽 | Vui lòng ghi 1 trong những loại role phía dưới:\n>>> Mute / Restart (chưa thể sử dụng)',
                    components: [row]
                })
                const componentCollector = message.channel.createMessageComponentCollector({
                    componentType: 'BUTTON'
                })
                const messageCollector = message.channel.createMessageCollector()
                componentCollector.on('collect', (inter) => {
                    if (inter.user.id !== message.author.id) return
                    type = inter.customId
                    inter.message.edit({
                        content: '🔽 | Vui lòng ghi ID hoặc tag role muốn cài!',
                        components: []
                    })
                })
                messageCollector.on('collect', (msg) => {
                    if (msg.author.id !== message.author.id) return
                    if (msg.content.startsWith('<@&') && msg.content.endsWith('>')) role = msg.mentions.roles.first()
                    else role = message.guild.roles.cache.get(msg.content)
                    if (msg.deletable) msg.delete()
                    if (!role) return msg.channel.send('🛑 | Không tìm thấy role!')
                    else {
                        data.config.roles[type] = role.id
                        try {
                            data.save()
                            msg.channel.send('✅ | Đã lưu `DATA`')
                        } catch (e) {
                            msg.channel.send('🛑 | Phát hiện lỗi khi lưu `DATA`')
                            msg.channel.send('```' + e + '```')
                        }
                    }
                })
            } else if (id === 'disable-enable') {
                if (!message.member.permissions.has('MANAGE_GUILD')) return
                let type = ''
                    , cmd = []
                    , getDirectories = () =>
                        readdirSync('./commands/', { withFileTypes: true })
                            .filter(dirent => dirent.isDirectory())
                            .map(dirent => dirent.name)
                    , category = getDirectories()
                    , cmds = []
                    , done = []
                    , error = []
                category.forEach(async (cate) => {
                    readdirSync(`./commands/${cate}/`).filter((file) => file.endsWith('.js')).forEach(file => {
                        cmds.push(file.toLowerCase())
                    })
                })
                const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('off')
                            .setLabel('Tắt')
                            .setDisabled(false)
                            .setStyle('PRIMARY')
                    )
                    .addComponents(
                        new MessageButton()
                            .setCustomId('on')
                            .setLabel('Bật')
                            .setDisabled(false)
                            .setStyle('PRIMARY')
                    )
                message.reply({
                    content: '🔽 | Vui lòng chọn chế độ bật hay tắt.',
                    components: [row]
                })
                let componentCollector = message.channel.createMessageComponentCollector({
                    componentType: 'BUTTON'
                })
                let messageCollector = message.channel.createMessageCollector()
                componentCollector.on('collect', (inter) => {
                    let type = inter.customId.toLowerCase()
                    message.reply('✅ | Đã chọn chế độ `' + type.toUpperCase() + '`')
                    require('../../util/delay')(1000)
                    message.reply('🔽 | Vui lòng ghi tên các lệnh muốn tắt/bật.\n✅ | Viết `DONE!` để kết thúc!')
                })
                messageCollector.on('collect', (msg) => {
                    if (msg.author.id !== message.author.id) return
                    if (msg.content.toLowerCase() !== 'done!') {
                        cmd.push(msg.content.toLowerCase())
                    } else {
                        cmd.forEach((cmd) => {
                            if (!cmds.includes(cmd)) return error.push('Không tìm thấy lệnh ' + cmd + '!')
                            else {
                                if (type === 'on') {
                                    let num
                                    data.config['disable-enable'].forEach((d) => {
                                        if (d === cmd) {
                                            data.config['disable-enable'].splice(num, 0)
                                            done.push('Đã bật lệnh ' + cmd + '!')
                                        } else if (num === data.config['disable-enable'].length) error.push('Lệnh ' + cmd + ' không bị tắt!')
                                        num++
                                    })
                                } else if (type === 'off') {
                                    if (data.config['disable-enable'].includes(cmd)) return error.push('Lệnh đã bị tắt trước đó!')
                                    data.config['disable-enable'].push(cmd)
                                    done.push('Đã tắt lệnh ' + cmd + '!')
                                }
                            }
                        })
                        msg.reply('✅ | Thành công: ```' + done.join('\n') + '```\n❌ | Thất bại: ```' + error.join('\n') + '```')
                    }
                })
            } else if (id === 'livechat-message') {
                if (!message.member.permissions.has('MANAGE_MESSAGES')) return
                const row1 = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('client-embed')
                            .setLabel('Client - Embed')
                            .setDisabled(false)
                            .setStyle('PRIMARY')
                            .setEmoji('962690273048162344')
                    )
                    .addComponents(
                        new MessageButton()
                            .setCustomId('client-codeblock')
                            .setLabel('Client - CodeBlock')
                            .setDisabled(false)
                            .setStyle('PRIMARY')
                            .setEmoji('962690273048162344')
                    )
                const row2 = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('webhook-embed')
                            .setLabel('Webhook - Embed')
                            .setDisabled(false)
                            .setStyle('SECONDARY')
                            .setEmoji('962690273228505178')
                    )
                    .addComponents(
                        new MessageButton()
                            .setCustomId('webhook-codeblock')
                            .setLabel('Webhook - CodeBlock')
                            .setDisabled(false)
                            .setStyle('SECONDARY')
                            .setEmoji('962690273228505178')
                    )
                const row3 = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('what')
                            .setLabel('Những cái đó là gì :)?')
                            .setDisabled(false)
                            .setStyle('PRIMARY')
                            .setEmoji('947300772054446101')
                    )
                message.reply({
                    content: '🔽 | Vui lòng chọn 1 trong những lựa chọn phía dưới!',
                    components: [
                        row1,
                        row2,
                        row3
                    ]
                })
                let componentCollector = message.channel.createMessageComponentCollector({
                    componentType: 'BUTTON'
                })
                componentCollector.on('collect', async (inter) => {
                    if (inter.user.id !== message.author.id) return
                    if (inter.customId === 'what') {
                        inter.deferReply()

                        await require('../../util/delay')(2500)
                        await inter.editReply({
                            content: '> Các cách thức gửi tin nhắn:\nLoại 1: `Client`\nLà tin nhắn từ chính User này!\nƯu điểm:\n> Tránh việc bị ban do spam webhook.\n> Hạn chế ping cao, tràn ram\nNhược điểm:\n> Không thẩm mỹ.\n> Không thấy được avatar người gửi.',
                        })
                        try {
                            await inter.channel.createWebhook('Livechat - Webhook', {
                                avatar: client.user.displayAvatarURL(),
                                reason: 'Mẫu Webhook của Livechat'
                            }).then((webhook) => {
                                webhook.send({
                                    content: 'Loại 2: `Webhook`\nLà tin nhắn từ `Webhook` như thế này!\nƯu điểm:\n> Thấy được avatar của người gửi.\n> Thẩm mỹ hơn Client ||(một chút :Đ)||\nNhược điểm:\n> Gây ra tình trạng ping cao, tràn ram.\n> Dễ bị tia bởi các AntiNuke bot (như: YourAuth, MEE6, Wick, Dyno, Carl,...) do spam Webhook'
                                }).then(() => webhook.delete('Hoàn thành việc gửi Mẫu'))
                            })
                        } catch (e) {
                            inter.channel.send('https://cdn.discordapp.com/attachments/936994104884224020/962720653448982528/unknown.png')
                        }
                        await require('../../util/delay')(3000)
                        inter.channel.send({
                            content: '> Các loại tin nhắn:\nCodeBlock:\n```md\n# <OggyTheBot> Đây là một tin nhắn dạng CodeBlock\n```\nƯu điểm:\n> Yêu cầu ít quyền (SEND_MESSAGES)\nNhược điểm:\n> Không thẩm mỹ như Embed\n> Có thể bị Muted/Timeout do nội dung chứa từ ngữ lặp lại',
                            embeds: [
                                new MessageEmbed()
                                    .setColor('BLUE')
                                    .setTitle('<OggyTheBot> Đây là một tin nhắn dạng Embed')
                                    .setDescription('Ưu điểm.\n> Thẩm mỹ hơn.\nKhông bị Mute/Timeout do có nội dung chứa từ ngữ lặp lại.\nNhược điểm:\n> Yêu cầu nhiều quyền.')
                            ]
                        })
                        await require('../../util/delay')(3000)
                        inter.channel.send('🛑 | Lưu ý: Cả hai cách gửi trên đều có 1 nhược điểm rất lớn:\n**DỄ BỊ MUTE/TIMEOUT VÌ SPAM TIN NHẮN**\nNên cẩn thận khi trong server có các bot như **Wick**, MEE6, Dyno, Carl, Your Auth hay các bot AntiNuke hoặc có module AntiNuke.\nTốt nhất thì hãy Whitelist cho <@!' + client.user.id + '> để tránh việc bị Mute hay Timeout.')
                    } else {
                        let custom = inter.customId.toLowerCase()
                        if (custom !== 'client-embed'
                            && custom !== 'client-codeblock'
                            && custom !== 'webhook-embed'
                            && custom !== 'webhook-codeblock') return
                        data.config['livechat-message'] = custom
                        await data.save()
                        inter.reply('✅ | Đã chỉnh thành `' + custom.toUpperCase() + '`')
                        if (!data.config.livechat) return inter.channel.send('🛑 | Không thể Setup Webhook tại Livechat Channel!\n▶ | Lý do: `Không tìm thấy data về Livechat Channel`')
                        try {
                            const channel = inter.guild.channels.cache.get(data.config.livechat)
                            channel.createWebhook('Oggy - Livechat', {
                                avatar: client.user.displayAvatarURL(),
                                reason: 'Livechat'
                            })
                            inter.channel.send('✅ | Đã tạo Webhook tại <#' + channel.id + '>')
                        } catch (e) {
                            inter.channel.send('🛑 | Gặp lỗi trong quá trình tạo Webhook.\n▶ | Lỗi: `' + e + '`')
                        }
                    }
                })
            }
        }
    }
}
