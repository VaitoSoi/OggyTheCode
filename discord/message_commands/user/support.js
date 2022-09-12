const { Client, Message } = require('discord.js')

module.exports = { 
    name: 'support',
    description: 'Thông tin về support server',
    usage: '',
    /**
    * 
    * @param {Client} client 
    * @param {Message} message 
    * @param {String[]} args 
    */ 
    run: async(client, message, args) => {
        message.reply('👇 | Support Sever link: https://discord.gg/htJ2kRSfPz')
    }
}
