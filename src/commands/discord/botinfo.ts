import { SlashCommandBuilder } from "../..";
import _package from '../../../package.json'
import ms from 'ms'
import { Guild, TextBasedChannel, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ComponentType } from "discord.js"
import os from 'node:os'

class infoEmbed extends EmbedBuilder {
    constructor(guild?: Guild | null) {
        super()
        this
            .setAuthor({
                name: `Oggy Bot Info`,
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

async function latencyCheck(channel: TextBasedChannel | null): Promise<number> {
    if (channel) {
        const time = Date.now()
        const msg = await channel.send('⏳ Checking...')
        msg.delete()
        return msg.createdTimestamp - time
    } else return 0
}

export default new SlashCommandBuilder()
    .setName('botinfo')
    .setDescription('Toàn bộ thông tin về bot')
    .setRun(async (interaction, oggy) => {
        const client = interaction.client
        const guild = interaction.guild
        const botInformation = new infoEmbed(guild)
            .setTitle('Bot Infomation')
            .setDescription('Thông tin cơ bán về bot')
            .addFields(
                {
                    name: 'Bot Name',
                    value: `${client.user.tag}`,
                    inline: true
                },
                {
                    name: 'Bot ID',
                    value: `${client.user.id}`,
                    inline: true
                },
                {
                    name: 'Bot Uptime',
                    value: `${ms(interaction.client.uptime)} (<t:${Math.round(interaction.client.readyTimestamp / 1000)}:R>)`,
                    inline: true
                },
                {
                    name: 'Bot Birthday',
                    value: `<t:${Math.round(client.application.createdTimestamp / 1000)}:F> (<t:${Math.round(client.application.createdTimestamp / 1000)}:R>)`,
                    inline: true,
                }
            )
        if (oggy?.bot) {
            botInformation
                .addFields(
                    {
                        name: 'Mineflayer Bot',
                        value: 'Thông tin về Mineflayer Bot',
                        inline: false
                    },
                    {
                        name: 'Bot Name',
                        value: `${oggy.bot.username}`,
                        inline: true
                    },
                    {
                        name: 'Bot Uptime',
                        value: oggy.data.loginAt != 0 ? `${ms(Date.now() - oggy.data.loginAt)} (<t:${Math.round(oggy.data.loginAt / 1000)}:R>)` : 'Nothing...',
                        inline: true
                    }
                )
        }
        const botPing = new infoEmbed(guild)
            .setTitle('Bot Ping')
            .setDescription('Thông tin về độ trễ của bot, ...')
            .addFields(
                {
                    name: 'Bot Ping',
                    value: `${await latencyCheck(interaction.channel)}ms`,
                    inline: true
                },
                {
                    name: 'WebSocket Ping',
                    value: `${client.ws.ping}ms`,
                    inline: true
                }
            )
        const botSize = new infoEmbed(guild)
            .setTitle('Bot Size')
            .setDescription('Thông tin về số user, kênh, máy chủ, ...')
            .addFields(
                {
                    name: 'Guild(s)',
                    value: `${client.guilds.cache.size}`,
                    inline: true
                },
                {
                    name: 'Channel(s)',
                    value: `${client.channels.cache.size}`,
                    inline: true
                },
                {
                    name: 'User(s)',
                    value: `${client.users.cache.size}`,
                    inline: true
                }
            )
        const hostInfo = new infoEmbed(guild)
            .setTitle('Host Info')
            .setDescription('Thông tin về VPS / Host của bot')
            .addFields(
                {
                    name: 'CPU Model',
                    value: `${os.cpus()[0].model}`,
                    inline: true,
                },
                {
                    name: 'CPU Speed',
                    value: `${os.cpus()[0].speed} MHz`,
                    inline: true,
                },
                {
                    name: 'CPU Cores',
                    value: `${os.cpus().length}`,
                    inline: true,
                },
                {
                    name: 'Memory',
                    value: `${Math.round((os.totalmem() - os.freemem()) / 1024 / 1024)}/${Math.round(os.totalmem() / 1024 / 1024)} MB(s)`,
                    inline: true
                },
                {
                    name: 'System Uptime',
                    value: `${ms(os.uptime() * 1000)}`,
                    inline: true,
                },
                {
                    name: 'System Type',
                    value: `${os.type()} (${os.platform()})`,
                    inline: true
                },
                {
                    name: 'Operating System Name',
                    value: `${os.version()} (${os.arch()})`,
                    inline: false
                }
            )
        const packageInfo = new infoEmbed(guild)
            .setTitle('Package Info')
            .setDescription('Thông tin về các package của bot')
            .addFields(
                {
                    name: 'NodeJS',
                    value: `${process.version}`,
                    inline: true
                },
                {
                    name: 'Discord.JS',
                    value: `${_package.dependencies["discord.js"].replace('^', 'v')}`,
                    inline: true
                },
                {
                    name: 'Mineflayer',
                    value: `${_package.dependencies.mineflayer.replace('^', 'v')}`,
                    inline: true
                },
                {
                    name: 'TypeScript (TS-Node)',
                    value: `${_package.dependencies.typescript.replace('^', 'v')} (${_package.dependencies["ts-node"].replace('^', 'v')})`,
                    inline: true
                },
                {

                    name: 'Mongoose',
                    value: `${_package.dependencies.mongoose.replace('^', 'v')}`,
                    inline: true
                },
                {
                    name: 'DotEnv & YAML',
                    value: `${_package.dependencies.dotenv.replace('^', 'v')}    ${_package.dependencies.yaml.replace('^', 'v')}`,
                    inline: true
                }
            )
        const row = new ActionRowBuilder<StringSelectMenuBuilder>()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('botInfo_selectMenu')
                    .setDisabled(false)
                    .setPlaceholder('📃 Infomation')
                    .addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Bot Information')
                            .setDescription('Thông tin cơ bản của bot')
                            .setEmoji('🤖')
                            .setValue('bot_information'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Bot Ping')
                            .setDescription('Độ trễ của bot, websocket, ...')
                            .setEmoji('⏳')
                            .setValue('bot_ping'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Bot Size')
                            .setDescription('Thông tin về số guild, kênh, người dùng, ...')
                            .setEmoji('📃')
                            .setValue('bot_size'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Host Info')
                            .setDescription('Thông tin về host, vps của bot')
                            .setEmoji('🖥')
                            .setValue('host_info'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Package Info')
                            .setDescription('Thông tin về các package của bot')
                            .setEmoji('📚')
                            .setValue('package_info'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Delete')
                            .setDescription('Xóa tin nhắn này')
                            .setEmoji('🗑')
                            .setValue('delete')
                    )
            )
        const msg = await interaction.editReply({
            embeds: [botInformation],
            components: [row]
        })
        const collector = msg.createMessageComponentCollector({
            componentType: ComponentType.StringSelect,
            //filter: (selectMenu) => selectMenu.user.id == interaction.user.id,
            time: 5 * 60 * 1000
        })
        collector.on('collect', (inter) => {
            switch (inter.values[0]) {
                case 'bot_information': inter.update({ embeds: [botInformation] }); break
                case 'bot_ping': inter.update({ embeds: [botPing] }); break
                case 'bot_size': inter.update({ embeds: [botSize] }); break
                case 'host_info': inter.update({ embeds: [hostInfo] }); break
                case 'package_info': inter.update({ embeds: [packageInfo] }); break
                case 'delete': collector.stop(); break
            }
        })
        collector.on('end', () => void msg.edit({
            content: '⌛ Time out !',
            components: []
        }))
    })