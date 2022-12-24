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
        if (blacklistData
            && blacklistData.end.toLowerCase() != 'vĩnh viễn'
            && Math.floor(Date.now() / 1000) >= Number(blacklistData.end))
            await blacklistDB.findOneAndDelete({ id: message.author.id })
        else if (blacklistData
            && (!blacklistData.type || blacklistData.type == 'all' || blacklistData.type == 'command')
            && (blacklistData.end.toLowerCase() == 'vĩnh viễn'
                || Math.floor(Date.now() / 1000) < Number(blacklistData.end)))
            return (!data || message.channelId != data.config.channels.livechat) ? message.reply(
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
            ) : react(message, '❌')
        if (data && message.channelId == data.config.channels.livechat) {
            if (!bot.players) return react(message, '❌')
            const args = message.content.split(' ')
            const start =
                args[0] == '/r'
                || args[0] == '/w'
                || args[0] == '/msg'
                ? `${args[0]} ${args[0] != '/r' ? `${args[1]} <${message.author.tag}>` : `<${message.author.tag}>`}` 
                : `<${message.author.tag}>`
            bot.chat(`${start} ${message.content.trim().split(' ').slice(2).join(' ')}`)
            return react(message, '✅')
        }
    }
}