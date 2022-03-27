const db = require('../../models/warns')
const setchannel = require('../../models/setchannel')
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'remove-warn',
    category: 'moderation',
    aliases: ['delete-warn', 'rmv-warn', 'removewarn'],
    descrtiption: 'Thu hồi 1 lệnh cảnh cáo.',
    permissions: ['MANAGE_MESSAGES'],
    run: async (client, message, args) => {
        if (!message.member.permissions.has("MANAGE_MESSAGES")) return message.channel.send('Bạn không có quyền `MANAGE_MESSAGES`')
        if (!message.guild.me.permissions.has("MANAGE_MESSAGES")) return message.channel.send('Tôi không có quyền `MANAGE_MESSAGES`')
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!user) return message.channel.send('Tag cái thằng m muốn gỡ cảnh cáo NHANH. Ko tag bt gỡ đứa nào đâu chời.')
        const embed = new MessageEmbed()
            .setTitle('Người dùng đã đc thu hồi 1 cảnh cáo')
            .addFields({
                name: 'Guild Name',
                value: `${message.guild.name}`,
                inline: true,
            },
            {
                name: 'Username',
                value: `${user.user.username}`,
                inline: true
            },
                {
                    name: 'Bởi: ',
                    value: `**${message.author.tag}**`,
                    inline: true
                },
                {
                    name: 'Lý do',
                    value: `${reason}`,
                    inline: true
                })
            .setColor('BLUE')
        db.findOne({ guildid: message.guild.id, user: user.user.id }, async (err, data) => {
            if (err) throw err;
            if (data) {
                data.content.splice(0, 1)
                data.save()
                setchannel.findOne({ guilid: message.guild.id }, async (err, data) => {
                    if (err) throw err;
                    if (data) {
                        if (data.warn !== 'No data') {
                            const channel = message.guild.channels.cache.get(data.warn)
                            message.channel.send(`Đã thu hồi 1 lệnh cảnh cáo của ${user.user.name}\nXem thêm tại <#${data.ban}>`)
                            message.channel.send({ embeds: [embed]})
                            user.send(embed)
                        } else {
                            message.channel.send({embed})
                            user.send(embed)
                        }
                    } else {
                        message.channel.send({ embeds: [embed]})
                        user.send(embed)
                    }
                })
                data.save()
            } else {
                message.channel.send('Người dùng hiện tại không bị cảnh cáo')
            }
        })
    }
}