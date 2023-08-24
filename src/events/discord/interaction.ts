import { Interaction, Events, InteractionType, ChannelType, EmbedBuilder, ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js'
import { EventBuilder } from '../../lib/index'
import { status, JavaStatusOptions } from 'minecraft-server-util'

export default new EventBuilder()
    .setName(Events.InteractionCreate)
    .setOnce(false)
    .setRun(async function (config, interaction: Interaction) {
        if (interaction.type == InteractionType.ApplicationCommand) {
            const cmd = config.commands.get(interaction.commandName)
            if (!cmd) return void interaction.reply('😥 Không tìm thấy lệnh bạn vừa gửi.')
            await interaction.deferReply()
            Promise.resolve(cmd.run(<ChatInputCommandInteraction>interaction, config))
                .then(() => { })
                .catch(async function (error) {
                    console.error(error)
                    const logChannel =
                        config.client_1.channels.cache.get(config.config.discord.channel.error_log) ??
                        config.client_2.channels.cache.get(config.config.discord.channel.error_log)
                    const command: string = `${interaction.commandName} ${[...interaction.options.data].shift()?.name ?? ''} ${[...interaction.options.data].shift()?.options?.shift()?.name ?? ''}`
                    if (!!logChannel && logChannel?.type == ChannelType.GuildText)
                        return void logChannel?.send({
                            embeds: [
                                new EmbedBuilder()
                                    .setAuthor({
                                        name: `${interaction.client.user.tag} Command Error`,
                                        iconURL: interaction.client.user.avatarURL() ?? undefined
                                    })
                                    .setTitle('Vừa có một lỗi xuất hiện')
                                    .addFields(
                                        {
                                            name: 'Thông tin',
                                            value:
                                                'Lệnh:\n' +
                                                'Người dùng:\n' +
                                                'Guild:\n',
                                            inline: true
                                        },
                                        {
                                            name: 'Giá trị',
                                            value:
                                                `${command}\n` +
                                                `${interaction.user.tag}\n` +
                                                `${interaction.guild?.name}`,
                                            inline: true
                                        },
                                        {
                                            name: 'Full error',
                                            value: '```' + error + '```',
                                            inline: false
                                        }
                                    )
                                    .setFooter({
                                        text: `OggyTheCode ${config.package.version}`,
                                        iconURL: `https://github.com/${config.package.github}.png`
                                    })
                                    .setTimestamp()
                                    .setColor((await interaction.guild?.fetch())?.members.me?.displayHexColor ?? 'Red')
                            ]
                        })
                })
                .finally(async function () {
                    const logChannel =
                        config.client_1.channels.cache.get(config.config.discord.channel.command_log) ??
                        config.client_2.channels.cache.get(config.config.discord.channel.command_log)
                    const command: string = `${interaction.commandName} ${[...interaction.options.data].shift()?.name ?? ''} ${[...interaction.options.data].shift()?.options?.shift()?.name ?? ''}`
                    if (!!logChannel && logChannel?.type == ChannelType.GuildText)
                        return void logChannel?.send({
                            embeds: [
                                new EmbedBuilder()
                                    .setAuthor({
                                        name: `${interaction.client.user.tag} Command Excute`,
                                        iconURL: interaction.client.user.avatarURL() ?? undefined
                                    })
                                    .setTitle('Vừa có một lệnh đươc thực thi')
                                    .addFields(
                                        {
                                            name: 'Thông tin',
                                            value:
                                                'Lệnh:\n' +
                                                'Người dùng:\n' +
                                                'Guild:\n',
                                            inline: true
                                        },
                                        {
                                            name: 'Giá trị',
                                            value:
                                                `${command}\n` +
                                                `${interaction.user.tag}\n` +
                                                `${interaction.guild?.name}`,
                                            inline: true
                                        }
                                    )
                                    .setFooter({
                                        text: `OggyTheCode ${config.package.version}`,
                                        iconURL: `https://github.com/${config.package.github}.png`
                                    })
                                    .setTimestamp()
                                    .setColor((await interaction.guild?.fetch())?.members.me?.displayHexColor ?? 'Random')
                            ]
                        })
                })
        } else if (interaction.type == InteractionType.ApplicationCommandAutocomplete) {
            const cmd = config.commands.get(interaction.commandName)
            if (cmd) Promise.resolve(cmd.autocompleteRun)
                .then(async func => await func(interaction, config))
                .catch(console.error)
        } else if (interaction.type == InteractionType.MessageComponent) {
            if (interaction.isButton())
                switch (interaction.customId) {
                    case 'update_status':
                        const embed = new EmbedBuilder()
                            .setAuthor({
                                name: `${interaction.client.user.tag} Server Utils`,
                                iconURL: interaction.client.user.displayAvatarURL()
                            })
                            .setTitle('Minecraft Server Status')
                            .setTimestamp()
                            .setFooter({
                                text: `OggyTheCode ${config?.package.version ?? 'v1.0.0'}`,
                                iconURL: `https://github.com/${config?.package.github ?? 'vaitosoi'}.png`
                            })
                        const ip: string = config?.config.minecraft.server.ip ?? 'hypixel.com'
                        const port: number = Number(config?.config.minecraft.server.port) ?? 25565
                        const statusConfig: JavaStatusOptions = { enableSRV: true }
                        const row: ActionRowBuilder<ButtonBuilder> = new ActionRowBuilder<ButtonBuilder>()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId('update_status')
                                    .setDisabled(false)
                                    .setEmoji('⛏')
                                    .setLabel('Update Infomation')
                                    .setStyle(ButtonStyle.Secondary)
                            )
                        Promise.resolve(status(ip, port, statusConfig))
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
                                                `**Version:** ${res.version.name.replace(/§[0-9|a-z]/gi, '')}\n` +
                                                `**Protocol:** ${res.version.protocol}\n`,
                                            inline: true
                                        },
                                        {
                                            name: 'Player Information',
                                            value:
                                                `**Online:** ${res.players.online}/${res.players.max} players\n` +
                                                `**Player list**:\n` +
                                                res.players.sample?.map(obj => `> ${obj.name.replace(/§[0-9|a-z]/gi, '')}`).join('\n') + '\n',
                                            inline: true
                                        }
                                    )
                                    .setColor(interaction.guild?.members.me?.displayColor ?? 'Random')
                                    .setThumbnail(`https://api.mcstatus.io/v2/icon/${res.srvRecord?.host ?? ip}`)
                                if (config?.bot?.player) embed.addFields(
                                    {
                                        name: 'Ingame Information',
                                        value:
                                            `**TPS:** ${(<any>config.bot).getTps() ?? 'unknown'}\n` +
                                            `**Ping:** ${config.bot.player.ping ?? '100'}ms`,
                                        inline: true
                                    }
                                )
                                embed.addFields({ name: 'MOTD', value: res.motd.clean, inline: false })
                                return void interaction.update({
                                    embeds: [embed],
                                    components: [row]
                                })
                                    .catch(console.error)
                            })
                            .catch(err =>
                                void interaction.update({
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
                                })
                                    .catch(console.error)
                            )
                        break
                }
        }
    })