const { Client, Message } = require('discord.js')

module.exports = {
    name: 'announcement',
    description: 'BOT OWNER ONLY',
    usage: '',
    /**
    * 
    * @param {Client} client 
    * @param {Message} message 
    * @param {String[]} args 
    */
    run: async (client, message, args) => {
        if (message.author.id !== '692271452053045279') return
        message.channel.send('🔽 | Vui lòng nhập đoạn văn bản muốn gửi đi.\n🟢 | Ghi `DONE` để kết thúc.')
        let messageCollector = message.channel.createMessageCollector({
            time: 5 * 60 * 1000
        })
            , array = []
        messageCollector.on('collect', (msg) => {
            if (msg.author.id !== '692271452053045279') return
            if (msg.content.toLowerCase() === 'done') {
                msg.channel.send('Bản xem trước:\n```' + array.join('\n') + '```\nReact:\n> 🟢 để gửi đi.\n> 🔴 để hủy.').then(async (m) => {
                    let emojiCollector = m.createReactionCollector({
                        time: 5 * 60 * 1000
                    })
                        , num = 0
                        , done = 0
                        , err = 0
                        , send = false
                    m.react('🟢')
                    m.react('🔴')
                    emojiCollector.on('collect', async (reaction, user) => {
                        if (user.id !== '692271452053045279') return
                        if (reaction.emoji.name === '🟢') {
                            msg.channel.send('⏳ | Loading').then(async (m) => {
                                await client.guilds.cache.forEach(async (guild) => {
                                    send = false
                                    num++
                                    try {
                                        const owner = client.users.cache.get(guild.ownerId)
                                        await owner.send(`Gửi tới chủ của \`${guild.name}\`,\nVaitoSoi (Developer của OggyTheBot) thông báo :\n\`\`\`${array.join('\n')}\`\`\`\n<t:${Math.floor(Date.now() / 1000)}:F>`)
                                        guild.channels.cache.forEach(async (channel) => {
                                            if (channel.isText() && guild.me.permissionsIn(channel).has('SEND_MESSAGES') && send === false) {
                                                send = true
                                                await channel.send(`Gửi \`${guild.name}\`,\nVaitoSoi (Developer của OggyTheBot) thông báo:\n\`\`\`${array.join('\n')}\`\`\`\n<t:${Math.floor(Date.now() / 1000)}:F>`)
                                                return m.edit(`Guild:\n> ID: \`${guild.id}\` | Name: \`${guild.name}\`\nChannel:\n> ID: \`${channel.id}\` | Name: \`${channel.name}\`\nOwner:\n> ID: \`${owner.id}\` | Name: \`${owner.username}\`\nStatus: ✅ Đã gửi.`)
                                            }
                                        })
                                        done++
                                    } catch (e) {
                                        err++
                                        await m.edit('```' + e + '```')
                                    }
                                    if (num === client.guilds.cache.size) setTimeout(() => {
                                        m.channel.send(`✅ | Đã gửi cho ${num} Guild và Qwner.\n🔴 | ${err} Guild không thể gửi đi.`)
                                    }, 1000);
                                })
                            })
                        } else if (reaction.emoji.name === '🔴') return msg.channel.send('🛑 | Đã hủy.')
                    })
                })
            } else {
                array.push(msg.content.trim())
                msg.react('👌')
            }
        })
    }
}
