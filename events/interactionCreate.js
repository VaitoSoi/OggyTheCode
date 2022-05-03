const { Interaction, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js')
//const { QueueRepeatMode } = require('discord-player')
const ms = require('ms')

module.exports = {
    name: 'interactionCreate',
    /**
     * 
     * @param {Interaction} interaction 
     * @returns 
     */
    async run(interaction) {
        if (interaction.isCommand()) {
            let client = interaction.client
                , data = await require('../models/blacklist').findOne({ id: interaction.user.id })
                , ava = Boolean;
            // if (!interaction.command) return interaction.reply('[🛑] | ERROR: `INTERACTION.COMMAND is underfined`')
            const command = client.interactions.get(interaction.commandName)
            if (!command) return interaction.reply('[🛑] | ERROR: `COMMAND is underfined`')
            if (!data) {
                client.channels.cache.get(process.env.LOG_CHANNEL).send({
                    embeds: [
                        new MessageEmbed()
                            .setTitle('Đã có 1 lệnh được thực thi')
                            .addFields({
                                name: 'Lệnh:',
                                value: `Tên: ${command.data.name}\n`
                            },
                                {
                                    name: 'Người ra lệnh:',
                                    value: `Tên: ${interaction.user.tag}\nID: ${interaction.user.id}`
                                },
                                {
                                    name: 'Tại:',
                                    value: `Tên: ${interaction.guild.name}\nID: ${interaction.guildId}`
                                })
                            .setColor('RANDOM')
                            .setAuthor({
                                name: `${client.user.tag}`,
                                iconURL: client.user.avatarURL()
                            })
                            .setFooter({
                                text: `${interaction.guild.name}`,
                                iconURL: interaction.guild.iconURL()
                            })
                            .setTimestamp()
                    ]
                })

                const data2 = await require('../models/commands').findOne({ guildid: interaction.guildId })
                if (data2) {
                    const ar = data2.commands
                    if (ar.includes(command.name)) { ava = false } else { ava = true }
                } else {
                    ava = true
                }


                if (ava === false) {
                    interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setTitle(`❌ | Lệnh \`${cmd}\` đã bị tắt bởi Admin`)
                                .setColor('#f00c0c')
                        ]
                    })

                } else if (ava === true || !ava) {
                    if (command) {
                        if (command.category === 'music' && !interaction.member.voice.channel) return interaction.reply('Vô voice channel đi t mới mở cho mi nghe đc chứ')

                        try {
                            await interaction.deferReply()
                            command.run(interaction);
                        } catch (err) {
                            // interaction.editReply('Đã xảy ra lỗi khi thực thi lệnh!\nLỗi:```' + err + '```')
                            console.log(err.stack)
                            /*
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
                                                value: `${interaction.author}`
                                            },
                                            {
                                                name: 'Lỗi:',
                                                value: '```' + `${err}` + '```' + '\nLỗi đã được thông báo tới console!'
                                            })
                                ]
                            })
                            console.log(err) */
                        }
                    }
                }
            } else {
                var by = data.by
                if (!by || !data.by) by = 'VaitoSoi#2220'
                interaction.reply({
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
                                inline: false
                            })
                        .setAuthor({ name: `${client.user.tag} blacklist`, iconURL: client.user.avatarURL() })
                        .setFooter({ text: `${interaction.user.tag} • Lệnh: ${interaction.command.name ? interaction.command.name : 'underfined'}` })
                        .setColor('RANDOM')
                        .setThumbnail(interaction.user.displayAvatarURL())
                        .setTimestamp()
                    ]
                })
            }
        }
    }
}