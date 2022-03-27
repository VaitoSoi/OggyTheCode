const { client } = require('../../index')
const { Message, MessageEmbed } = require('discord.js')
const blacklist = require('../../models/blacklist')

module.exports = {
    name: 'say',
    aliases: ['s'],
    description: `T sẽ thay mày nói những điều thầm kín của m :>`,
    usage: `<lời m muốn t nói dùm m>`,
    category: 'user',
    /**
     * 
     * @param {client} client 
     * @param {Message} message 
     */
    run: (client, message, args) => {
        const regex1 = /^<@(.+)>$/
        const regex2 = /^<@!(.+)>$/
        const regex3 = /^<@&(.+)>$/
        const saymessage = args.join(' ')
        const length = args.length
        var count = 0
        args.forEach(args => {
            if (args === '@everyone' || args === '@here' || regex1.test(args) || regex2.test(args) || regex3.test(args)) {
                message.delete()
                return blacklist.findOne({ id: message.author.id }, (err, data) => {
                    if (err) throw err;
                    if (data) {
                        return // Ko có đâu
                    } else {
                        data = new blacklist({
                            id: message.author.id,
                            name: message.author.tag,
                            reason: 'Spam ping',
                            by: client.user.tag,
                        })
                        data.save()
                        const embed1 = new MessageEmbed()
                            .setTitle('Người dùng đã bị blacklist')
                            .setColor('BLUE')
                            .addFields({
                                name: 'Username',
                                value: message.author.tag,
                                inline: true,
                            },
                                {
                                    name: 'UserID',
                                    value: message.author.id,
                                    inline: true,
                                },
                                {
                                    name: 'Lý do',
                                    value: 'Spam ping',
                                    inline: true,
                                },
                                {
                                    name: 'Người làm',
                                    value: client.user.tag,
                                    inline: true,
                                })
                        message.channel.send(embed1)
                        message.author.send(embed1)
                    }
                })
            }
            count++
            if (count === length) {
                if (message.deletable) message.delete()
                var string = `1 2 3 4 5 0`;
                var words = string.split(' ');
                let random = Number(words[Math.floor(Math.random() * words.length)])
                if (random == 1) {
                    message.channel.send(`||${message.author.username} say:|| ${saymessage}`)
                } else if (random == 2) {
                    message.channel.send(`||Đôi lời từ ${message.author.username}:|| ${saymessage}`)
                } else if (random == 3) {
                    message.channel.send(`||Tận cùng trái tim của ${message.author.username} nói rằng:|| ${saymessage}`)
                } else if (random == 4) {
                    message.channel.send(`||${message.author.username} chỉ muốn nói là:|| ${saymessage}`)
                } else if (random == 5) {
                    message.channel.send(`||Bí mật mà ${message.author.username} giấu kín là:|| ${saymessage}`)
                } else if (random == 0) {
                    message.channel.send(`||${message.author.username}:|| ${saymessage}`)
                }
            }
        })
    }
}