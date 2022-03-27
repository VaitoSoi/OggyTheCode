const db = require('../../models/warns')
const { Message, MessageEmbed } = require('discord.js')

module.exports = {
    name: 'warns',
    category: 'moderation',
    description: 'Xem người dùng đã bị cảnh cáo bao nhiêu lần.',
    /**
     * @param {Message} message 
     */
    run: async(client, message, args) => {
        let user
        if (isNaN(args[2])) {
            const user = message.mentions.members.first()
        } else {
            const user = message.guild.members.cache.get(args[0])
        }
        db.findOne({ guildid: message.guild.id, user: user.user.id }, async (err, data) => {
            if (err) throw err;
            if(data) {
                message.reply(new MessageEmbed()
                    .setTitle(`${user.user.tag}'s warns'`)
                    .setDescription(
                        data.content.map(
                            (w, i) =>
                            `\`${i + 1}\` | Moderator: ${message.guild.members.cache.get(w.moderator).user.tag}\nReason : ${w.reason}`
                        )
                    )
                    .setColor('BLUE')
                )
            } else {
                message.channel.send('Không tìm thấy data của người dùng.')
            }
        })
    }
}