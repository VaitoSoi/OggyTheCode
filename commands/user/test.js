const { Client, Message } = require('discord.js')

module.exports = {
    name: 'test',
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async (client, message, args) => {
        // message.channel.send(client.channels.cache.get(message.channel.id).guild.id)
    }
}