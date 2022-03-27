const { Message, MessageEmbed } = require('discord.js')
const setchannel = require('../../models/setchannel')

module.exports = {
    name: 'unmute',
    category: 'moderation',
    aliase: ['mokhoamieng', 'bokhoamom', 'chochatlai', 'gocamchat'],
    description: 'Mở khóa mõm cho 1 thg nào đó.',
    permissions: ['MANAGE_ROLES'],
    /**
     * @param {Message} message 
     */
    run: async (client, message, args) => {
        let Member
        if (isNaN(args[2])) {
            const Member = message.mentions.members.first()
        } else {
            const Member = message.guild.members.cache.get(args[0])
        }
        if (!Member) return message.channel.send('Vui lòng ghi ID hoặc Tag của người muốn mute')
        let role = message.guild.roles.cache.find(r => r.name.toLocaleLowerCase() === 'muted')
        await Member.roles.remove(role)
        let reason = args.slice(1).join(" ");
        if (!reason) reason = "Không có lý do.";
        const embed = new MessageEmbed()
            .setTitle('Người dùng đã đc gỡ mute')
            .addFields({
                name: 'Guild Name',
                value: `${message.guild.name}`,
                inline: true,
            },
            {
                name: 'Username',
                value: `${Member.user.username}`,
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
        setchannel.findOne({ guildid: message.guild.id }, async (err, data) => {
            if (err) throw err;
            if (data) {
                if (data.mute !== 'No data') {
                    const Channel = message.guild.channels.cache.get(data.mute)
                    message.channel.send(`Đã unmute ${Member.displayName}\nXem thêm tại <#${data.mute}>`)
                    Channel.send(embed)
                    Member.send(embed)
                } else {
                    message.reply({embeds :[embed]})
                    Member.send(embed)
                }
            } else {
                message.reply({embeds :[embed]})
                Member.send(embed)
            }
        })
    }
}