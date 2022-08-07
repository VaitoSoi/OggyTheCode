const { Message } = require('discord.js')

module.exports = {
    name: 'messageCreate',
    /**
     * Message event
     * @param {Message} message 
     */
    async run(message) {
        const client = message.client
        if (message.author.bot) return
        if (client.type == 'client_2' && message.guild.members.cache.get(client.client1.user.id)) return
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
        if (!cmd || cmd.server != null || cmd.server == true) return
        cmd.run(client, message, args)
    }
}