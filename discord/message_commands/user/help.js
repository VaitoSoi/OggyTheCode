const { Client, Message, MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js')
const fs = require('node:fs')

module.exports = {
    name: 'help',
    description: 'Hiện thông tin về tất cả hoặc một lệnh của bot',
    usage: '',
    /**
    * 
    * @param {Client} client 
    * @param {Message} message 
    * @param {String[]} args 
    */
    run: async (client, message, args) => {
        if (!args[1]) {

            let categories = []
            let option = []
            Object.keys(client.message.categories).forEach((key) => {
                categories.push({
                    name: key.toString().toLowerCase(),
                    cmds: client.message.categories[key]
                })
                option.push({
                    label: (key.toLowerCase() === 'user'
                        ? '🤵'
                        : key.toLowerCase() === 'server'
                            ? '⛏'
                            : '') + ' ' +
                        key[0].toUpperCase() + key.slice(1).toLowerCase(),
                    description: `Có ${client.message.categories[key].length} lệnh` + ' | ' +
                        (key.toLowerCase() === 'user'
                            ? 'Là các lệnh cơ bản của bot'
                            : key.toLowerCase() === 'server'
                                ? `Là các lệnh liên quan đến ${process.env.MC_HOST}`
                                : ''),
                    value: key.toLowerCase()
                })
            })

            const client1 = client.num == '1' ? client.user.id : client.client1.user.id
            const client2 = client.num == '1' ? client.client2.user.id : client.user.id
            const permissions = '93264'
            const scope = 'bot+applications.commands'

            const embed = new MessageEmbed()
                .setAuthor({
                    name: `${client.user.tag} Help Menu`,
                    iconURL: client.user.displayAvatarURL()
                })
                .setColor('RANDOM')
                .setFooter({
                    text: `${message.author.tag} • ${message.guild.name}`,
                    iconURL: message.author.displayAvatarURL()
                })
                .setTimestamp()
                .setThumbnail(client.user.displayAvatarURL())
                .setDescription(
                    'Các lệnh cơ bản: \n' +
                    '> `/config`: Điều chỉnh các cài đặt của bot.\n' +
                    '> `/botinfo`: Toàn bộ thông tin về bot.\n' +
                    '> `/help`: Hiện menu này.\n' +
                    '\n' +
                    'Các link liên quan của Oggy:\n' +
                    `'[Invite Oggy](https://discord.com/oauth2/authorize?client_id=${client1}&permissions=${permissions}&scope=${scope})` + ' | ' +
                    `'[Invite Oggy 2](https://discord.com/oauth2/authorize?client_id=${client2}&permissions=${permissions}&scope=${scope})\n`
                )
            let msg = await message.reply({
                embeds: [
                    embed
                ],
                components: [
                    new MessageActionRow()
                        .addComponents(
                            new MessageSelectMenu()
                                .setCustomId('category')
                                .setOptions([{
                                    label: '🏠 Home',
                                    description: 'Trở về trang chủ',
                                    value: 'home'
                                }].concat(option))
                                .setPlaceholder('📃 Category')
                                .setDisabled(false)
                        )
                ]
            })
            message.channel.createMessageComponentCollector({
                componentType: 'SELECT_MENU',
                time: 5 * 60 * 1000,
            })
                .on('collect', async (inter) => {
                    if (inter.customId !== 'category') return
                    if (inter.values[0] === 'home') {
                        inter.update({
                            embeds: [embed]
                        })
                    } else {
                        const cmds = await categories.find(f => f.name === inter.values[0])
                        if (!cmds) return
                        const embed = new MessageEmbed()
                            .setAuthor({
                                name: `${client.user.tag} Help Menu`,
                                iconURL: client.user.displayAvatarURL()
                            })
                            .setColor('RANDOM')
                            .setFooter({
                                text: `${message.author.tag} • ${message.guild.name}`,
                                iconURL: message.author.displayAvatarURL()
                            })
                            .setTimestamp()
                            .setThumbnail(client.user.displayAvatarURL())
                            .setTitle(`Các lệnh hiện có trong tập lệnh \`${cmds.name.toUpperCase()}\``)
                        cmds.cmds.forEach((c) => {
                            const cmd = client.message.commands.get(c)
                            if (!cmd) return
                            embed.addFields({
                                name: cmd.name ? cmd.name : 'Không tên :v',
                                value: cmd.description
                                    ? cmd.description
                                    : 'Không có mô tả',
                                inline: true
                            })
                        })
                        inter.update({
                            embeds: [embed]
                        })
                    }
                })
                .on('end', () => msg.edit({
                    components: [],
                    content: '❕ Time out!'
                }))
        } else {
            let prefix = process.env.PREFIX
            /*
            const db = require('../../../models/option')
            const data = await db.findOne({
                guildid: message.guildId
            })
            if (data
                && data.config.prefix
                && data.config.prefix != '') prefix = data.config.prefix */
            let command = client.message.commands.get(args[1])
            const aliases = client.message.aliases.get(args[1])
            if (!command && aliases) command = client.message.commands.get(aliases)
            if (!command && !aliases) return message.reply(`🔴 | Không tìm thấy lệnh \`${args[1]}\``)
            const embed = new MessageEmbed()
                .setAuthor({
                    name: `${client.user.tag} Help Menu`,
                    iconURL: client.user.displayAvatarURL()
                })
                .setTitle("Thông tin về lệnh: ")
                .addFields({
                    name: "PREFIX:",
                    value: `\`${prefix}\``,
                    inline: true
                },
                    {
                        name: "TÊN:",
                        value: command.name ? `\`${command.name}\`` : "Lệnh không có tên",
                        inline: true
                    },
                    {
                        name: "CÁCH DÙNG",
                        value:
                            command.name == 'config'
                                ? command.usage
                                    ? `\`${prefix}${command.name} ${command.usage}\``
                                    : `\`${prefix}${command.name}\``
                                : `\`${command.usage}\``
                    },
                    {
                        name: "MÔ TẢ:",
                        value: command.description
                            ? command.description
                            : "Không có mô tả cho lệnh này"
                    })
                .setFooter({
                    text: `Yêu cầu bởi: ${message.author.tag}`,
                    iconURL: message.author.displayAvatarURL({ dynamic: true })
                })
                .setTimestamp()
                .setColor('RANDOM')
                .setThumbnail(client.user.displayAvatarURL())
            return message.reply({ embeds: [embed] });
        }
    }
} 