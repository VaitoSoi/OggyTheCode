const { CommandInteraction, MessageEmbed, MessageActionRow, MessageButton, TextChannel, Webhook } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

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
            console.log(data)
            if (data.config) {
                interaction.editReply('🟡 | Data `CONFIG` đã có sẵn!')
            } else {
                interaction.editReply('⏳ | Đang tạo data!')
                await require('../util/delay')(1000)
                let data1 = new db({
                    guildid: interaction.guildId,
                    guildname: interaction.guild.name,
                    config: {
                        'channels': {
                            'livechat': ''
                        },
                        'prefix': '',
                        'disable': []
                    }
                })
                await data1.save()
                interaction.editReply('✅ | Đã tạo data `CONFIG`!')
            }
        } else if (action === 'set') {
            if (!id) return interaction.editReply('🛑 | Vui lòng chọn `ID` cho `ACTION` này!')
            else if (id === 'channels') {
                interaction.editReply('🔽 | Vui lòng ghi ID hoặc tag channel muốn cài !')
                let now = 'channel'
                const messageCollector = interaction.channel.createMessageCollector()
                messageCollector.on('collect', async (msg) => {
                    if (now !== 'channel') return
                    now = ''
                    if (msg.author.id !== interaction.user.id) return
                    let channel
                    if (isNaN(msg.content.split(' ')[0])) channel = msg.mentions.channels.first()
                    else channel = interaction.guild.channels.cache.get(msg.content.split(' ')[0])
                    if (msg.deletable) msg.delete()
                    if (!channel) return msg.channel.send('🛑 | Không tìm thấy channel!')
                    if (channel.isText()) {
                        try {
                            await db.findOneAndUpdate({ guildid: msg.guildId }, { $set: { 'config.channels.livechat': channel.id } })
                            msg.channel.send('✅ | Đã lưu `DATA`')
                            channel.send(`✅ | Channel đã chỉnh thành \`${'livechat'.toUpperCase()}\``)
                        } catch (e) {
                            msg.channel.send('🛑 | Phát hiện lỗi khi lưu `DATA`')
                            msg.channel.send('```' + e + '```')
                        }
                    } else return msg.channel.send(`🛑 | <#${channel.id}> không phải channel văn bản.\n▶ | Vui lòng tag hoặc ghi ID của 1 channel văn bản!`)

                    if (data.config['livechat-message'].split('').slice(0, 7).join('').toLowerCase() === 'webhook') {
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
                    if (msg.content.split('').includes('ㅤ')) return msg.reply('🛑 | Prefix không thể chứa 1 kí tự tàn hình!')
                    await db.findOneAndUpdate({ guildid: msg.guildId }, { $set: { 'config.prefix': msg.content.trim() } })
                    msg.reply('✅ | Đã chỉnh Prefix thành `' + msg.content.trim() + '`')
                })
            }
        }
    }
} 