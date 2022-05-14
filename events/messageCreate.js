const { Message, MessageEmbed } = require('discord.js')
const prefixSchema = require('../models/prefix')
const blacklist = require('../models/blacklist')
const dcommand = require('../models/commands')

module.exports = {
    name: 'messageCreate',
    /**
     * 
     * @param {Message} message 
     * @returns 
     */
    async run(message) {
        if (message.content.startsWith(process.env.PREFIX)) return message.reply(`🛑 | MESSAGE_COMMAND đã hết được hỗ trợ bởi <@!${message.client.user.id}>!\n✅ | Vui lòng dùng SLASH_COMMAND (command dùng \`/\`) để ra lệnh.\n❕ | Để biết thông tin thì hãy vào Server Support của <@!${message.client.user.id}>!\n🔽 | Link Server Support: https://discord.com/invite/NBsnNGDeQd`)
        /*
        // console.log(message.content)
        const client = message.client
        if (message.author.bot || !message.guild) return;

        const pdata = await prefixSchema.findOne({
            GuildId: message.guild.id
        });

        let p = ''
        , prefix = ''
        if (client.user.id === process.env.ID_1) p = process.env.PREFIX_1
        else if (client.user.id === process.env.ID_2) p = process.env.PREFIX_2

        if (pdata) {
            prefix = pdata.Prefix
        } else {
            prefix = p
        }

        if (message.content === `<@${client.user.id}>` || message.content === `<@!${client.user.id}>`) return message.channel.send(`Prefix là \` ${prefix} \``)

        if (!message.content.startsWith(prefix)) return;
        const args = message.content.slice(prefix.length).trim().split(/ +/g)
        const cmd = args.shift().toLocaleLowerCase();
        if (cmd.length === 0) return;

        var command = client.commands.get(cmd);
        if (!command) command = await client.commands.get(client.aliases.get(cmd))
        if (!command) return

        if (!message.guild.me.permissionsIn(message.channel).has('SEND_MESSAGES')) {
            if (!message.guild.me.permissionsIn(message.channel).has('ADD_REACTIONS')) return;
            message.react('❌')
        } else {
            let ava = Boolean;

            blacklist.findOne({ id: message.author.id }, async (err, data) => {
                if (err) throw err;
                if (!data) {
                    client.channels.cache.get(process.env.LOG_CHANNEL).send({
                        embeds: [
                            new MessageEmbed()
                                .setTitle('Đã có 1 lệnh được thực thi')
                                .addFields({
                                    name: 'Lệnh:',
                                    value: `Tên: ${command.name ? command.name : cmd}\nĐầy đủ: ${message.content}`
                                },
                                    {
                                        name: 'Người ra lệnh:',
                                        value: `Tên: ${message.author.tag}\nID: ${message.author.id}`
                                    },
                                    {
                                        name: 'Tại:',
                                        value: `Tên: ${message.guild.name}\nID: ${message.guildId}`
                                    })
                                .setColor('RANDOM')
                                .setAuthor({
                                    name: `${client.user.tag}`,
                                    iconURL: client.user.avatarURL()
                                })
                                .setFooter({
                                    text: `${message.guild.name}`,
                                    iconURL: message.guild.iconURL()
                                })
                                .setTimestamp()
                        ]
                    })

                    const data2 = await dcommand.findOne({ guildid: message.guildId })
                    if (data2) {
                        const ar = data2.commands
                        if (ar.includes(command.name)) { ava = false } else { ava = true }
                    } else {
                        ava = true
                    }


                    if (ava === false) {
                        message.channel.send({
                            embeds: [
                                new MessageEmbed()
                                    .setTitle(`❌ | Lệnh \`${cmd}\` đã bị tắt bởi Admin`)
                                    .setColor('#f00c0c')
                            ]
                        })

                    } else if (ava === true || !ava) {
                        if (command) {
                            if (command.category === 'music' && !message.member.voice.channel) return message.channel.send('Vô voice channel đi t mới mở cho mi nghe đc chứ')
                            try {
                                command.run(client, message, args);
                            } catch (err) {
                                message.channel.send('Đã xảy ra lỗi khi thực thi lệnh!\nLỗi:```' + err + '```')
                                client.channels.cache.get('930786044692008960').send({
                                    embeds: [
                                        new MessageEmbed()
                                            .setTitle(`Phát hiện lỗi khi thực thi lệnh!`)
                                            .addFields({
                                                name: 'Lệnh:',
                                                value: `${command.name}`
                                            },
                                                {
                                                    name: 'Người ra lệnh:',
                                                    value: `${message.author}`
                                                },
                                                {
                                                    name: 'Lỗi:',
                                                    value: '```' + `${err}` + '```' + '\nLỗi đã được thông báo tới console!'
                                                })
                                    ]
                                })
                                console.log(err)
                            }
                        }

                    }
                } else {
                    if (!message.content.startsWith(prefix)) return;
                    const args = message.content.slice(prefix.length).trim().split(/ +/g)
                    const cmd = args.shift().toLocaleLowerCase();
                    if (cmd.length === 0) return;
                    var by = data.by
                    if (!by || !data.by) by = 'VaitoSoi#2220'
                    message.channel.send({
                        embeds: [new MessageEmbed()
                            .setTitle('Bạn đã bị blacklist từ trước.')
                            .addFields({
                                name: 'UserID:',
                                value: `${data.id}`,
                                inline: true
                            },
                                {
                                    name: 'Bởi:',
                                    value: `${by}`,
                                    inline: true
                                },
                                {
                                    name: 'Lý do',
                                    value: `${data.reason}`,
                                    inline: true
                                })
                            .setAuthor({ name: `${client.user.tag}`, iconURL: client.user.avatarURL() })
                            .setFooter({ text: `${message.auhtor.tag} • Lệnh: ${cmd}` })
                            .setColor('RANDOM')
                        ]
                    })
                }
            })
        }
        */
    }
}