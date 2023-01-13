const { CommandInteraction, MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const { PermissionFlagsBits, ChannelType } = require('discord-api-types/v10')
const util = require('minecraft-server-util')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('config')
        .setDescription('Cài đặt bot')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addSubcommand(subcommand => subcommand
            .setName('create')
            .setDescription('Tạo cài đặt mới')
        )
        .addSubcommandGroup(scg => scg
            .setName('set')
            .setDescription('Chỉnh cài đặt của bot')
            .addSubcommand(sc => sc
                .setName('channel')
                .setDescription('Cài đặt một channel')
                .addStringOption(o => o
                    .setName('type')
                    .setDescription('Loại channel muốn cài')
                    .addChoices(
                        {
                            name: 'livechat',
                            value: 'livechat'
                        },
                        {
                            name: 'restart',
                            value: 'restart'
                        },
                        {
                            name: 'status',
                            value: 'status'
                        }
                    )
                    .setRequired(true)
                )
                .addChannelOption(o => o
                    .setName('channel')
                    .setDescription('Channel muốn cài')
                    .addChannelTypes(ChannelType.GuildText)
                    .setRequired(true)
                )
                .addStringOption(o => o
                    .setName('message_or_role')
                    .setDescription('Thêm phần lấy role hoặc nhắn tin nhắn')
                    .addChoices(
                        {
                            name: 'có',
                            value: 'yes'
                        },
                        {
                            name: 'không',
                            value: 'no'
                        }
                    )
                )
                .addStringOption(o => o
                    .setName('lock_channel')
                    .setDescription('Khóa kênh')
                    .addChoices(
                        {
                            name: 'có',
                            value: 'yes'
                        },
                        {
                            name: 'không',
                            value: 'no'
                        }
                    )
                )
            )
            .addSubcommand(sc => sc
                .setName('role')
                .setDescription('Cài đặt một role')
                .addStringOption(o => o
                    .setName('type')
                    .setDescription('Loại role muốn cài')
                    .addChoices(
                        {
                            name: 'restart',
                            value: 'restart'
                        }
                    )
                    .setRequired(true)
                )
                .addRoleOption(o => o
                    .setName('role')
                    .setDescription('Role muốn cài')
                    .setRequired(true)
                )
            )
            .addSubcommand(sc => sc
                .setName('message')
                .setDescription('Cài đặt một tin nhắn')
                .addStringOption(o => o
                    .setName('type')
                    .setDescription('Loại tin nhắn muốn cài')
                    .addChoices(
                        {
                            name: 'restart',
                            value: 'restart'
                        },
                        {
                            name: 'status',
                            value: 'status'
                        }
                    )
                    .setRequired(true)
                )
                .addStringOption(o => o
                    .setName('id')
                    .setDescription('ID của tin nhắn muốn cài')
                    .setRequired(true)
                )
            )
            .addSubcommand(sc => sc
                .setName('feature')
                .setDescription('Bật tắt tính năng của bot')
                .addStringOption(o => o
                    .setName('name')
                    .setDescription('Tên tính năng (đối với livechat_type: on là embed, off là message)')
                    .addChoices(
                        {
                            name: 'livechat_type',
                            value: 'livechat_type'
                        },
                        {
                            name: 'join_leave',
                            value: 'join_leave'
                        },
                        {
                            name: 'timestamp',
                            value: 'timestamp'
                        }
                    )
                    .setRequired(true)
                )
                .addStringOption(o => o
                    .setName('type')
                    .setDescription('Bật hoặc tắt')
                    .addChoices(
                        {
                            name: 'on_or_embed',
                            value: 'on'
                        },
                        {
                            name: 'off_or_message',
                            value: 'off'
                        }
                    )
                    .setRequired(true)
                )
            )
        )
        .addSubcommand(scg => scg
            .setName('show')
            .setDescription('Hiển thị cài đặt của bot')
        )
        .addSubcommand(scg => scg
            .setName('delete')
            .setDescription('Xóa cài đặt của bot')
        ),
    /**
    * 
    * @param {CommandInteraction} interaction 
    */
    run: async (interaction) => {
        const client = interaction.client
        let id = interaction.options.getSubcommand().toLowerCase()
        let action = null
        if ([
            'create',
            'show',
            'delete'
        ].includes(id)) action = id
        else action = interaction.options.getSubcommandGroup().toLowerCase();
        const db = require('../../../models/option')
        let data = await db.findOne({
            'guildid': interaction.guildId
        })
        if (action == 'create') {
            if (!(await interaction.member.permissions.has('ADMINISTRATOR'))) return interaction.editReply('🔴 Bạn không có quyền `ADMINISTRATOR`')
            if (data)
                return interaction.editReply('🟡 | Đã có cài đặt!')
            else {
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
                interaction.editReply('✅ | Đã tạo cài đặt')
            }
        } else if (action == 'set') {
            if (!(await interaction.member.permissions.has('ADMINISTRATOR'))) return interaction.editReply('🔴 Bạn không có quyền `ADMINISTRATOR`')
            if (!data)
                return interaction.editReply('🔴 | Không có dữ liệu về cài đặt của bot.\n' +
                    '🟡 | Dùng lệnh `/config create` để tạo cài đặt')
            if (id === 'channel') {
                let type = interaction.options.getString('type')
                let channel = interaction.options.getChannel('channel')
                let message_role = interaction.options.getString('message_role') == 'yes' ? true : false
                let lock_channel = interaction.options.getString('lock_channel') == 'yes' ? true : false
                if (!channel.isText()) return
                if (!interaction.guild.me.permissionsIn(channel).has('SEND_MESSAGES'))
                    return interaction.editReply(`🛑 | Bot thiếu quyền \`SEND_MESSAGES\` trong kênh ${channel}`)
                if (type === 'livechat') data.config.channels.livechat = channel.id
                else if (type === 'restart') data.config.channels.restart = channel.id
                else if (type === 'status') data.config.channels.status = channel.id
                await data.save()
                interaction.editReply(`✅ | Đã chỉnh config thành công`)
                if ((type == 'status' || type == 'restart') && lock_channel == true) {
                    if (interaction.guild.me.permissions.has('MANAGE_CHANNELS')
                        && interaction.guild.me.permissionsIn(channel).has('MANAGE_CHANNELS')) {
                        channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                            'SEND_MESSAGES': false,
                        }, {
                            reason: 'Oggy set-channel',
                            type: 0
                        })
                        interaction.channel.send('✅ | Đã chỉnh role cho `@everyone`').then((msg) => setTimeout(() => {
                            msg.delete()
                        }, 10 * 1000))
                        channel.permissionOverwrites.edit(interaction.guild.me, {
                            'SEND_MESSAGES': true,
                            'EMBED_LINKS': true
                        }, {
                            reason: 'Oggy set-channel',
                            type: 1
                        })
                        interaction.channel.send('✅ | Đã chỉnh role cho bot').then((msg) => setTimeout(() => {
                            msg.delete()
                        }, 10 * 1000))
                    } else interaction.channel.send(`🔴 | Không thể khóa kênh ${channel}!`)
                }
                if (message_role == false) return
                else if (type == 'status') {
                    const embed = new MessageEmbed()
                        .setAuthor({
                            name: `${client.user.tag} Server Utils`,
                            iconURL: client.user.displayAvatarURL()
                        })
                        .setTitle(`\`${process.env.MC_HOST.toUpperCase()}\` Status`)
                        .setFooter({
                            text: `${interaction.user.tag}`,
                            iconURL: interaction.user.displayAvatarURL()
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
                    channel.send({ embeds: [embed] }).then(async m => {
                        m.react('🔁')
                        data.config.messages.status = m.id
                        await data.save()
                    })
                } else if (type == 'restart') {
                    let send = (role) => {
                        if (!interaction.guild.me.permissions.has('MANAGE_ROLES')) return
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
                    let m = await interaction.channel.send(
                        'Vui lòng chọn 1 trong 2 lựa chọn sau:\n' +
                        '🟢 | Lấy một role restart có sẵn.\n' +
                        `${interaction.guild.me.permissions.has('MANAGE_ROLES')
                            ? '🆕 | Tạo một role restart mới' : ''}`
                    )
                    m.react('🟢')
                    if (interaction.guild.me.permissions.has('MANAGE_ROLES')) m.react('🆕')
                    let m_reaction_collector = m.createReactionCollector({
                        time: 5 * 60 * 1000,
                        filter: (react, user) => user.id == interaction.user.id
                    })
                    m_reaction_collector.on('collect', async (react, user) => {
                        m.delete()
                        if (react.emoji.name == '🆕') {
                            if (!interaction.guild.me.permissions.has('MANAGE_ROLES'))
                                return interaction.channel.send('🛑 | Bot thiếu quyền `MANAGE_ROLES` (Quản lý vai trò) nên không thể tạo role!')
                            let role = await interaction.guild.roles.create({
                                name: 'restart-notification',
                                reason: 'Oggy restart reaction-role',
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
                            let msg = await interaction.channel.send('👇 | Vui lòng ghi ID hoặc mention role.')
                            let interaction_message_collector = interaction.channel.createMessageCollector({
                                time: 5 * 60 * 1000,
                                filter: (m) => m.author.id == interaction.user.id
                            }).on('collect', async (m) => {
                                let role = null
                                if (isNaN(m.content)) role = m.mentions.roles.first()
                                else role = interaction.guild.roles.cache.get(m.content)
                                m.delete()
                                if (!role)
                                    return m.channel.send('🔴 | Không tìm thấy role!')
                                        .then(msg => setTimeout(() => msg.delete(), 20 * 1000))
                                msg.delete()
                                data.config.roles.restart = role.id
                                await data.save()
                                interaction.channel.send('✅ | Đã lưu role!')
                                m_reaction_collector.stop()
                                interaction_message_collector.stop()
                                send(role)
                            })
                        }
                    })
                }
            } else if (id == 'role') {
                let type = interaction.options.getString('type')
                let role = interaction.options.getRole('role')
                data.config.roles[type] = role.id
                await data.save()
                interaction.editReply('✅ | Đã chỉnh role thành công')
            } else if (id == 'message') {
                let type = interaction.options.getString('type')
                let id = interaction.options.getString('id')
                let channel = interaction.guild.channels.cache.get(data.config.channels[type])
                if (!channel || !channel.isText()) return interaction.editReply(`🛑 | Không thể tìm thấy channel \`${type}\``)
                let msg = await channel.messages.fetch(id).catch(e =>
                    void interaction.editReply(`🛑 | Không thể tìm thấy tin nhắn với id \`${id}\``))
                if (!msg) return
                data.config.messages[type] = msg.id
                await data.save().catch(e => {
                    interaction.editReply(
                        '❌ | Không thể chỉnh sửa data\n'+
                        '🛑 | Lỗi: \n' +
                        '```' + e + '```'
                    )
                })
                let embed = []
                embed.push(new MessageEmbed()
                    .setTitle('Đi tới tin nhắn mới')
                    .setURL(msg.url))
                if (msg.content && msg.content != '') embed.push(new MessageEmbed()
                    .setTitle(msg.content)
                    .setAuthor({
                        name: `${msg.author.tag}`,
                        iconURL: msg.author.displayAvatarURL()
                    }))
                embed.push(...msg.embeds)
                interaction.editReply({
                    content: '✅ | Đã chỉnh tin nhắn thành công',
                    embeds: embed
                })
            } else if (id == 'feature') {
                let type = interaction.options.getString('type')
                data.config.feature[id == 'livechat_type' ? 'chatType' : id] =
                    type == 'livechat_type'
                        ? type == 'on'
                            ? 'embed' : 'message'
                        : type
                await data.save()
                interaction.editReply('✅ | Đã chỉnh chế độ hiển thị thành công')
            }
        } else if (action == 'show') {
            if (!data)
                return interaction.editReply('🔴 | Không có dữ liệu về cài đặt của bot.\n' +
                    '🟡 | Dùng lệnh `/config create` để tạo cài đặt')
            const embed = new MessageEmbed()
                .setAuthor({
                    name: `Config Menu`,
                    iconURL: `https://discord.com/assets/a6d05968d7706183143518d96c9f066e.svg`
                })
                .setTitle(`${interaction.guild.name} Config`)
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
            interaction.editReply({
                embeds: [embed]
            })
        } else if (action == 'delete') {
            await db.findOneAndDelete({
                'guildid': interaction.guildId
            })
            interaction.editReply('🟢 | Đã xóa thành công.')
        }
    }
} 