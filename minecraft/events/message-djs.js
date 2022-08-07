const mineflayer = require('mineflayer')
const Discord = require('discord.js')

module.exports = {
    name: 'messageCreate',
    discord: true,
    /**
     * 
     * @param {mineflayer.Bot} bot 
     * @param {Discord.Message} message 
     */
    async run(bot, message) {
        if (message.author.bot) return
        const db = require('../../models/option')
        const data = await db.findOne({
            'guildid': message.guildId
        })
        if (!data) return
        if (message.channelId !== data.config.channels.livechat) {
            const client = message.client
            if (client.type == 'client_2' && message.guild.members.cache.get(client.client1.user.id)) return
            if (message.author.bot) return
            let prefix = process.env.prefix
            const db = require('../../models/option')
            const data = await db.findOne({
                guildid: message.guildId
            })
            if (data
                && data.config.prefix
                && data.config.prefix != '') prefix = data.config.prefix
            if (!message.content.startsWith(prefix)) return
            const args = message.content.slice(prefix.length).split(/ +/g)
            let cmd = client.message.get(args[0])
            const aliases = client.aliases.get(args[0])
            if (!cmd && aliases) cmd = client.message.get(aliases)
            if (!cmd && !aliases) return
            if (!cmd || cmd.server == null || cmd.server == false) return
            cmd.run(bot, client, message, args)
        } else {
            if (message.client.type == 'client_2' && message.guild.members.cache.get(message.client.client1.user.id)) return
            try {
                bot.chat(`<${message.author.tag}> ${message.content.trim()}`)
                message.react('✅')
            } catch (e) {
                message.react('🛑')
            }
        }
    }
}