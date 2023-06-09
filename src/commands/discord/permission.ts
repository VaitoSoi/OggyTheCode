import { PermissionFlagsBits as Flags } from "discord.js";
import { SlashCommandBuilder } from "../..";
import option from "../../database/option";

export default new SlashCommandBuilder()
    .setName('permission')
    .setDescription('Kiểm tra các quyền của bot')
    .setRun(async (interaction) => {
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

        interaction.editReply(
            '**Các quyền tại máy chủ:**\n' +
            `> Nhìn thấy các kênh (View Channels): ${status(guildViewChannels)}\n` +
            `> Gửi tin nhắn (Send Messages): ${status(guildSendMessages)}\n` +
            `> Nhúng liên kết (Embeds Link): ${status(guildEmbedLinks)}\n` +
            `> Quản lý kênh (Manage Channels) (Không cần thiết): ${status(guildManageChannels)}\n` +
            '**Các quyền tại kênh Livechat:**\n' +
            (
                livechatChannel
                    ?
                    `> Gửi tin nhắn (Send Messages): ${status(livechatSendMessages)}\n` +
                    `> Nhúng liên kết (Embeds Link): ${status(livechatEmbedLinks)}\n`
                    : '> Chưa cài đặt kênh Livechat\n'
            ) +
            '**Các quyền tại kênh Status:**\n' +
            (
                statusChannel
                    ?
                    `> Gửi tin nhắn (Send Messages): ${status(statusSendMessages)}\n` +
                    `> Nhúng liên kết (Embeds Link): ${status(statusEmbedLinks)}\n`
                    : '> Chưa cài đặt kênh Status'
            )
        )
    })