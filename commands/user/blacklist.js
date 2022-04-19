const blacklist = require('../../models/blacklist')
// const blacklistguild = require('../../models/blacklist-guild')
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
    }
}