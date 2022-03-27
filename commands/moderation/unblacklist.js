const blacklist = require('../../models/blacklist')
const blacklistguild = require('../../models/blacklist-guild')
const { Message, MessageEmbed } = require('discord.js')
const ms = require('ms')

module.exports = {
    name: 'unblacklist',
    category: 'moderation',
    description: 'OWNER BOT ONLY',
    /**
     * @param {Message} message 
     */
    run: async (client, message, args) => {
        if (args[0] === 'user') {
            if (message.author.id !== '692271452053045279') return message.channel.send('BOT OWNER ONLY')
            let User
            if (isNaN(args[2])) {
                const User = message.mentions.members.first()
            } else {
                const User = message.guild.members.cache.get(args[0])
            }
            if (!User) return message.channel.send('Vui lòng ghi tag user.')
            let reason = args.slice(2).join(" ");
            if (!reason) reason = "Không có lý do.";

            blacklist.findOneAndDelete({ id: User.user.id }, async (err, data) => {
                if (err) throw err;
                if (data) {
                    const embed = new MessageEmbed()
                        .setTitle('Người dùng đã được gỡ blacklist')
                        .addFields({
                            name: 'Username',
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
                    message.reply({embeds :[embed]})
                    User.send(embed)
                } else {
                    message.channel.send('Người dùng chưa bị blacklist. Vui lòng dùng lệnh blacklist để blacklist.')
                }
            })
        } else if (args[0] === 'guild') {
            if (message.author.id !== '692271452053045279') return message.channel.send('BOT OWNER ONLY')
            var User = client.guilds.cache.get(args[1])
            if (!User) return message.channel.send('Vui lòng ghi ID của guild.')
            let reason = args.slice(2).join(" ");
            if (!reason) reason = "Không có lý do.";
            blacklistguild.findOneAndDelete({ id: User.id }, async (err, data) => {
                if (err) throw err;
                if (!data) {
                    message.channel.send(`**${User.name}** chưa bị blacklist`)
                } else {
                    blacklistguild.findOneAndDelete({
                        guildid: User.id
                    })
                    data.save()
                        .catch(err => console.log(err))
                    const embed = new MessageEmbed()
                        .setTitle('Guild đã được gỡ blacklist')
                        .addFields({
                            name: 'Guild Name',
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
                    message.reply({embeds :[embed]})
                }
            })
        }
    }
}