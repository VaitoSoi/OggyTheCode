const { CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const minecraft = require('minecraft-server-util')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('config')
        .setDescription('Xem/Tạo/Chỉnh sửa các config cho Guild')
        .addStringOption(option => option
            .setName('action')
            .setDescription('Hành động Xem/Tạo/Chỉnh sửa')
            .setRequired(true)
            .addChoice('Show', 'show')
            .addChoice('Create', 'create')
            .addChoice('Set', 'set')
        )
        .addStringOption(option => option
            .setName('id')
            .setDescription('ID của config')
            .addChoice('Channels', 'channels')
            .addChoice('Disable/Enable', 'disable-enable')
            .addChoice('Prefix', 'prefix')
            .setRequired(false)
        ),
    /**
    * 
    * @param {CommandInteraction} interaction 
    */
    run: async (interaction) => {
        if (!interaction.member.permissions.has('MANAGE_GUILD')) return interaction.editReply('🛑 | Bạn thiếu quyền `MANAGE_GUILD`')
        let client = interaction.client
            , action = interaction.options.getString('action')
            , id
            , db = await require('../models/option')
            , data = await db.findOne({ guildid: interaction.guildId })
        if (interaction.options.getString('id')) id = interaction.options.getString('id').toLowerCase()
        else id = null
        if (action === 'show') {
            if (!data) return interaction.editReply('🛑 | Không thấy `DATA`\n🆕 | Vui lòng dùng lệnh `/config create`')
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
                        data.config[key][k] = '' ? value = value + '\n' + k + ': ' + data.config[key][k] : value = k + ': Nothing :Đ'
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
            interaction.editReply({ embeds: [embed] })
        } else if (action === 'create') {
            if (!data) {
                interaction.editReply('⏳ | Đang tạo data!')
                await require('../util/delay')(1000)
                let data1 = new db({
                    guildid: interaction.guildId,
                    guildname: interaction.guild.name,
                    config: {
                        'channels': {
                            'livechat': '',
                            'status': ''
                        },
                        'prefix': '',
                        'disable': [],
                        'message': {
                            'status': ''
                        }
                    }
                })
                await data1.save()
                interaction.editReply('✅ | Đã tạo data `CONFIG`!')
            } else {
                interaction.editReply('🟡 | Data `CONFIG` đã có sẵn!')
            }
        } else if (action === 'set') {
            if (!id) return interaction.editReply('🛑 | Vui lòng chọn `ID` cho `ACTION` này!')
            else if (id === 'channels') {
                const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('livechat')
                            .setDisabled(false)
                            .setLabel('LIVECHAT')
                            .setStyle('PRIMARY')
                    )
                    .addComponents(
                        new MessageButton()
                            .setCustomId('status')
                            .setDisabled(false)
                            .setLabel('STATUS')
                            .setStyle('PRIMARY')
                    )
                interaction.editReply({ content: '🔽 | Vui lòng chọn type channel muốn cài !\n1️⃣ | Livechat: Hiển thị tin nhắn trực tiếp từ server `2y2c.org`.\n2️⃣ | Status: Hiển thị trạng thái của server `2y2c.org`.', components: [row] })
                let now = 'channel'
                    , type = ''
                const messageCollector = interaction.channel.createMessageCollector()
                    , interactionCollector = interaction.channel.createMessageComponentCollector({
                        componentType: 'BUTTON'
                    })
                interactionCollector.on('collect', (inter) => {
                    type = inter.customId.toLowerCase()
                    interaction.editReply({ content: '🔽 | Vui lòng ghi ID hoặc Tag channel muốn cài !', components: [] })
                })
                messageCollector.on('collect', async (msg) => {
                    if (msg.author.id !== interaction.user.id) return
                    if (now !== 'channel') return
                    now = ''
                    let set = {}
                    if (msg.author.id !== interaction.user.id) return
                    let channel
                    if (isNaN(msg.content.split(' ')[0])) channel = msg.mentions.channels.first()
                    else channel = interaction.guild.channels.cache.get(msg.content.split(' ')[0])
                    if (msg.deletable) msg.delete()
                    if (!channel) return msg.channel.send('🛑 | Không tìm thấy channel!')
                    if (channel.isText()) {
                        if (type === 'livechat') set = {
                            'config.channels.livechat': channel.id
                        }
                        else if (type === 'status') set = {
                            'config.channels.status': channel.id
                        }
                        try {
                            await db.findOneAndUpdate({ guildid: msg.guildId }, { $set: set })
                            interaction.editReply('✅ | Đã lưu `DATA`')
                            channel.send(`✅ | Channel đã chỉnh thành \`${type.toUpperCase()}\``)
                        } catch (e) {
                            msg.channel.send('🛑 | Phát hiện lỗi khi lưu `DATA`')
                            msg.channel.send('```' + e + '```')
                        }
                    } else return msg.channel.send(`🛑 | <#${channel.id}> không phải channel văn bản.\n▶ | Vui lòng tag hoặc ghi ID của 1 channel văn bản!`)
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
                    }
                })
            } else if (id === 'disable-enable') {
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
                interaction.editReply({
                    content: '🔽 | Vui lòng chọn chế độ bật hay tắt.',
                    components: [row]
                })
                let componentCollector = interaction.channel.createMessageComponentCollector({
                    componentType: 'BUTTON'
                })
                let messageCollector = interaction.channel.createMessageCollector()
                componentCollector.on('collect', (inter) => {
                    let type = inter.customId.toLowerCase()
                    interaction.editReply('✅ | Đã chọn chế độ `' + type.toUpperCase() + '`')
                    require('../util/delay')(1000)
                    interaction.editReply('🔽 | Vui lòng ghi tên các lệnh muốn tắt/bật.\n✅ | Viết `DONE!` để kết thúc!')
                })
                messageCollector.on('collect', (msg) => {
                    if (msg.author.id !== interaction.user.id) return
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
            } else if (id === 'prefix') {
                interaction.editReply('🔽 | Vui lòng ghi Prefix muốn chuyển thành:')
                const messageCollector = interaction.channel.createMessageCollector()
                messageCollector.on('collect', async (msg) => {
                    if (msg.deletable) msg.delete()
                    if (msg.content.split('').includes('ㅤ')) return interaction.editReply('🛑 | Prefix không thể chứa 1 kí tự tàn hình!')
                    await db.findOneAndUpdate({ guildid: msg.guildId }, { $set: { 'config.prefix': msg.content.trim() } })
                    interaction.editReply('✅ | Đã chỉnh Prefix thành `' + msg.content.trim() + '`')
                })
            }
        }
    }
} 