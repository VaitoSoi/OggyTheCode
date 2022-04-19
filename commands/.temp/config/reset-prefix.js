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
        if (!message.member.permissions.has('MANAGE_MESSAGES')) return message.channel.send('🛑 | Bạn thiếu quyền `MANAGE_MESSAGES`')
        await prefixSchema.findOneAndDelete({ GuildId: message.guild.id })
        message.channel.send(`Đã chuyển prefix về "**${prefix}**"`)
    }
}