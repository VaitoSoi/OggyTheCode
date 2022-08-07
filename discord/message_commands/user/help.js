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
            let dirs = fs.readdirSync('./discord/message_commands/')
            let categories = []
            let option = []
            dirs.forEach((dir) => {
                let files = fs.readdirSync(`./discord/message_commands/${dir}/`).filter(file => file.endsWith('.js'))
                categories.push({
                    name: dir.toString().toLowerCase(),
                    cmds: files
                })
                option.push({
                    label: (dir.toLowerCase() === 'user' ?
                        '🤵'
                        : dir.toLowerCase() === 'server' ?
                            '⛏'
                            : '') + ' ' +
                        dir[0].toUpperCase() + dir.slice(1).toLowerCase(),
                    description: `Có ${files.length} lệnh` + ' | ' +
                        (dir.toLowerCase() === 'user' ?
                            'Là các lệnh cơ bản của bot'
                            : dir.toLowerCase() === 'server' ?
                                `Là các lệnh liên quan đến ${process.env.MC_HOST}`
                                : ''),
                    value: dir.toLowerCase()
                })
            })

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
                    '[Invite Oggy](https://discord.com/oauth2/authorize?client_id=898782551110471701&permissions=93264&scope=bot+applications.commands) | ' +
                    '[Invite Oggy 2](https://discord.com/oauth2/authorize?client_id=974862207106027540&permissions=93264&scope=bot+applications.commands)\n'
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
                            const cmd = require(`../${cmds.name}/${c}`)
                            if (!cmd) return
                            embed.addField(cmd.name,
                                cmd.description
                                    ? cmd.description
                                    : 'Không có mô tả',
                                true)
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
            let prefix = process.env.prefix
            const db = require('../../../models/option')
            const data = await db.findOne({
                guildid: message.guildId
            })
            if (data
                && data.config.prefix
                && data.config.prefix != '') prefix = data.config.prefix
            const command = client.message.get(args[1])
            if (!command) return message.reply(`🔴 | Không tìm thấy lệnh \`${args[1]}\``)
            const embed = new MessageEmbed()
                .setAuthor({
                    name: `${client.user.tag} Help Menu`,
                    iconURL: client.user.displayAvatarURL()
                })
                .setTitle("Thông tin về lệnh: ")
                .addField("PREFIX:", `\`${prefix}\``, true)
                .addField(
                    "TÊN:",
                    command.name ? `\`${command.name}\`` : "Lệnh không có tên",
                    true
                )
                .addField(
                    "CÁCH DÙNG",
                    command.name == 'config' ?
                        command.usage
                            ? `\`${prefix}${command.name} ${command.usage}\``
                            : `\`${prefix}${command.name}\``
                        : `\`${command.usage}\``
                )
                .addField(
                    "MÔ TẢ:",
                    command.description
                        ? command.description
                        : "Không có mô tả cho lệnh này"
                )
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