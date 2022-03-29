const { Message, MessageEmbed } = require('discord.js')
const channel = require('../../models/setchannel')
const setrole = require('../../models/setrole')

module.exports = {
    name: 'mute',
    category: 'moderation',
    aliases: ['khoamieng', 'khoamom', 'camchat'],
    decription: 'Cấm chat 1 thành viên vĩnh viễn',
    permissions: ['MANAGE_ROLES'],
    /**
     * @param {Message} message
     */
    run: async (client, message, args) => {
        let role = ''
        const data = await setrole.findOne({
            guildid: message.guild.id
        })
        if (data) {
            role = message.guild.roles.cache.get(data.mute)
            if (!role) return message.channel.send('Role được cho không hợp lệ!')
        } else {
            message.channel.send('Vui lòng cài role dùng lệnh `set role <loại> <id>`')
        }
        if (!message.member.permissions.has("MANAGE_ROLES")) return message.channel.send('Bạn không có quyền `MANAGE_ROLES`')
        if (!message.guild.me.permissions.has("MANAGE_ROLES")) return message.channel.send('Tôi không có quyền `MANAGE_ROLES`')
        let Member
        if (isNaN(args[2])) {
            const Member = message.mentions.members.first()
        } else {
            const Member = message.guild.members.cache.get(args[0])
        }
        if (!Member) return message.channel.send('Vui lòng ghi ID hoặc Tag người cần mute!')
        let reason = args.slice(1).join(" ");
        if (!reason) reason = "Không có lý do.";
        if (Member.roles.cache.has(role.id)) return message.channel.send(`${Member.displayName} đã bị muted`)
        await Member.roles.add(role1)
        const embed = new MessageEmbed()
            .setTitle('Người dùng đã bị mute')
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
            .setColor('BLUE')
        channel.findOne({ guildid: message.guild.id }, async (err, data) => {
            if (err) throw err;
            if (data) {
                if (data.mute !== 'No data') {
                    const Channel = message.guild.channels.cache.get(data.mute)
                    message.channel.send(`Đã mute ${Member.displayName}.\nXem thên tại <#${data.mute}>`)
                    Channel.send(embed)
                } else {
                    message.reply({ embeds: [embed] })
                }
            }
        })
        Member.send(embed)
    }
}