const { Client, Message } = require('discord.js')

module.exports = { 
    name: 'start',
    description: 'Sì ta e ver ry thinh',
    usage: '',
    aliases: [],
    /**
    * 
    * @param {Client} client 
    * @param {Message} message 
    * @param {String[]} args 
    */ 
    run: async(client, message, args) => {
        if (!message.guild.members.cache.get(message.author.id).permissions.has('MANAGE_GUILD')) 
            return message.reply('🛑 | Bạn thiếu quyền `MANAGE_GUILD`')
        message.reply('👋 OggyTheBot xin chào bạn.')
        message.channel.send('🔢 Đây là các bước setup cơ bản của bot')
        message.channel.send('1️⃣ Kiểm tra quyền và cài đặt (tự động)')
        return require('./start_module/permission')(message)
    }
}