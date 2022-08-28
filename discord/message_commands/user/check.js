const { Client, Message, MessageEmbed } = require('discord.js')

module.exports = {
    name: 'check',
    description: 'Kiểm tra xem user có bị chặn không',
    usage: '<user>',
    /**
    * 
    * @param {Client} client 
    * @param {Message} message 
    * @param {String[]} args 
    */
    run: async (client, message, args) => {
        const db = require('../../../models/blacklist')
        if (!args[1]) return message.reply('🛑 | Thiếu User!')
        const user = args[1].isNaN ? message.mentions.users.first() : client.users.cache.get(args[1])
        if (!user) return message.reply('🛑 | User không hợp lệ!')
        let data = await db.findOne({ id: user.id })
        if (!data) return message.reply({ content: `🛑 | ${user} chưa bị chặn.` })
        message.reply({
            embeds: [
                new MessageEmbed()
                    .setTitle('User Blacklist')
                    .setThumbnail(user.displayAvatarURL())
                    .setFooter({
                        text: `${message.author.tag}`,
                        iconURL: message.author.displayAvatarURL()
                    })
                    .setAuthor({
                        name: client.user.tag,
                        iconURL: client.user.displayAvatarURL()
                    })
                    .setColor('RANDOM')
                    .setDescription(
                        'Thông tin về User bị blacklist\n' +
                        `Tag: \`${user.tag}\`\n` +
                        `UserID: \`${user.id}\`\n` +
                        `Lý do: \`${data.reason}\`\n` +
                        `Bởi: \`${data.by}\`\n` +
                        `Loại: \`${data.type ? data.type : 'all'}\`\n` +
                        `Lúc: ${data.at
                            ? `<t:${data.at}:f> (<t:${data.at}:R>)` : `\`¯\\_(ツ)_/¯\``}\n` +
                        `Hết hạn: ${data.end.toLowerCase() != 'vĩnh viễn'
                            ? `<t:${data.end}:f> (<t:${data.end}:R>)` : `\`${data.end}\``}`
                    )
                    .setTimestamp()
            ]
        })

    }
}