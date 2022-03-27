const db = require('../../models/warns')
const { Message, MessageEmbed } = require('discord.js')
const setchannel = require('../../models/setchannel')

module.exports = {
    name: 'warn',
    category: 'moderation',
    description: 'Dùng dể cảnh cáo ai đó',
    permissions: ['MANAGE_MESSAGES'],
    /**
     * @param {Message} message 
     */
    run: async (client, message, args) => {
        if (!message.member.permissions.has("MANAGE_MESSAGES")) return message.channel.send('Bạn không có quyền `MANAGE_MESSAGES`')
        if (!message.guild.me.permissions.has("MANAGE_MESSAGES")) return message.channel.send('Tôi không có quyền `MANAGE_MESSAGES`')
        let user
        if (isNaN(args[2])) {
            const user = message.mentions.members.first()
        } else {
            const user = message.guild.members.cache.get(args[0])
        }
        if (!user) return message.channel.send('Tag cái thằng m muốn cảnh cáo NHANH. Ko tag bt warn đứa nào đâu chời.')
        let reason = args.slice(1).join(" ");
        if (!reason) reason = "Không có lý do.";
        db.findOne({ guildid: message.guild.id, user: user.user.id }, async (err, data) => {
            if (err) throw err;
            if (!data) {
                data = new db({
                    guildid: message.guild.id,
                    user: user.user.id,
                    content: [
                        {
                            moderator: message.author.id,
                            reason: reason
                        }
                    ]
                })
            } else {
                const obj = {
                    moderator: message.author.id,
                    reason: reason
                }
                data.content.push(obj)
            }
            data.save()
        })
        const embed = new MessageEmbed()
            .setTitle('Bạn đã bị cảnh cáo')
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
            .setColor('RED')

        setchannel.findOne({ guilid: message.guild.id }, async (err, data) => {
            if (err) throw err;
            if (data) {
                if (data.warn !== 'No data') {
                    const Channel = message.guild.channels.cache.get(data.warn)
                    message.channel.send(`Đã warn ${user.displayName}\nXem thêm tại <#${data.ban}>`)
                    user.send(embed)
                    Channel.send(embed)
                } else {
                    user.send(embed)
                    message.reply({embeds :[embed]})
                }
            } else {
                user.send(embed)
                message.reply({embeds :[embed]})
            }
        })
    }
}