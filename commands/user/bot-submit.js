const { Client, Message, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
let submit = require('../../models/tempsubmit')
const ms = require('ms')

module.exports = {
    name: 'bot-submit',
    aliases: ['botsubmit', 'gopy', 'gop-y'],
    description: 'Góp ý cho bot',
    usage: '',
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async (client, message, args) => {
        var data = await submit.findOne({
            userid: message.author.id
        })

        if (data) {
            return message.channel.send('❌ | Bạn đã bắt đầu submit rồi !')
        } else {
            data = new submit({
                userid: message.author.id,
                username: message.author.username,
                type: '',
                submit: []
            })
            data.save()
        }
        const row = (state) => [
            new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('submit-1')
                        .setLabel('1️⃣ Thêm lệnh')
                        .setDisabled(state)
                        .setStyle('PRIMARY')
                )
                .addComponents(
                    new MessageButton()
                        .setCustomId('submit-2')
                        .setLabel('2️⃣ Chỉnh lệnh')
                        .setDisabled(state)
                        .setStyle('PRIMARY')
                )
                .addComponents(
                    new MessageButton()
                        .setCustomId('submit-3')
                        .setLabel('3️⃣ Báo lỗi')
                        .setDisabled(state)
                        .setStyle('PRIMARY')
                )
        ]
        const row2 = (state) => [
            new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('submit-yes')
                        .setLabel('✅ Có')
                        .setDisabled(state)
                        .setStyle('SUCCESS')
                )
                .addComponents(
                    new MessageButton()
                        .setCustomId('submit-no')
                        .setLabel('❌ Không')
                        .setDisabled(state)
                        .setStyle('DANGER')
                )
        ]
        const row3 = (state) => [
            new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('submit-accept')
                        .setLabel('📩 Gửi đi')
                        .setDisabled(state)
                        .setStyle('SUCCESS')
                )
                .addComponents(
                    new MessageButton()
                        .setCustomId('submit-reject')
                        .setLabel('❌ Từ chối')
                        .setDisabled(state)
                        .setStyle('DANGER')
                )
        ]

        const embed = new MessageEmbed()
            .setAuthor({
                name: `Góp ý cho ${client.user.tag}`,
                iconURL: client.user.displayAvatarURL()
            })
            .setTitle('❓ | Bạn muốn góp ý gì cho bot ?')
            .setDescription(
                `1️⃣ | Góp ý thêm lệnh cho bot\n2️⃣ | Cải tiến / Chỉnh sửa lệnh\n3️⃣ | Báo lỗi / bug`
            )
            .setColor('RANDOM')
        const embed1 = new MessageEmbed()
            .setAuthor({
                name: `Góp ý cho ${client.user.tag}`,
                iconURL: client.user.displayAvatarURL()
            })
            .setColor(
                'RANDOM'
            )

        const mess = await message.author.send({
            embeds: [
                embed
            ],
            components: row(false)
        })
        message.channel.send('📩 | Đã gửi vào DMs của bạn')


        const submitNotiID = require('../../config.json')['submit-noti']
        const submitNotiChannel = client.channels.cache.get(submitNotiID)

        const buttonCollector = message.author.dmChannel.createMessageComponentCollector({
            componentType: 'BUTTON',
            time: ms('5m')
        })
        const submitCollector = submitNotiChannel.createMessageComponentCollector({
            componentType: 'BUTTON'
        })
        const messageCollector = message.author.dmChannel.createMessageCollector()
        let type = ''
        let ques = 0
        let ans = []

        buttonCollector.on('collect', async (interaction) => {
            if (!interaction.isButton) return
            if (interaction.customId !== 'submit-yes' && interaction.customId !== 'submit-no') {
                interaction.update({
                    embeds: [embed],
                    components: row(true)
                })
            }


            type = interaction.customId
            if (type === 'submit-1') {
                await data.updateOne({
                    type: type
                })
                ques = 1
                interaction.user.send({
                    embeds: [
                        embed1
                            .setTitle(
                                '❓ | Bạn muốn góp ý thêm gì cho bot ?'
                            )
                            .setDescription(
                                '❗ | Chỉ nhập tên lệnh.'
                            )
                    ]
                })
            } else if (type === 'submit-2') {
                await data.updateOne({
                    type: type
                })
                ques = 1
                interaction.user.send({
                    embeds: [
                        embed1
                            .setTitle(
                                '❓ | Bạn muốn chỉnh sửa lệnh nào ?'
                            )
                            .setDescription(
                                '❗ | Chỉ nhập tên lệnh.'
                            )
                    ]
                })
            } else if (type === 'submit-3') {
                await data.updateOne({
                    type: type
                })
                ques = 1
                interaction.user.send({
                    embeds: [
                        embed1
                            .setDescription(
                                '❗ | Chỉ nhập tên lệnh.'
                            )
                            .setTitle(
                                '❓ | Bạn muốn báo lỗi / bug của lệnh nào ?'
                            )
                    ]
                })
            } else if (type === 'submit-yes') {
                if (!data) return
                if (!ans) return
                const embed2 = new MessageEmbed()
                    .setAuthor({
                        name: `Góp ý cho ${client.user.tag}`,
                        iconURL: client.user.displayAvatarURL()
                    })
                    .setColor(
                        'RANDOM'
                    )
                    .setTimestamp()
                    .setTitle(
                        `1 submit từ ${interaction.user.tag}`
                    )
                try {
                    ans.forEach(async (data1) => {
                        if (data1.type === 'submit-1') {
                            if (data1.num == 1) {
                                embed2.addFields({
                                    name: `❓ | Bạn muốn góp ý thêm lệnh gì cho bot ?`,
                                    value: `>>> ${data1.submit}`
                                })
                                data.submit.push({
                                    question: '❓ | Bạn muốn góp ý thêm lệnh gì cho bot ?',
                                    answer: data1.submit,
                                    num: data1.num
                                })
                            } else if (data1.num == 2) {
                                embed2.addFields({
                                    name: `❓ | Bạn có thể mô tả chi tiết lệnh sẽ hoạt động như thế nào, tên gọi khác, v.v... không ?`,
                                    value: `>>> ${data1.submit}`
                                })
                                data.submit.push({
                                    question: '❓ | Mô tả, tên gọi khác, v.v..',
                                    answer: data1.submit,
                                    num: data1.num
                                })
                            }
                        } else if (data1.type === 'submit-2') {
                            if (data1.num == 1) {
                                embed2.addFields({
                                    name: `❓ | Bạn muốn chỉnh sửa lệnh gì cho bot ?`,
                                    value: `>>> ${data1.submit}`
                                })
                                data.submit.push({
                                    question: '❓ | Bạn muốn chỉnh sửa lệnh gì cho bot ?',
                                    answer: data1.submit,
                                    num: data1.num
                                })
                            } else if (data1.num == 2) {
                                embed2.addFields({
                                    name: `❓ | Bạn có thể mô tả chi tiết lệnh sẽ hoạt động như thế nào, tên gọi khác, v.v... không ?`,
                                    value: `>>> ${data1.submit}`
                                })
                                data.submit.push({
                                    question: '❓ | Mô tả, tên gọi khác, v.v..',
                                    answer: data1.submit,
                                    num: data1.num
                                })
                            }
                        }
                    })
                } catch (err) {

                } finally {
                    await data.save()
                }

                submitNotiChannel.send({
                    embeds: [
                        embed2
                    ],
                    components: row3(false)
                })
                interaction.reply('Đã gửi submit')
            } else if (interaction.customId === 'submit-no') {
                return interaction.reply('🔴 | Đã hủy submit !')
            }
        })

        messageCollector.on('collect', (msg) => {
            if (msg.inGuild() || msg.author.id !== message.author.id) return
            const content = msg.content
            if (type === 'submit-1') {
                if (ques == 1) {
                    ans.push({
                        type: type,
                        num: ques,
                        submit: content,
                    })
                    ques = 2
                    msg.react('👌')
                    msg.author.send({
                        embeds: [
                            embed1
                                .setTitle(
                                    '❓ | Bạn có thể mô tả chi tiết lệnh sẽ hoạt động như thế nào, tên gọi khác, v.v... không ?'
                                )
                                .setDescription(
                                    '🔽 | Vui lòng điền theo mẫu phía dưới!\n\nTên: \nTên gọi khác: \nMô tả: \n Cách hoạt động:'
                                )
                        ]
                    })
                } else if (ques == 2) {
                    console.log(content)
                    ans.push({
                        type: type,
                        num: ques,
                        submit: content
                    })
                    console.log('Pushed')
                    console.log(ans)
                    msg.react('👌')
                    const embed2 = new MessageEmbed()
                        .setAuthor({
                            name: `Góp ý cho ${client.user.tag}`,
                            iconURL: client.user.displayAvatarURL()
                        })
                        .setColor(
                            'RANDOM'
                        )
                        .setFooter({
                            text: `Người submit: ${msg.author.tag}`,
                            iconURL: msg.author.displayAvatarURL()
                        })
                        .setTimestamp()
                    ans.forEach((data) => {
                        if (data.num == 1) {
                            embed2.addFields({
                                name: `❓ | Bạn muốn góp ý thêm lệnh gì cho bot ?`,
                                value: `>>> ${data.submit}`
                            })
                        } else if (data.num == 2) {
                            embed2.addFields({
                                name: `❓ | Bạn có thể mô tả chi tiết lệnh sẽ hoạt động như thế nào, tên gọi khác, v.v... không ?`,
                                value: `>>> ${data.submit}`
                            })
                        }

                    })
                    msg.author.send({
                        content: 'Các submit của bạn sẽ như thế này',
                        embeds: [
                            embed2
                        ]
                    })
                    msg.author.send({
                        embeds: [
                            new MessageEmbed()
                                .setTitle(
                                    '❓ | Bạn có muốn submit xuất hiện như thế không ?'
                                )
                                .setColor('RANDOM')
                                .setAuthor({
                                    name: `Góp ý cho ${client.user.tag}`,
                                    iconURL: client.user.displayAvatarURL()
                                })
                        ],
                        components: row2(false)
                    })
                }
            } else if (type === 'submit-2') {
                if (ques == 1) {
                    ans.push({
                        type: type,
                        num: ques,
                        submit: content,
                    })
                    ques = 2
                    msg.react('👌')
                    msg.author.send({
                        embeds: [
                            embed1
                                .setTitle(
                                    '❓ | Bạn có thể mô tả chi tiết lệnh sẽ hoạt động như thế nào, tên gọi khác, v.v... không ?'
                                )
                                .setDescription(
                                    '🔽 | Vui lòng điền theo mẫu phía dưới!\n\nTên: \nTên gọi khác: \nMô tả: \nCách hoạt động:'
                                )
                        ]
                    })
                } else if (ques == 2) {
                    console.log(content)
                    ans.push({
                        type: type,
                        num: ques,
                        submit: content
                    })
                    console.log('Pushed')
                    console.log(ans)
                    msg.react('👌')
                    const embed2 = new MessageEmbed()
                        .setAuthor({
                            name: `Góp ý cho ${client.user.tag}`,
                            iconURL: client.user.displayAvatarURL()
                        })
                        .setColor(
                            'RANDOM'
                        )
                        .setFooter({
                            text: `Người submit: ${msg.author.tag}`,
                            iconURL: msg.author.displayAvatarURL()
                        })
                        .setTimestamp()
                    ans.forEach((data) => {
                        if (data.num == 1) {
                            embed2.addFields({
                                name: `❓ | Bạn muốn chỉnh sửa lệnh gì cho bot ?`,
                                value: `>>> ${data.submit}`
                            })
                        } else if (data.num == 2) {
                            embed2.addFields({
                                name: `❓ | Bạn có thể mô tả chi tiết lệnh sẽ hoạt động như thế nào, tên gọi khác, v.v... không ?`,
                                value: `>>> ${data.submit}`
                            })
                        }

                    })
                    msg.author.send({
                        content: 'Các submit của bạn sẽ như thế này',
                        embeds: [
                            embed2
                        ]
                    })
                    msg.author.send({
                        embeds: [
                            new MessageEmbed()
                                .setTitle(
                                    '❓ | Bạn có muốn submit xuất hiện như thế không ?'
                                )
                                .setColor('RANDOM')
                                .setAuthor({
                                    name: `Góp ý cho ${client.user.tag}`,
                                    iconURL: client.user.displayAvatarURL()
                                })
                        ],
                        components: row2(false)
                    })
                }
            } else if (type === 'submit-3') {
                if (ques == 1) {
                    ans.push({
                        type: type,
                        num: ques,
                        submit: content,
                    })
                    ques = 2
                    msg.react('👌')
                    msg.author.send({
                        embeds: [
                            embed1
                                .setTitle(
                                    '❓ | Bạn có thể gửi link hình ảnh chứa lỗi hay không ?'
                                )
                        ]
                    })
                } else if (ques == 2) {
                    ans.push({
                        type: type,
                        num: ques,
                        submit: content,
                    })
                    ques = 3
                    msg.react('👌')
                    msg.author.send({
                        embeds: [
                            embed1
                                .setTitle(
                                    '❓ | Bạn có phương hướng nào để sửa lỗi không ?'
                                )
                        ]
                    })
                } else if (ques == 3) {
                    console.log(content)
                    ans.push({
                        type: type,
                        num: ques,
                        submit: content
                    })
                    msg.react('👌')
                    const embed2 = new MessageEmbed()
                        .setAuthor({
                            name: `Góp ý cho ${client.user.tag}`,
                            iconURL: client.user.displayAvatarURL()
                        })
                        .setColor(
                            'RANDOM'
                        )
                        .setFooter({
                            text: `Người submit: ${msg.author.tag}`,
                            iconURL: msg.author.displayAvatarURL()
                        })
                        .setTimestamp()
                    ans.forEach((data) => {
                        if (data.num == 1) {
                            embed2.addFields({
                                name: `❓ | Bạn muốn báo lỗi / bug của lệnh ?`,
                                value: `>>> ${data.submit}`
                            })
                        } else if (data.num == 2) {
                            embed2.addFields({
                                name: `❓ | Bạn có thể gửi link hình ảnh chứa lỗi hay không ?`,
                                value: `>>> ${data.submit}`
                            })
                        } else if (data.num == 3) {
                            embed2.addFields({
                                name: `❓ | Bạn có phương hướng nào để sửa lỗi không ?`,
                                value: `>>> ${data.submit}`
                            })
                        }

                    })
                    msg.author.send({
                        content: 'Các submit của bạn sẽ như thế này',
                        embeds: [
                            embed2
                        ]
                    })
                    msg.author.send({
                        embeds: [
                            new MessageEmbed()
                                .setTitle(
                                    '❓ | Bạn có muốn submit xuất hiện như thế không ?'
                                )
                                .setColor('RANDOM')
                                .setAuthor({
                                    name: `Góp ý cho ${client.user.tag}`,
                                    iconURL: client.user.displayAvatarURL()
                                })
                        ],
                        components: row2(false)
                    })
                }
            }
        })

        submitCollector.on('collect', async (interaction) => {
            if (!data) return interaction.reply({
                content: '🛑 | Nothing there :c',
                ephemeral: true,
            })
            const embed2 = new MessageEmbed()
                .setAuthor({
                    name: `Góp ý cho OggyTheBot#8210`,
                    iconURL: client.user.avatarURL()
                })
                .setColor(
                    'RANDOM'
                )
                .setTimestamp()
                .setTitle(
                    `1 submit từ ${interaction.user.tag}`
                )
            if (data.type === 'submit-1') {
                data.submit.forEach(async (data1) => {
                    if (data1.num == 1) {
                        embed2.addFields({
                            name: `❓ | Bạn muốn góp ý thêm lệnh gì cho bot ?`,
                            value: `>>> ${data1.answer}`
                        })
                    } else if (data1.num == 2) {
                        embed2.addFields({
                            name: `❓ | Bạn có thể mô tả chi tiết lệnh sẽ hoạt động như thế nào, tên gọi khác, v.v... không ?`,
                            value: `>>> ${data1.answer}`
                        })
                    }

                })
            } else if (data.type === 'submit-2') {
                data.forEach(async (data1) => {
                    if (data1.num == 1) {
                        embed2.addFields({
                            name: `❓ | Bạn muốn chỉnh sửa lệnh gì cho bot ?`,
                            value: `>>> ${data1.answer}`
                        })
                    } else if (data1.num == 2) {
                        embed2.addFields({
                            name: `❓ | Bạn có thể mô tả chi tiết lệnh sẽ hoạt động như thế nào, tên gọi khác, v.v... không ?`,
                            value: `>>> ${data1.answer}`
                        })
                    }

                })
            } else if (data.type === 'submit-3') {
                data.submit.forEach((data1) => {
                    if (data1.num == 1) {
                        embed2.addFields({
                            name: `❓ | Bạn muốn báo lỗi / bug của lệnh ?`,
                            value: `>>> ${data.submit}`
                        })
                    } else if (data1.num == 2) {
                        embed2.addFields({
                            name: `❓ | Bạn có thể gửi link hình ảnh chứa lỗi hay không ?`,
                            value: `>>> ${data.submit}`
                        })
                    } else if (data1.num == 3) {
                        embed2.addFields({
                            name: `❓ | Bạn có phương hướng nào để sửa lỗi không ?`,
                            value: `>>> ${data.submit}`
                        })
                    }

                })
            }
            const row3 = (state) => [
                new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('submit-accept')
                            .setLabel('📩 Gửi đi')
                            .setDisabled(state)
                            .setStyle('SUCCESS')
                    )
                    .addComponents(
                        new MessageButton()
                            .setCustomId('submit-reject')
                            .setLabel('❌ Từ chối')
                            .setDisabled(state)
                            .setStyle('DANGER')
                    )
            ]

            if (interaction.customId === 'submit-accept') {

                interaction.update({
                    embeds: [
                        embed2.setFooter({
                            text: `✅ | Đã gửi !`,
                            iconURL: client.user.avatarURL()
                        })
                    ],
                    components: row3(true),
                })
                message.author.send({
                    content: '✅ | Submit của bạn đã được chấp thuận'
                })
                submit.findOneAndDelete({
                    _id: data._id
                }, async (err, data1) => {
                    if (err) throw err;
                    if (data1) {
                        data1.save()
                    }
                })

            } else if (interaction.customId === 'submit-reject') {
                
                interaction.update({
                    embeds: [
                        embed2.setFooter({
                            text: `🔽 | Vui lòng nhập lý do !`,
                            iconURL: client.user.displayAvatarURL()
                        })
                    ],
                    components: row3(true),
                })

                const collector = interaction.channel.createMessageCollector()

                collector.on('collect', (msg) => {
                    if (msg.author.id !== '692271452053045279') return
                    message.author.send({
                        content: '🛑 | Submit của bạn bị từ chối!\n🔽 | Lý do: \n>>>' + msg.content
                    })
                    submit.findOneAndDelete({
                        _id: data1._id
                    }, async (err, data1) => {
                        if (err) throw err;
                        if (data1) {
                            data1.save()
                        }
                    })
                })

            }
        })

        buttonCollector.on('end', () => {
            mess.edit({
                embeds: [
                    embed.setFooter({ text: 'Time out !' })
                ],
                components: row(true)
            })
        })
    }
}