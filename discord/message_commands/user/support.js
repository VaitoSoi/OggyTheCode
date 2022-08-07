const { Client, Message } = require('discord.js')

module.exports = { 
    name: '',
    description: '',
    usage: '',
    /**
    * 
    * @param {Client} client 
    * @param {Message} message 
    * @param {String[]} args 
    */ 
    run: async(client, message, args) => {
        message.reply('👇 | Support Sever link: https://discord.gg/NBsnNGDeQd')
    }
}