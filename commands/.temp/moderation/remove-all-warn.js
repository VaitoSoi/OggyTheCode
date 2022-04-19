const db = require('../../models/warns')
const setchannel = require('../../models/setchannel')
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'remove-all-warn',
    category: 'moderation',
    aliases: ['delete-all-warn', 'rmv-all-warn', 'removeallwarn'],
    descrtiption: 'Thu hồi 1 lệnh cảnh cáo.',
    permissions: ['MANAGE_MESSAGES'],
    run: async (client, message, args) => {
        let user
        if (!message.member.permissions.has("MANAGE_MESSAGES")) return message.channel.send('Bạn thiếu quyền `MANAGE_MESSAGES`')
        if (isNaN(args[0])) {
            user = message.mentions.members.first()
        } else {
            user = message.guild.members.cache.get(args[0])
        }
        if (!user) return message.channel.send('Vui lòng ghi tag user')
        const embed = new MessageEmbed()
            .setTitle('Người dùng đã được thu hồi tất cả cảnh cáo')
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
        db.findOneAndDelete({ guildid: message.guild.id, user: user.user.id }, async (err, data) => {
            if (err) throw err;
            if (data) {
                data.save()
                setchannel.findOne({ guilid: message.guild.id }, async (err, data) => {
                    if (err) throw err;
                    if (data) {
                        if (data.warn !== 'No data') {
                            const channel = message.guild.channels.cache.get(data.warn)
                            message.channel.send(`Đã thu hồi tất cả lệnh cảnh cáo của ${user.user.name}\nXem thêm tại <#${data.ban}>`)

                            channel.send(embed)
                            user.send(embed)
                        } else {
                            message.reply({ embeds: [embed] })
                            user.send(embed)
                        }
                    } else {
                        message.reply({ embeds: [embed] })
                        user.send(embed)
                    }
                })
            } else {
                message.channel.send('Người dùng không bị cảnh cáo.')
            }
        })
    }
}