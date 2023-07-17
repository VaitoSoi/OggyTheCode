import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, ComponentType, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { SlashCommandBuilderWithData } from "../../index";
import option from "../../database/option";
import { status } from 'minecraft-server-util'
import ms from 'ms'

export default new SlashCommandBuilderWithData()
    .setData(new SlashCommandBuilder()
        .setName('config')
        .setDescription('Chỉnh sửa cài đặt của bot tại guild hiện tại')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(sub => sub
            .setName('create')
            .setDescription('Tạo cơ sở dữ liệu mới cho guild')
        )
        .addSubcommandGroup(subgroup => subgroup
            .setName('edit')
            .setDescription('Chỉnh sửa cơ sở dữ liệu của guild')
            .addSubcommand(sub => sub
                .setName('channel')
                .setDescription('Chỉnh sửa chức năng của kênh')
                .addStringOption(opt => opt
                    .setName('type')
                    .setDescription('Loại kênh muốn chỉnh')
                    .addChoices(
                        { name: 'Livechat: Kênh truyền tin nhắn trực tiếp từ máy chủ', value: 'livechat' },
                        { name: 'Status: Kênh thông tin về tình trạng của máy chủ', value: 'status' },
                        { name: 'Restart: Kênh thông tin về việc khởi động lại của máy chủ (Hiện không hoạt động)', value: 'restart' }
                    )
                    .setRequired(true)
                )
                .addChannelOption(option => option
                    .setName('channel')
                    .setDescription('Kênh muốn chỉnh sửa')
                    .addChannelTypes(ChannelType.GuildText)
                    .setRequired(true)
                )
                .addBooleanOption(opt => opt
                    .setName('feature')
                    .setDescription('Bật các tính năng phụ lên (bật chế độ chậm, tin nhắn status, ...)')
                )
            )
        )
        .addSubcommand(sub => sub
            .setName('show')
            .setDescription('Hiển thị các cài đặt đã thiết lập')
        )
        .addSubcommandGroup(subgroup => subgroup
            .setName('delete')
            .setDescription('Xóa toàn bộ hoặc một phần cài đặt')
            .addSubcommand(sub => sub
                .setName('all')
                .setDescription('Xóa toàn bộ cài đặt')
            )
            .addSubcommand(sub => sub
                .setName('channel')
                .setDescription('Xóa các cài đặt liên quan đến kênh')
                .addStringOption(opt => opt
                    .setName('type')
                    .setDescription('Loại kênh muốn xóa')
                    .addChoices(
                        { name: 'Toàn bộ kênh', value: 'all' },
                        { name: 'Chỉ xóa kênh livechat', value: 'livechat' },
                        { name: 'Chỉ xóa kênh status', value: 'status' },
                        { name: 'Chỉ xóa kênh restart', value: 'restart' }
                    )
                    .setRequired(true)
                )
                .addBooleanOption(opt => opt
                    .setName('delete_channel')
                    .setDescription('Xóa kênh')
                )
            )
        )
    )
    .setRun(async function (interaction, client) {
        let data = await option.findOne({ guildid: interaction.guildId })
        const databaseEmbed = new EmbedBuilder()
            .setAuthor({
                name: `${interaction.client.user.tag} Database`,
                iconURL: interaction.client.user.displayAvatarURL()
            })
            .setFooter({
                text: `OggyTheCode ${client?.package.version}`,
                iconURL: `https://github.com/${client?.package.github}.png`
            })
            .setTimestamp()
            .setColor((await interaction.guild?.fetch())?.members.me?.displayHexColor ?? 'Random')
        const noData = async () => void await interaction.editReply(
            '🔴 Không có cơ sở dữ liệu cho guild này\n' +
            '🔵 Vui lòng dùng lệnh `/config create` để tạo'
        )
        switch (interaction.options.getSubcommandGroup() || interaction.options.getSubcommand()) {
            case 'create':
                if (data) return void await interaction.editReply(
                    '🟢 Đã có cơ sở dữ liệu từ trước\n' +
                    '🔵 Dùng lệnh `/config edit` để chỉnh sửa cơ sở dữ liệu'
                )
                data = new option({
                    guildid: interaction.guildId,
                    guildname: interaction.guild?.name,
                    config: {
                        channels: {
                            livechat: '',
                            status: '',
                            restart: '',
                        }
                    }
                })
                await data.save()
                void await interaction.editReply({
                    embeds: [
                        databaseEmbed
                            .setTitle('Đã tạo cơ sở dữ liệu')
                            .setDescription(
                                `✅ Đã tạo cơ sở dữ liệu cho \`${interaction.guild?.name}\` (${interaction.guildId})\n` +
                                `ℹ Thông tin chi tiết về các thông số trong CSDL vừa tạo:`
                            )
                            .addFields(
                                {
                                    name: 'Các thông số',
                                    value:
                                        'guildid\n' +
                                        'guildname\n' +
                                        'config.channels.livechat\n' +
                                        'config.channels.status\n' +
                                        'config.channels.restart',
                                    inline: true
                                },
                                {
                                    name: 'Các giá trị',
                                    value:
                                        data.guildid + '\n' +
                                        data.guildname + '\n' +
                                        (data.config?.channels?.livechat || 'undefined') + '\n' +
                                        (data.config?.channels?.status || 'undefined') + '\n' +
                                        (data.config?.channels?.restart || 'undefined'),
                                    inline: true
                                }
                            )
                    ]
                })
                break;
            case 'edit':
                if (!data) return void noData()
                switch (interaction.options.getSubcommand()) {
                    case 'channel':
                        const channel = interaction.options.getChannel<ChannelType.GuildText>('channel', true)
                        const type = interaction.options.getString('type') ?? 'livechat';
                        // console.log({ channel, type })
                        data.set(`config.channels.${type}`, channel.id ?? '')
                        data.save()
                        interaction.editReply(`✅ Đã chỉnh kênh ${type} thành ${(<any>data.config?.channels)[`${type}`] ? `<#${(<any>data.config?.channels)[type]}>` : '`undefined`'} (${(<any>data.config?.channels)[type] ?? 'undefined'})`)
                        const feature = interaction.options.getBoolean('feature') ?? true
                        if (feature) switch (type) {
                            case 'livechat':
                                if (channel.permissionsFor(await channel.guild.members.fetchMe())?.has(PermissionFlagsBits.ManageChannels))
                                    channel.setRateLimitPerUser(10, 'Bật chế độ nhắn chậm tránh việc bot bị mute')
                                        .then(
                                            () => void interaction.channel?.send(
                                                `✅ Đã chỉnh chế độ nhắn chậm thành công.\n` +
                                                `⏳ Thời gian: 10s`
                                            ),
                                            (reason) => void interaction.channel?.send(
                                                `🔴 Không thể chỉnh chế độ nhắn chậm\n` +
                                                `ℹ Lý do: ${reason}`
                                            )
                                        )
                                        .catch(() => void interaction.channel?.send(`🔴 Không thể chỉnh chế độ nhắn chậm`))
                                else interaction.channel?.send('❌ Bot không có quyền để chỉnh sửa kênh để chỉnh chế độ nhắn chậm.')
                                break
                            case 'status':
                                const embed = new EmbedBuilder()
                                    .setAuthor({
                                        name: `${interaction.client.user.tag} Server Utils`,
                                        iconURL: interaction.client.user.displayAvatarURL()
                                    })
                                    .setTitle('Minecraft Server Status')
                                    .setTimestamp()
                                    .setFooter({
                                        text: `OggyTheCode ${client?.package.version ?? 'v1.0.0'}`,
                                        iconURL: `https://github.com/${client?.package.github ?? 'vaitosoi'}.png`
                                    })
                                const ip = client?.config.minecraft.server.ip ?? 'hypixel.com'
                                const port = Number(client?.config.minecraft.server.port) ?? 25565
                                const config = { enableSRV: true }
                                const row = new ActionRowBuilder<ButtonBuilder>()
                                    .addComponents(
                                        new ButtonBuilder()
                                            .setCustomId('update_status')
                                            .setDisabled(false)
                                            .setEmoji('⛏')
                                            .setLabel('Update Infomation')
                                            .setStyle(ButtonStyle.Secondary)
                                    )
                                Promise.resolve(status(ip, port, config))
                                    .then(async (res) => {
                                        embed
                                            .setDescription(
                                                `**Status:** 🟢 Online\n`
                                            )
                                            .addFields(
                                                {
                                                    name: 'Server Information',
                                                    value:
                                                        `**IP:** ${res.srvRecord?.host ?? ip}\n` +
                                                        `**Port:** ${res.srvRecord?.port ?? port}\n` +
                                                        `**Version:** ${res.version.name.replace(/§[0-9|a-z]/, '')}\n` +
                                                        `**Protocol:** ${res.version.protocol}\n`,
                                                    inline: true
                                                },
                                                {
                                                    name: 'Player Information',
                                                    value:
                                                        `**Online:** ${res.players.online}/${res.players.max} players\n` +
                                                        `**Player list**:\n` +
                                                        res.players.sample?.map(obj => `> ${obj.name.replace(/§[0-9|a-z]/, '')}`).join('\n') + '\n',
                                                    inline: true
                                                }
                                            )
                                            .setColor(interaction.guild?.members.me?.displayColor ?? 'Random')
                                            .setThumbnail(`https://api.mcstatus.io/v2/icon/${res.srvRecord?.host ?? ip}`)
                                        if (client?.bot?.player) embed.addFields(
                                            {
                                                name: 'Ingame Information',
                                                value:
                                                    `**TPS:** ${(<any>client.bot).getTps() ?? 'unknown'}\n` +
                                                    `**Ping:** ${client.bot.player.ping ?? '100'}ms`,
                                                inline: true
                                            }
                                        )
                                        embed.addFields({ name: 'MOTD', value: res.motd.clean, inline: false })
                                        return void channel.send({
                                            embeds: [embed],
                                            components: [row]
                                        })
                                    })
                                    .catch(err => void channel.send({
                                        embeds: [
                                            embed
                                                .setDescription(
                                                    `**Server:** ${ip}:${port}\n` +
                                                    `**Status:** 🔴 Offline\n` +
                                                    `**Gặp lỗi khi lấy thông tin về server:**\n` +
                                                    `\`\`\`${err}\`\`\`\n` +
                                                    `Vui lòng thử lại sau`
                                                )
                                                .setColor('Red')
                                        ],
                                        components: [row]
                                    }))
                            case 'restart':
                                break
                        }
                        break;
                }
                break;
            case 'show':
                if (!data) return void noData()
                else {
                    void await interaction.editReply({
                        embeds: [
                            databaseEmbed
                                .setTitle('Các dữ liệu trong cơ sở dữ liệu')
                                .addFields(
                                    {
                                        name: 'Các thông số',
                                        value:
                                            'guildid\n' +
                                            'guildname\n' +
                                            'config.channels.livechat\n' +
                                            'config.channels.status\n' +
                                            'config.channels.restart',
                                        inline: true
                                    },
                                    {
                                        name: 'Các giá trị',
                                        value:
                                            `${data.guildid}\n` +
                                            `${data.guildname}\n` +
                                            `<#${data.config?.channels?.livechat || 'undefined'}> (${data.config?.channels?.livechat || 'undefined'})\n` +
                                            `<#${data.config?.channels?.status || 'undefined'}> (${data.config?.channels?.status || 'undefined'})\n` +
                                            `<#${data.config?.channels?.restart || 'undefined'}> (${data.config?.channels?.restart || 'undefined'})\n`,
                                        inline: true
                                    }
                                )
                        ]
                    })
                }
                break;
            case 'delete':
                if (!data) void noData()
                else interaction.editReply({
                    content:
                        `❓ Bạn có chắc là sẽ xóa vĩnh viễn ${interaction.options.getSubcommand() == 'all' ? 'toàn bộ cơ sở dữ liệu' : 'cài đặt'}\n` +
                        '⏳ Bạn có 5 phút để đưa ra lựa chọn',
                    components: [
                        new ActionRowBuilder<ButtonBuilder>()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId('yes')
                                    .setDisabled(false)
                                    .setEmoji('✅')
                                    .setLabel('Có')
                                    .setStyle(ButtonStyle.Success)
                            )
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId('no')
                                    .setDisabled(false)
                                    .setEmoji('❌')
                                    .setLabel('Không')
                                    .setStyle(ButtonStyle.Danger)
                            )
                    ]
                }).then(async msg => {
                    const collector = msg.createMessageComponentCollector({
                        filter: (inter) => inter.user.id == interaction.user.id,
                        componentType: ComponentType.Button,
                        time: 5 * 60 * 1000,
                    })
                    collector.once('collect', async (inter) => {
                        if (inter.customId == 'no') return void await inter.update({ content: '✅ Đã hủy yêu cầu', components: [] })
                        else if (inter.customId == 'yes')
                            switch (interaction.options.getSubcommand()) {
                                case 'all':
                                    await option.deleteOne({ guildid: interaction.guildId })
                                    void await inter.update({ content: '✅ Đã xóa cơ sở dữ liệu', components: [] })
                                    break;
                                case 'channel':
                                    const type = interaction.options.getString('type') ?? 'livechat'
                                    const oldChannel = interaction.guild?.channels.cache.get((<Object | any>data?.config?.channels)[type])
                                    data?.set(`config.channels.${type}`, '')
                                    await data?.save()
                                    void await inter.update({ content: `✅ Đã xóa cài đặt của kênh ${type}`, components: [] })
                                    if (interaction.options.getBoolean('delete_channel'))
                                        if (oldChannel?.guild.members.me?.permissions.has(PermissionFlagsBits.ManageChannels))
                                            oldChannel?.delete()
                                                .then(async function (channel) {
                                                    inter.channel?.send(`✅ Đã xóa kênh #${channel.name}`)
                                                })
                                                .catch(() => void inter.channel?.send('🔴 Không thể xóa kênh'))
                                        else inter.channel?.send('❌ Bot không có quyền để xóa kênh')
                            }
                    })
                    collector.once('end', async (collection, res) => void await interaction.editReply({
                        content:
                            '🛑 Hủy bỏ bình chọn\n' +
                            'ℹ Lý do: Quá thời gian',
                        components: []
                    }))
                })
                break;
        }
    })