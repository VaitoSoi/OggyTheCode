const { CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const minecraft = require('minecraft-server-util')
// const wait = require('node:timers/promises').setTimeout

module.exports = {
    data: new SlashCommandBuilder()
        .setName('config')
        .setDescription('Xem/Tạo/Chỉnh sửa các config cho Guild')
        /*
        .addStringOption(option => option
            .setName('action')
            .setDescription('Hành động Xem/Tạo/Chỉnh sửa')
            .setRequired(true)
            .addChoice('Show', 'show')
            .addChoice('Create', 'create')
            .addChoice('Set', 'set')
            .addChoice('Delete', 'delete')
        )
        .addStringOption(option => option
            .setName('id')
            .setDescription('ID của config')
            .addChoice('Channels', 'channels')
            .addChoice('Disable/Enable', 'disable-enable')
            // .addChoice('Prefix', 'prefix')
            .setRequired(false)
        )
        */
        .addSubcommand(subcommand => subcommand
            .setName('create')
            .setDescription('Tạo một vị trí của server trên CSDL')
        )
        .addSubcommand(subcommand => subcommand
            .setName('show')
            .setDescription('Show những thứ của server này trên CSDL')
        )
        .addSubcommandGroup(group => group
            .setName('set')
            .setDescription('Cài một cái gì gì đó :v')
            .addSubcommand(subcommand => subcommand
                .setName('channel')
                .setDescription('Cài một channel')
                .addStringOption(option => option
                    .setName('type')
                    .setDescription('Loại channel muốn cài')
                    .setRequired(true)
                    .addChoice('LIVECHAT', 'livechat')
                    .addChoice('STATUS', 'status')
                    .addChoice('RESTART', 'restart')
                )
                .addChannelOption(option => option
                    .setName('channel')
                    .setDescription('Channel muốn cài')
                    .setRequired(true)
                )
            )
            .addSubcommand(subcommand => subcommand
                .setName('disable')
                .setDescription('Tắt hoặc mở một câu lệnh')
                .addStringOption(option => option
                    .setName('command')
                    .setDescription('Câu lệnh muốn bật / tắt')
                    .setRequired(true)
                )
                .addStringOption(option => option
                    .setName('action')
                    .setDescription('Hành động tắt hoặc bật')
                    .addChoice('Bật', 'on')
                    .addChoice('Tắt', 'off')
                )
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName('delete')
            .setDescription('Xóa server trên CSDL')
        ),
    /**
    * 
    * @param {CommandInteraction} interaction 
    */
    run: async (interaction) => {
        // return console.log(interaction.options.resolved)
        if (!interaction.member.permissions.has('MANAGE_GUILD')) return interaction.editReply('🛑 | Bạn thiếu quyền `MANAGE_GUILD`')
        let client = interaction.client
            , action = interaction.options.getSubcommandGroup().toLowerCase()
            , id
            , db = await require('../models/option')
            , data = await db.findOne({ guildid: interaction.guildId })
        if (interaction.options.getSubcommand()) id = interaction.options.getSubcommand().toLowerCase()
        else id = null
        if (action === 'show') {
            if (!data) return interaction.editReply('🛑 | Không phát hiện của cho guild này!\n🟢 | Dùng lệnh `/config create` để tạo data!')
            let embed = new MessageEmbed()
                .setTitle('Các cài đặt tại ' + interaction.guild.name)
                .setColor('RANDOM')
                .setAuthor({
                    name: `${client.user.tag}`,
                    iconURL: client.user.displayAvatarURL()
                })
                .setFooter({
                    text: `Yêu cầu: ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL()
                })
                .setTimestamp()
            let num = 0
            Object.keys(data.config).forEach(key => {
                num++
                let value = ''
                if (typeof data.config[key] === 'string' || typeof data.config[key] === 'number') value = data.config[key]
                else if (typeof data.config[key] === 'object')
                    Object.keys(data.config[key]).forEach(k => {
                        if (data.config[key][k] === '') value = `\n${k}: Nothing here :Đ`
                        else value = `\n${k}: ${data.config[key[k]]}`
                    });
                else if (typeof data.config[key] === 'array') {
                    if (data.config[key].length == 0) value = `\nNothing here :Đ`
                    else value = `\n${data.config[key]}`
                }
                // if (value.split(' ').length == 0) value = 'Nothing :Đ'
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
            interaction.editReply({ embeds: [embed] })
        } else if (action === 'create') {
            // console.log(data)
            if (!data) {
                interaction.editReply('⏳ | Đang tạo data!')
                await require('../util/delay')(1000)
                let data1 = new db({
                    guildid: interaction.guildId,
                    guildname: interaction.guild.name,
                    config: {
                        'channels': {
                            'livechat': '',
                            'status': '',
                            'restart': ''
                        },
                        'prefix': '',
                        'disable': [],
                        'message': {
                            'status': '',
                            'restart': ''
                        },
                        'role': {
                            'restart': ''
                        }
                    }
                })
                await data1.save()
                interaction.editReply('✅ | Đã tạo data `CONFIG`!')
            } else interaction.editReply('🟡 | Data `CONFIG` đã có sẵn!')
        } else if (action === 'set') {
            if (!data) return interaction.editReply('🛑 | Không phát hiện data của guild này!\n🟢 | Dùng lệnh `/config create` để tạo data!')
            // if (!id) return interaction.editReply('🛑 | Vui lòng chọn `ID` cho `ACTION` này!')
            if (id === 'channel') {
                let type = interaction.options.getString('type')
                    , set = {}
                    , channel = interaction.options.getChannel('channel')
                if (!channel.isText()) return interaction.editReply('🛑 | Giá trị channel phải là một channel văn bản !')
                if (type === 'livechat') set = {
                    'config.channels.livechat': channel.id
                }
                else if (type === 'status') set = {
                    'config.channels.status': channel.id
                }
                else if (type === 'restart') set = {
                    'config.channels.restart': channel.id
                }
                try {
                    await db.findOneAndUpdate({ guildid: interaction.guildId }, { $set: set })
                    interaction.editReply('✅ | Đã lưu `DATA`')
                    // channel.send(`✅ | Channel đã chỉnh thành \`${type.toUpperCase()}\``)
                    try {
                        await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                            'SEND_MESSAGES': false,
                        },
                            {
                                reason: 'Oggy Set-Channel',
                                type: 0
                            })
                            .then(() => interaction.channel.send(`✅ | Đã khóa kênh <#${channel.id}>`))
                        await channel.permissionOverwrites.edit(client.user, {
                            'SEND_MESSAGES': true,
                            'EMBED_LINKS': true,
                        },
                            {
                                reason: 'Oggy Set-Channel',
                                type: 1
                            })
                            .then(() => interaction.channel.send(`✅ | Đã chỉnh quyền cho bot.`))
                    } catch (error) {
                        if (
                            type === 'livechat'
                        ) interaction.channel.send(`🟡 | Vui lòng khóa kênh <#${channel.id}>.\n▶ | Lý do: Tính năng chat trong để gửi tin nhắn đã bị xóa!`)
                        else if (type === 'status'
                            || type === 'restart'
                        ) interaction.channel.send(`🟡 | Vui lòng khóa kênh <#${channel.id}>.\nLý do: Tránh trôi tin nhắn!`)
                    }
                } catch (e) {
                    interaction.channel.send('🛑 | Phát hiện lỗi khi lưu `DATA`')
                    interaction.channel.send('```' + e + '```')
                }
                /*
                if (data.config['livechat-message'].split('').slice(0, 7).join('').toLowerCase() === 'webhook' && type === 'livechat') {
                    try {
                        let webhooks = await channel.fetchWebhooks()
                            , webhook = webhooks.find(wh => wh.token)
                        if (webhook) return ('🟡 | Hủy tạo `Webhook` vì đã tạo từ trước!')
                        channel.createWebhook('Oggy - Livechat', {
                            avatar: client.user.displayAvatarURL(),
                            reason: 'Livechat'
                        })
                        msg.channel.send('✅ | Đã tạo Webhook tại <#' + channel.id + '>')
                    } catch (e) {
                        msg.channel.send('🛑 | Gặp lỗi trong quá trình tạo Webhook.\n▶ | Lỗi: `' + e + '`')
                    }
                } else {
                    msg.channel.send('🟡 | Hủy tạo `Webhook` do cài đặt cách gửi tin nhắn không phải là `Webhook`!')
                }
                */
                if (type === 'status') {
                    const embed = new MessageEmbed()
                        .setTitle('Minecraft Sever Info')
                        .setFooter({ text: `Cập nhật lần cuối vào lúc `, iconURL: `${interaction.guild.iconURL()}` })
                        .setTimestamp()
                        , now = Date.now()
                    await minecraft.status('2y2c.org', 25565).then((response) => {
                        let sample
                        if (!response.players.sample || response.players.sample.length == 0) sample = 'null'
                        else if (response.players.sample && response.players.sample.length != 0) sample = response.players.sample
                        embed
                            .setColor('RANDOM')
                            .addFields({
                                name: 'Status',
                                value: '🟢 Online',
                                inline: true
                            },
                                {
                                    name: 'IP',
                                    value: `${response.srvRecord.host}`,
                                    inline: true
                                },
                                {
                                    name: 'Port',
                                    value: `${response.srvRecord.port}`,
                                    inline: true
                                },
                                {
                                    name: 'MOTD',
                                    value: `${response.motd.clean}`,
                                    inline: true
                                },
                                {
                                    name: 'Sample player',
                                    value: `${sample}`,
                                    inline: true
                                },
                                {
                                    name: 'Ping',
                                    value: `${Date.now() - now}ms`,
                                    inline: true
                                },
                                {
                                    name: 'Online Player',
                                    value: `${response.players.online}/${response.players.max}`,
                                    inline: true
                                },
                                {
                                    name: 'Version',
                                    value: `${response.version.name.replace("§1", "")}`,
                                    inline: true
                                })
                            .setThumbnail(`https://eu.mc-api.net/v3/server/favicon/${response.srvRecord.host}`)
                            .setColor('GREEN')
                    })
                        .catch((error) => {
                            embed
                                .setColor('RED')
                                .setThumbnail('https://cdn.discordapp.com/attachments/936994104884224020/956369715192795246/2Q.png')
                                .addFields({
                                    name: 'Status',
                                    value: '🔴 Offline',
                                    inline: false
                                },
                                    {
                                        name: 'Error',
                                        value: '```' + error + '```',
                                        inline: false
                                    })
                        })
                    channel.send({ embeds: [embed] }).then(async (msg) => {
                        msg.react('🔁')
                        await db.findOneAndUpdate({ guildid: msg.guildId }, {
                            $set: {
                                'config.message.status': msg.id
                            }
                        })
                    })
                } else if (type === 'restart') {
                    await interaction.channel.send('Vui lòng react để:\n> 🟢: Lấy một role có sẵn.\n> 🆕: Tạo role mới.').then(async (msg) => {
                        await msg.react('🟢')
                        await msg.react('🆕')
                        msg.createReactionCollector({
                            time: 5 * 60 * 1000
                        }).on('collect', async (reaction, user) => {
                            if (user.id === interaction.user.id) {
                                reaction.message.delete()
                                if (reaction.emoji.name === '🟢') {
                                    reaction.message.channel.send('🔽 | Vui lòng ghi ID hoặc tag role bạn muốn cài.')
                                    reaction.message.channel.createMessageCollector({
                                        time: 5 * 60 * 1000
                                    }).on('collect', async (m) => {
                                        if (m.author.id !== interaction.user.id) return
                                        var role
                                        if (isNaN(m.content)) role = await m.mentions.roles.first()
                                        else role = await reaction.message.guild.roles.cache.get(m.content)
                                        if (!role) return m.reply('Role không hợp lệ!').then(() => { return collect() })
                                        else {
                                            m.react('👌')
                                            await db.findOneAndUpdate({ guildid: interaction.guildId }, {
                                                $set: {
                                                    'config.role.restart': role.id
                                                }
                                            })
                                            channel.send(
                                                `React 📢 để nhận role ${role}\n`
                                                + `Bot sẽ ping role trên khi server restart`
                                            ).then(async (m) => {
                                                await m.react('📢')
                                                await db.findOneAndUpdate({ guildid: interaction.guildId }, {
                                                    $set: {
                                                        'config.message.restart': m.id
                                                    }
                                                })
                                            })
                                        }
                                    })
                                } else if (reaction.emoji.name === '🆕') {
                                    msg.channel.send('⏳ | Đang tạo role...').then(async (m) => {
                                        await m.guild.roles.create({
                                            name: 'restart-notification',
                                            reason: 'Tạo role thông báo restart',
                                        }).then(async (role) => {
                                            await db.findOneAndUpdate({ guildid: interaction.guildId }, {
                                                $set: {
                                                    'config.role.restart': role.id
                                                }
                                            })
                                            m.edit(
                                                `✅ | Đã tạo role thành công.\n`
                                                + `Thông tin về role vừa tạo:\n`
                                                + `> Tên: ${role.name}\n`
                                                + `> ID: ${role.id}\n`
                                                + `> Tag: ${role}`
                                            )
                                            channel.send(
                                                `React 📢 để nhận role ${role}\n`
                                                + `Bot sẽ ping role trên khi server restart`
                                            ).then(async (m) => {
                                                await m.react('📢')
                                                await db.findOneAndUpdate({ guildid: interaction.guildId }, {
                                                    $set: {
                                                        'config.message.restart': m.id
                                                    }
                                                })
                                            })
                                        }).catch(e => m.edit(
                                            `🛑 | Gặp lỗi khi tạo role.\n`
                                            + `Lỗi: \`\`\`${e}\`\`\``
                                        )).then(() => { return collect() })
                                    })
                                }
                            }
                        })
                    })
                }
            } else if (id === 'disable-enable') {
                let type = interaction.options.getString('action')
                    , cmd = interaction.options.getString('command')
                    , getDirectories = () =>
                        require('fs').readdirSync('./commands/', { withFileTypes: true })
                            .filter(dirent => dirent.isDirectory())
                            .map(dirent => dirent.name)
                    , category = getDirectories()
                    , cmds = []
                category.forEach(async (cate) => {
                    readdirSync(`./commands/${cate}/`).filter((file) => file.endsWith('.js')).forEach(file => {
                        cmds.push(file.toLowerCase())
                    })
                })
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
                msg.reply('✅ | Thành công')
            } /* else if (id === 'prefix') {
                interaction.editReply('🔽 | Vui lòng ghi Prefix muốn chuyển thành:')
                let messageCollector = interaction.channel.createMessageCollector({
                    time: 5 * 60 * 1000
                })
                    , collect = false
                messageCollector.on('collect', async (msg) => {
                    if (collect) return
                    collect = true
                    if (msg.deletable) msg.delete()
                    if (msg.content.split('').includes('ㅤ') || msg.content === '') return interaction.editReply('🛑 | Vui lòng điền 1 `Prefix` hợp lệ (không khoảng cách, không kí tự tàng hình)!')
                    await db.findOneAndUpdate({ guildid: msg.guildId }, { $set: { 'config.prefix': msg.content.trim() } })
                    interaction.editReply('✅ | Đã chỉnh Prefix thành `' + msg.content + '`')
                })
            } */
        } else if (action === 'delete') {
            if (!data) return interaction.editReply('🛑 | Không phát hiện data của guild này!\n🟢 | Dùng lệnh `/config create` để tạo data!')
            db.findByIdAndDelete({
                guildid: interaction.guildId
            }).then(() => {
                interaction.editReply('✅ | Đã xóa data!')
            })
        }
    }
} 