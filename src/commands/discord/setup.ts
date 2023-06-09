import { ActionRowBuilder, ComponentType, EmbedBuilder, Guild, PermissionFlagsBits, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, PermissionFlagsBits as Flags, ChannelSelectMenuBuilder, ChannelType, ButtonBuilder, ButtonStyle } from "discord.js";
import { SlashCommandBuilder } from "../..";
import _package from '../../../package.json'
import option from '../../database/option'
import { status } from 'minecraft-server-util'

class SetUpEmbed extends EmbedBuilder {
    constructor(guild?: Guild | null) {
        super()
        this
            .setAuthor({
                name: `Oggy Set Up`,
                iconURL: `https://cdn.discordapp.com/attachments/936994104884224020/1104690145531273316/242105559_940905476497135_3471501375826351146_n.jpg`
            })
            .setFooter({
                text: `OggyTheCode ${_package.version}`,
                iconURL: `https://github.com/${_package.github}.png`
            })
            .setTimestamp()
            .setColor(guild?.members.me?.displayColor ?? 'Random')
    }
}

export default new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Set up OggyTheBot')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setRun(async (interaction, oggy) => {
        const setup_menu = new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('setup_menu')
                    .setDisabled(false)
                    .setPlaceholder('Set Up Menu')
                    .setMaxValues(1)
                    .setOptions([
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Permission Check')
                            .setDescription('Kiểm tra quyền của bot')
                            .setValue('permission')
                            .setEmoji('📃'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Set Channels')
                            .setDescription('Cài đặt các kênh cho guild này')
                            .setValue('set_channel')
                            .setEmoji('📫'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Main Menu')
                            .setDescription('Trở về menu chính')
                            .setValue('main_menu')
                            .setEmoji('🏠'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Close Menu')
                            .setDescription('Đóng menu')
                            .setValue('close_menu')
                            .setEmoji('🗑'),
                    ])
            )
        const setup_embed = new SetUpEmbed(interaction.guild)
            .setDescription(
                `# 👋 ${interaction.client.user.tag} chào bạn\n` +
                `Nếu bạn không thích thao tác loằng ngoằng các câu lệnh\n` +
                `Thì đây sẽ là công cụ cho bạn :)\n` +
                `Hãy chọn 1 trong các lựa chọn phía dưới để bắt đầu`
            )
        const setchannel_menu = new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('setchannel_menu')
                    .setDisabled(false)
                    .setPlaceholder('Set Channel Menu')
                    .setMaxValues(1)
                    .setOptions([
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Set Livechat')
                            .setDescription('Cài đặt channel livechat')
                            .setValue('channel_livechat')
                            .setEmoji('📫'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Set Status')
                            .setDescription('Cài đặt channel status')
                            .setValue('channel_status')
                            .setEmoji('⛏'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Go Back')
                            .setDescription('Quay lại menu chính')
                            .setValue('go_back')
                            .setEmoji('⬅')
                    ])
            )
        const setchannel_embed = new SetUpEmbed(interaction.guild)
            .setTitle('Set Channel')
            .setDescription(
                'Bạn đã chọn việc set up kênh\n' +
                'Vui lòng chọn 1 trong các loại kênh phía dưới'
            )
        const msg = await interaction.editReply({
            embeds: [setup_embed],
            components: [setup_menu]
        })
        const collector = msg.createMessageComponentCollector({
            componentType: ComponentType.StringSelect,
            filter: (inter) => inter.user.id == interaction.user.id,
            time: 15 * 60 * 1000
        })
        collector.on('collect', async (inter) => {
            switch (inter.customId) {
                case 'setup_menu':
                    switch (inter.values[0]) {
                        case 'permission':
                            const me = await interaction.guild?.members.fetchMe()
                            const permission = me?.permissions
                            const channels = interaction.guild?.channels.cache

                            const guildViewChannels = permission?.has(Flags.ViewChannel)
                            const guildSendMessages = permission?.has(Flags.SendMessages)
                            const guildEmbedLinks = permission?.has(Flags.EmbedLinks)
                            const guildManageChannels = permission?.has(Flags.ManageChannels)

                            const dataChnanels = (await option.findOne({ guildid: interaction.guildId }))?.config?.channels
                            const livechatChannel: any = channels?.get(dataChnanels?.livechat ?? '')
                            const statusChannel: any = channels?.get(dataChnanels?.status ?? '')
                            const livechatSendMessages = !livechatChannel ? undefined : me?.permissionsIn(livechatChannel)?.has(Flags.SendMessages)
                            const livechatEmbedLinks = !livechatChannel ? undefined : me?.permissionsIn(livechatChannel)?.has(Flags.EmbedLinks)
                            const statusSendMessages = !statusChannel ? undefined : me?.permissionsIn(statusChannel)?.has(Flags.SendMessages)
                            const statusEmbedLinks = !statusChannel ? undefined : me?.permissionsIn(statusChannel)?.has(Flags.EmbedLinks)

                            const status = (status: any): string => !!status ? '✅' : '❌'

                            const embed = new SetUpEmbed(interaction.guild)
                                .setTitle('Permission Check')
                                .setDescription(
                                    'Kiểm tra các quyền trong guild này\n' +
                                    'Các quyền có dấu ❕ lá quyền cần thiết'
                                )
                                .addFields(
                                    {
                                        name: 'Tên quyền',
                                        value:
                                            '**Các quyền trong máy chủ chính**\n' +
                                            '> ❕ Nhìn thấy các kênh (View Channels)\n' +
                                            '> ❕ Gửi tin nhắn (Send Messages)\n' +
                                            '> ❕ Nhúng liên kết (Embeds Link)\n' +
                                            '> Quản lý kênh (Manage Channels)\n' +
                                            (!!livechatChannel
                                                ? '**Các quyền tại kênh Livechat**\n' +
                                                '> ❕ Gửi tin nhắn (Send Messages)\n' +
                                                '> ❕ Nhúng liên kết (Embeds Link)\n'
                                                : '**Kênh Livechat chưa được thiết lập**\n') +
                                            (!!statusChannel
                                                ? '**Các quyền tại kênh Status**\n' +
                                                '> ❕ Gửi tin nhắn (Send Messages)\n' +
                                                '> ❕ Nhúng liên kết (Embeds Link)\n'
                                                : '**Kênh Status chưa được thiết lập**'),
                                        inline: true
                                    },
                                    {
                                        name: 'Trạng thái',
                                        value: '‎ \n' +
                                            `${status(guildViewChannels)}\n` +
                                            `${status(guildSendMessages)}\n` +
                                            `${status(guildEmbedLinks)}\n` +
                                            `${status(guildManageChannels)}\n` +
                                            '\n' +
                                            (
                                                !!livechatChannel
                                                    ?
                                                    `${status(livechatSendMessages)}\n` +
                                                    `${status(livechatEmbedLinks)}\n`
                                                    : '\n'
                                            ) + '\n' +
                                            (
                                                !!statusChannel
                                                    ?
                                                    `${status(statusSendMessages)}\n` +
                                                    `${status(statusEmbedLinks)}\n`
                                                    : ''
                                            ),
                                        inline: true
                                    }
                                )
                            inter.update({ embeds: [embed] })
                            break;
                        case 'set_channel':
                            inter.update({
                                embeds: [setchannel_embed],
                                components: [setchannel_menu],
                            })
                            break;
                        case 'main_menu':
                            inter.update({
                                embeds: [setup_embed],
                                components: [setup_menu]
                            })
                            break;
                        case 'close_menu':
                            collector.stop()
                            break;
                    }
                    break;
                case 'setchannel_menu':
                    switch (inter.values[0]) {
                        case 'channel_livechat':
                        case 'channel_status':
                            const database = await option.findOne({ guildid: interaction.guildId }) || new option()
                            const type = (/^channel_(.+)$/.exec(inter.values[0]) ?? ['', 'livechat'])[1]
                            const mess = await inter.reply({
                                embeds: [
                                    new SetUpEmbed(interaction.guild)
                                        .setTitle('Set Up Channel')
                                        .setDescription(`Vui lòng chọn 1 trong các channel phía dưới để cài đặt`)
                                ],
                                components: [
                                    new ActionRowBuilder<ChannelSelectMenuBuilder>()
                                        .addComponents(
                                            new ChannelSelectMenuBuilder()
                                                .setChannelTypes(ChannelType.GuildText)
                                                .setCustomId('channel')
                                                .setPlaceholder('Select Channel')
                                                .setMaxValues(1)
                                        )
                                ],
                                ephemeral: true,
                            })
                            const coll = mess.createMessageComponentCollector({
                                componentType: ComponentType.ChannelSelect,
                                filter: (inter) => inter.user.id == interaction.user.id,
                                time: 5 * 60 * 1000
                            })
                            coll.on('collect', (interac) => {
                                const channel = interaction.guild?.channels.cache.get(interac.channels.first()?.id ?? '')
                                database.set(`config.channels.${type}`, channel?.id)
                                if (type == 'status') {
                                    const embed = new EmbedBuilder()
                                        .setAuthor({
                                            name: `${interaction.client.user.tag} Server Utils`,
                                            iconURL: interaction.client.user.displayAvatarURL()
                                        })
                                        .setTitle('Minecraft Server Status')
                                        .setTimestamp()
                                        .setFooter({
                                            text: `OggyTheCode ${oggy?.package.version ?? 'v1.0.0'}`,
                                            iconURL: `https://github.com/${oggy?.package.github ?? 'vaitosoi'}.png`
                                        })
                                    const ip = oggy?.config.minecraft.server.ip ?? 'hypixel.com'
                                    const port = Number(oggy?.config.minecraft.server.port) ?? 25565
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
                                    if (channel?.type == ChannelType.GuildText)
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
                                                if (oggy?.bot?.player) embed.addFields(
                                                    {
                                                        name: 'Ingame Information',
                                                        value:
                                                            `**TPS:** ${(<any>oggy.bot).getTps() ?? 'unknown'}\n` +
                                                            `**Ping:** ${oggy.bot.player.ping ?? '100'}ms`,
                                                        inline: true
                                                    }
                                                )
                                                embed.addFields({ name: 'MOTD', value: res.motd.clean, inline: false })
                                                return void channel?.send({
                                                    embeds: [embed],
                                                    components: [row]
                                                })
                                            })
                                            .catch(err => void channel?.send({
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
                                }
                                interac.update({
                                    embeds: [
                                        new SetUpEmbed(interaction.guild)
                                            .setDescription(
                                                '✅ Done\n' +
                                                `📫 Đã chỉnh kênh <#${database.get(`config.channels.${type}`)}> thành kênh \`${type}\`\n` +
                                                (channel?.type != ChannelType.GuildText ? `Nhưng hình như kênh này không phải là kênh văn bản :v` : '')
                                            )
                                    ]
                                })
                                coll.stop('done')
                            })
                            coll.on('end', (collected, reason) => {
                                mess.edit({
                                    components: []
                                })
                            })
                            break;
                        case 'go_back':
                            inter.update({
                                embeds: [setup_embed],
                                components: [setup_menu]
                            })
                            break;
                    }
                    break;
            }
        })
        collector.on('end', () =>
            void interaction.editReply({
                embeds: [
                    new SetUpEmbed(interaction.guild)
                        .setTitle('Thank You')
                        .setDescription(`Cảm ơn bạn đã tin tưởng chọn ${interaction.client.user.tag} cũng như là OggyTheCode`)
                ],
                components: []
            })
        )
    })
