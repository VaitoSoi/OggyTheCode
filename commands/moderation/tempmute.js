const { Message, MessageEmbed } = require('discord.js')
const ms = require('ms')
const setchannel = require('../../models/setchannel')

module.exports = {
    name: 'tempmute',
    category: 'moderation',
    aliases: ['khoamiengtamthoi', 'khoamomtamthoi', 'camchattamthoi', 'tempmute'],
    decription: 'Cấm chat 1 thành viên tạm thời',
    permissions: ['MANAGE_ROLES'],
    /**
     * @param {Message} message
     */
    run: async (client, message, args) => {
        if (!message.member.permissions.has("MANAGE_ROLES")) return message.channel.send('Bạn không có quyền `MANAGE_ROLES`')
        if (!message.guild.me.permissions.has("MANAGE_ROLES")) return message.channel.send('Tôi không có quyền `MANAGE_ROLES`')
        let Member
        if (isNaN(args[2])) {
            const Member = message.mentions.members.first()
        } else {
            const Member = message.guild.members.cache.get(args[0])
        }
        const time = args[1]
        if (!time) return message.channel.send('Muốn mute vĩnh viễn thì sài mute, ko thì cho t bt mute nó bao nhiêu ngày để t còn mute chứ.')
        if (!Member) return message.channel.send('Dzô dziên. Ko tag thằng m muốn mute sao t bt mute ai.')
        const role = message.guild.roles.cache.find(role => role.name.toLocaleLowerCase() === 'muted')
        let reason = args.slice(2).join(" ");
        if (!reason) reason = "Không có lý do.";
        if (!role) {
            try {
                message.channel.send('Không tìm thấy role muted.Đang tự động tạo role mute.')

                let muterole = await message.guild.roles.create({
                    data: {
                        name: 'muted',
                        permissions: [],
                    }
                });
                message.guild.channels.cache.filter(c => c.type === 'text').forEach(async (channel, id) => {
                    await channel.createOverwrite(muterole, {
                        SEND_MESSAGES: false,
                        ADD_REACTIONS: false,
                    })
                });
                message.channel.send('Đã tự động tạo role Muted.')
            } catch (error) {
                console.log(error)
            }
        }
        let role2 = message.guild.roles.cache.find(r => r.name.toLocaleLowerCase() === 'muted')
        if (Member.roles.cache.has(role2.id)) return message.channel.send(`${Member.displayName} đã bị muted`)
        await Member.roles.add(role2)
        const embed = new MessageEmbed()
        .setTitle('Người dùng đã bị mute')
        .addFields({
            name: 'Guild Name',
            value: `${message.guild.name}`,
            inline: true,
        },
        {
            name: 'Username',
            value: Member.user.username,
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
    
        setchannel.findOne({ guildid: message.guild.id }, async (err, data) => {
            if (err) throw err;
            if (data) {
                if (data.mute !== 'No data') {
                    const Channel = message.guild.channels.cache.get(data.mute)
                    message.channel.send(`Đã mute ${Member.displayName}\nXem thêm tại <#${data.mute}>`)
                    Channel.send(embed)
                    Member.send(embed)

                    setTimeout(async () => {
                        await Member.roles.remove(role2)
                        Channel.send(`Đã tự động gỡ mute cho ${Member.displayName}`)
                    }, ms(time))
                } else {
                    message.reply({embeds :[embed]})
                    Member.send(embed)

                    setTimeout(async () => {
                        await Member.roles.remove(role2)
                        message.channel.send(`Đã tự động gỡ mute cho ${Member.displayName}`)
                    }, ms(time))
                }
            } else {
                message.reply({embeds :[embed]})
                Member.send(embed)

                setTimeout(async () => {
                    await Member.roles.remove(role2)
                    message.channel.send(`Đã tự động gỡ mute cho ${Member.displayName}`)
                }, ms(time))
            }
        })
    }
}