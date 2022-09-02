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
        const client = message.client
        if (client.type == 'client_2' && message.guild.members.cache.get(client.client1.user.id)) return
        if (!data || message.channelId != data.config.channels.livechat) {
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
            if (!client.message.categories.server.includes(cmd.name)) return
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
            cmd.run(bot, client, message, args)
        } else {
            /**
             * @param {Discord.Message} message 
             * @param {String} emoji 
             */
            const react = (message, emoji) => {
                message.reactions.removeAll().catch(e => { })
                return message.guild.me.permissions.has('ADD_REACTIONS')
                    && message.guild.me.permissionsIn(message.channel).has('ADD_REACTIONS')
                    ? void message.react(emoji).catch(e => { }).then(() => true) : undefined
            }
            const blacklistDB = require('../../models/blacklist')
            const blacklistData = await blacklistDB.findOne({
                id: message.author.id
            })
            try {
                if (blacklistData
                    && blacklistData.end.toLowerCase() != 'vĩnh viễn'
                    && Math.floor(Date.now() / 1000) >= Number(blacklistData.end))
                    await blacklistDB.findOneAndDelete({ id: message.author.id })
                else if (blacklistData
                    && (!blacklistData.type || blacklistData.type == 'all' || blacklistData.type == 'command')
                    && (blacklistData.end.toLowerCase() == 'vĩnh viễn'
                        || Math.floor(Date.now() / 1000) < Number(blacklistData.end)))
                    return react(message, '❌')
                if (!bot.players) return react(message, '❌')
                else {
                    bot.chat(`<${message.author.tag}> ${message.content.trim()}`)
                    return react(message, '✅')
                }
            } catch (e) {
                return react(message, '❌')
            }
        }
    }
}