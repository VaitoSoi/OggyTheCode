const { MessageEmbed } = require('discord.js')
const setchannel = require('../../models/setchannel')

module.exports = {
    name: 'kick',
    category: 'moderation',
    aliases: ['duoi'],
    description: 'Dùng dể cấm ai đó',
    permissions: ['KICK_MEMBERS'],
    run: async (client, message, args) => {
        if (!message.member.permissions.has("KICK_MEMBERS")) return message.channel.send('Bạn không có quyền `KICK_USERS`')
        if (!message.guild.me.permissions.has("KICK_MEMBERS")) return message.channel.send('Tôi không có quyền `KICK_USERS`')
        let member = message.mentions.members.first();
        if (!member) return message.channel.send('Vui lòng mention(tag) người bạn muốn đuổi.')
        let reason = args.slice(1).join(" ");
        if (!reason) reason = "Không có lý do."
        const embed = new MessageEmbed()
            .setTitle('Bạn đã bị đuổi!')
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
        setchannel.findOne({ guilid: message.guild.id }, async (err, data) => {
            if (err) throw err;
            if (data) {
                if (data.kick !== 'No data') {
                    const Channel = message.guild.channels.cache.get(data.kick)
                    message.channel.send(`Đã kick ${member.displayName}`)
                    if (member.kickable) {
                        member.send(embed).catch(error => Channel.send('Không thể gửi tin nhắn cho thành viên được mention(tags)!'))
                            .then(m => member.kick({ reason }))
                        Channel.send(embed)
                    } else {
                        message.reply('Không thể đuổi thành viên được mention(tag)!')
                    }
                } else {
                    if (member.kickable) {
                        member.send(embed).catch(error => message.channel.send('Không thể gửi tin nhắn cho thành viên được mention(tags)!'))
                            .then(m => member.kick({ reason }))
                        message.reply({embeds :[embed]})
                    } else {
                        message.reply('Không thể đuổi thành viên được mention(tag)!')
                    }
                }
            } else {
                    if (member.kickable) {
                        member.send(embed).catch(error => message.channel.send('Không thể gửi tin nhắn cho thành viên được mention(tags)!'))
                            .then(m => member.kick({ reason }))
                        const embed1 = new MessageEmbed()
                            .setTitle('Đã đuổi!')
                            .setDescription(`Đã đuổi **${member.displayName}** \nLý do: '**${reason}**'\nNgười đuổi ${message.author}`)
                            .setAuthor({ name: `${client.user.tag}`, iconURL: client.user.avatarURL() })
                        message.reply(embed1)
                    } else {
                        message.reply('Không thể đuổi thành viên được mention(tag)!')
                    }
                }
        })
    }
}