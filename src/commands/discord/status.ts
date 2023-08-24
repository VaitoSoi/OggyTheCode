import { EmbedBuilder } from 'discord.js'
import { SlashCommandBuilder } from "../../lib/index";
import { status } from 'minecraft-server-util'

export default new SlashCommandBuilder()
    .setName('status')
    .setDescription('Lấy thông tin của một server')
    .addStringOption(opt => opt
        .setName('ip')
        .setDescription('IP của server')
        .setRequired(true)
    )
    .addNumberOption(opt => opt
        .setName('port')
        .setDescription('Port của server')
    )
    .setRun((interaction, client) => {
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
        const ip = interaction.options.getString('ip', true)
        const port = interaction.options.getNumber('port') ?? 25565
        const config = { enableSRV: true }
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
                            name: 'Player Infomation',
                            value:
                                `**Online:** ${res.players.online}/${res.players.max} players\n` +
                                `**Player list**:\n` +
                                res.players.sample?.map(obj => `> ${obj.name.replace(/§[0-9|a-z]/, '')}`).join('\n') + '\n',
                            inline: true
                        },
                        {
                            name: 'MOTD',
                            value: res.motd.clean,
                            inline: false
                        }
                    )
                    .setColor(interaction.guild?.members.me?.displayColor ?? 'Random')
                    .setThumbnail(`https://api.mcstatus.io/v2/icon/${res.srvRecord?.host ?? ip}`)
                void interaction.editReply({
                    embeds: [embed]
                })
            })
            .catch(err => void interaction.editReply({
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
                ]
            }))
    })