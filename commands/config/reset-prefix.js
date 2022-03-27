const prefixSchema = require('../../models/prefix')
const prefix = process.env.PREFIX
const { Message, Client } = require('discord.js')

module.exports = {
    name: 'reset-prefix',
    category: 'moderation',
    aliases: ['resetprefix', 'oldprefix', 'prefix-reset'],
    permissions: ['MANAGE_MESSAGES'],
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     */
    run: async (client, message) => {
        await prefixSchema.findOneAndDelete({ GuildId: message.guild.id })
        message.channel.send(`Đã chuyển prefix về "**${prefix}**"`)
    }
}