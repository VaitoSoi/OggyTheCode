const { MessageEmbed } = require('discord.js')
const setchannel = require('../../models/setchannel')

module.exports = {
    name: 'unban',
    category: 'moderation',
    aliases: ['gocam', 'bocam'],
    description: 'Gỡ cấm 1 thành viên',
    permissions: ['BAN_MEMBERS'],
    run: async (client, message, args) => {
        if (!message.member.permissions.has("BAN_MEMBERS")) return message.channel.send('Bạn không có quyền `BAN_MEMBERS`')
        if (!message.guild.me.permissions.has("BAN_MEMBERS")) return message.channel.send('Tôi không có quyền `BAN_MEMBERS`')
        let userid = args[0];
        if (!userid) return message.reply('Vui lòng nhập id của thành viên bạn muốn gỡ cấm.')
        let reason = args.slice(1).join(" ");
        if (!reason) reason = "Không có lý do."
        if (userid === message.author.id) return message.channel.send('Bạn không thể gỡ cấm cho bản thân bạn.')
        let bans = await message.guild.bans.fetch();
        setchannel.findOne({ guildid: message.guild.id }, async (err, data) => {
            if (err) throw err;
            if (data) {
                if (data.ban !== 'No data') {
                    const Channel = message.guild.channels.cache.get(data.ban)
                    message.channel.send(`Đã gỡ cấm cho ${userid}\nXem thêm tại <#${data.ban}>`)
                    if (!bans.has(userid)) {
                        message.guild.members.unban(userid)
                        Channel.send(new MessageEmbed()
                            .setTitle('Người dùng đã bị ban')
                            .addFields({
                                    name: 'UserID',
                                    value: `${args[0]}`,
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
                        )
                    } else {
                        message.channel.send('UserID không hợp lệ hoặc không bị cấm.')
                    }
                } else {
                    if (bans.has(userid)) {
                        message.guild.members.unban(userid)
                        message.reply(new MessageEmbed()
                            .setTitle('Người dùng đã được gỡ ban')
                            .addFields({
                                    name: 'UserID',
                                    value: `${args[0]}`,
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
                        )
                    } else {
                        message.channel.send('UserID không hợp lệ hoặc không bị cấm.')
                    }
                }
            } else {
                if (bans.has(userid)) {
                    message.guild.members.unban(userid)
                    message.reply(new MessageEmbed()
                        .setTitle('Người dùng đã bị ban')
                        .addFields({
                                name: 'UserID',
                                value: args[0],
                                inline: true
                            },
                            {
                                name: 'Bởi: ',
                                value: `**${message.author.tag}**`,
                                inline: true
                            },
                            {
                                name: 'Lý do',
                                value: reason,
                                inline: true
                            })
                        .setColor('BLUE')
                    )
                } else {
                    message.channel.send('UserID không hợp lệ hoặc không bị cấm.')
                }
            }
        })
    }
}