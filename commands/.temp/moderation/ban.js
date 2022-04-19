const { MessageEmbed } = require('discord.js')
const setchannel = require('../../models/setchannel')

module.exports = {
    name: 'ban',
    aliases: ['cam'],
    description: 'Dùng dể cấm ai đó',
    permissions: ['BAN_MEMBERS'],
    run: async (client, message, args) => {
        if (!message.guild.me.permissions.has('BAN_MEMBERS')) return message.reply('🛑 | Bot thiếu quyền `BAN_MEMBERS`')
        if (!message.member.permissions.has('BAN_MEMBERS')) return message.reply('🛑 | Bạn thiếu quyền `BAN_MEMBERS`')
        let member
        if (isNaN(args[2])) {
            const member = message.mentions.members.first()
        } else {
            const member = message.guild.members.cache.get(args[0])
        }
        if (!member) return message.channel.send('Tag cái thằng m muốn cấm NHANH.')
        let reason = args.slice(1).join(" ");
        if (!reason) reason = "Không có lý do."
        const embed = new MessageEmbed()
            .setTitle('Bạn đã bị cấm!')
            .addFields({
                name: 'Guild Name',
                value: `${message.guild.name}`,
                inline: true,
            },
                {
                    name: 'Username',
                    value: `${member.user.username}`,
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
            .setAuthor({ name: `${client.user.tag}`, iconURL: client.user.avatarURL() })

        let data = setchannel.finOne({ guilid: message.guild.id })
        if (!data) data = require('../../models/option').findOne({ guildid: message.guild.id})
        if (data) {
            if (data.ban !== 'No data') {
                if (member.bannable) {
                    const channel = message.guild.channels.cache.get(data.config.channels.ban ? data.config.channels.ban : data.ban)
                    member.send(embed).catch(error => message.channel.send('Không thể gửi tin nhắn cho thành viên được mention(tags)!'))
                        .then(m => member.ban({ reason }))
                    message.reply({ embeds: [embed] })
                    channel.send({ embeds: [embed] })
                } else {
                    message.reply('Không thể cấm thành viên được mention(tag)!')
                }
            } else {
                if (member.bannable) {
                    member.send(embed).catch(error => message.channel.send('Không thể gửi tin nhắn cho thành viên được mention(tags)!'))
                        .then(m => member.ban({ reason }))
                    message.reply({ embeds: [embed] })
                } else {
                    message.reply('Không thể cấm thành viên được mention(tag)!')
                }
            }
        } else {
            if (member.bannable) {
                member.send(embed).catch(error => message.channel.send('Không thể gửi tin nhắn cho thành viên được mention(tags)!'))
                    .then(m => member.ban({ reason }))
                message.reply({ embeds: [embed] })
            } else {
                message.reply('Không thể cấm thành viên được mention(tag)!')
            }
        }
    }
}