const { Message, MessageEmbed } = require('discord.js')

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
        let prefix = process.env.PREFIX
        /*
        const prefixDB = require('../../models/option')
        const prefixData = await prefixDB.findOne({
            guildid: message.guildId
        })
        if (prefixData
            && prefixData.config.prefix
            && prefixData.config.prefix != '') prefix = prefixData.config.prefix*/
        if (!message.content.startsWith(prefix)) return
        const args = message.content.slice(prefix.length).split(/ +/g)
        let cmd = client.message.commands.get(args[0])
        const aliases = client.message.aliases.get(args[0])
        if (!cmd && aliases) cmd = client.message.commands.get(aliases)
        if (!cmd && !aliases) return
        if (!client.message.categories.user.includes(cmd.name)) return
        const blacklistDB = require('../../models/blacklist')
        const blacklistData = await blacklistDB.findOne({
            id: message.author.id
        })
        if (blacklistData
            && blacklistData.end.toLowerCase() != 'vĩnh viễn'
            && Math.floor(Date.now() / 1000) >= Number(blacklistData.end))
            await blacklistDB.findOneAndDelete({ id: message.author.id })
        else if (blacklistData
            && (!blacklistData.type || blacklistData.type == 'all' || blacklistData.type == 'command')
            && (blacklistData.end.toLowerCase() == 'vĩnh viễn'
                || Math.floor(Date.now() / 1000) < Number(blacklistData.end)))
            return message.reply(
                'Bạn đã bị Blacklist\n' +
                `Lý do: \`${blacklistData.reason}\`\n` +
                `Bởi: \`${blacklistData.by}\`\n` +
                `Loại: \`${blacklistData.type ? blacklistData.type : 'all'}\`\n` +
                `Lúc: ${blacklistData.at
                    ? `<t:${blacklistData.at}:f> (<t:${blacklistData.at}:R>)`
                    : `¯\\_(ツ)_/¯`}\n` +
                `Hết hạn: ${blacklistData.end.toLowerCase() != 'vĩnh viễn'
                    ? `<t:${blacklistData.end}:f> (<t:${blacklistData.end}:R>)`
                    : `\`${blacklistData.end}\``}`
            )
        cmd.run(client, message, args)
    }
}