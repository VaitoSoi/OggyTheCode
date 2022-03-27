const blacklist = require('../../models/blacklist')
const blacklistguild = require('../../models/blacklist-guild')
const { Message, MessageEmbed } = require('discord.js')
const ms = require('ms')

module.exports = {
    name: 'blacklist',
    category: 'moderation',
    description: 'OWNER BOT ONLY',
    /**
     * @param {Message} message 
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        if (args[0] === 'user') {
            if (message.author.id !== '692271452053045279') return message.channel.send('**BOT OWNER ONLY**')
            let User
            if (isNaN(args[1])) {
                User = message.mentions.members.first()
            } else {
                User = message.guild.members.cache.get(args[1])
            }
            if (!User) return message.channel.send('Không phát hiện User !')
            let reason = args.slice(2).join(" ");
            if (!reason) reason = "Không có lý do.";
            blacklist.findOne({ id: User.user.id }, async (err, data) => {
                if (err) throw err;
                if (data) {
                    message.channel.send(`**${User.displayName}** đã bị blacklist`)
                } else {
                    data = new blacklist({
                        id: User.user.id,
                        name: User.displayName,
                        reason: reason,
                        by: message.author.tag
                    })
                    data.save()
                        .catch(err => console.log(err))
                    const embed1 = new MessageEmbed()
                        .setTitle('Người dùng đã bị blacklist').addFields({
                            name: 'Username',
                            value: `${User.name}`,
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
                    message.reply(embed1)
                    User.send(embed1)
                }
            })
        } else if (args[0] === 'guild') {
            if (message.author.id !== '692271452053045279') return message.channel.send('BOT OWNER ONLY')
            const User = client.guilds.cache.get(args[1])
            if (!User) return message.channel.send('Vui lòng ghi ID của guild.')
            let reason = args.slice(2).join(" ");
            if (!reason) reason = "Không có lý do.";
            blacklistguild.findOne({ id: User.id }, async (err, data) => {
                if (err) throw err;
                if (data) {
                    message.channel.send(`**${User.name}** đã bị blacklist`)
                } else {
                    data = new blacklistguild({
                        guildid: User.id,
                        name: User.name,
                        reason: reason
                    })
                    data.save()
                        .catch(err => console.log(err))
                    const embed1 = new MessageEmbed()
                        .setTitle('Guild đã bị blacklist')
                        .addFields({
                            name: 'Guildname',
                            value: User.name,
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
                    message.reply(embed1)
                    if (User.id === message.guild.id) {
                        message.channel.send('Rời guild sau 5s.....').then(async (msg) => {
                            console.log('Rời guild sau 5s.....')
                            setTimeout(() => {
                                msg.edit('Rời guild sau 4s....')
                                console.log('Rời guild sau 4s....')
                            }, ms('1s'))
                            setTimeout(() => {
                                msg.edit('Rời guild sau 3s...')
                                console.log('Rời guild sau 3s...')
                            }, ms('1s'))
                            setTimeout(() => {
                                msg.edit('Rời guild sau 2s..')
                                console.log('Rời guild sau 2s..')
                            }, ms('1s'))
                            setTimeout(() => {
                                msg.edit('Rời guild sau 1s.')
                                console.log('Rời guild sau 1s.')
                            }, ms('1s'))
                            setTimeout(() => {
                                msg.edit('Đang rời guild')
                                console.log('Đang rời guild')
                                User.leave()
                            }, 1500)
                        })
                        let defaultChannel = "";
                        guild.channels.cache.map(channel => channel).forEach((channel) => {
                            if (channel.type == "text" && defaultChannel == "") {
                                if (channel.permissionsFor(guild.me).has("SEND_MESSAGES")) {
                                    defaultChannel = channel;
                                }
                            }
                        })
                        defaultChannel.send(embed)
                        defaultChannel.send('Rời guild sau 5s.....').then(async (msg) => {
                            console.log('Rời guild sau 5s.....')
                            setTimeout(() => {
                                msg.edit('Rời guild sau 4s....')
                                console.log('Rời guild sau 4s....')
                            }, ms('1s'))
                            setTimeout(() => {
                                msg.edit('Rời guild sau 3s...')
                                console.log('Rời guild sau 3s...')
                            }, ms('1s'))
                            setTimeout(() => {
                                msg.edit('Rời guild sau 2s..')
                                console.log('Rời guild sau 2s..')
                            }, ms('1s'))
                            setTimeout(() => {
                                msg.edit('Rời guild sau 1s.')
                                console.log('Rời guild sau 1s.')
                            }, ms('1s'))
                            setTimeout(() => {
                                msg.edit('Đang rời guild')
                                console.log('Đang rời guild')
                                User.leave()
                            }, 1500)
                        })
                    }
                }
            })
        } else {
            message.channel.send('Unknow command')
        }
    }
}