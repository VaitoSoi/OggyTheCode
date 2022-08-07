const Discord = require('discord.js')

/**
 * Send to all server
 * @param {Discord.Client} client1 
 * @param {Discord.Client} client2 
 * @param {Discord.MessageEmbed} embed 
 * @param {Boolean | undefined} notify
 */
module.exports = (client1, client2, embed, notify) => {
    const db = require('../../models/option')
    /**
     * 
     * @param {String} str 
     */
    const noEmbedLink = (str) =>
        str.trim().split(' ').map(arg => arg.startsWith('https://') || arg.startsWith('http://') ? `<${arg}>` : arg).join(' ')
    client1.guilds.cache.forEach(async (guild) => {
        const data = await db.findOne({
            'guildid': guild.id
        })
        if (!data) return
        const channel = guild.channels.cache.get(data.config.channels.livechat)
        if (!channel || !channel.isText()) return
        if (!guild.me.permissionsIn(channel).has('SEND_MESSAGES')) return
        if (guild.me.permissionsIn(channel).has('EMBED_LINKS')
            && data.config.chatType.toLowerCase() === 'embed') channel.send({ embeds: [embed] })
        else channel.send(
            notify == true
                ? embed.description
                    ? `\`--------------------------\`\n` +
                    `${embed.description.split('\n').map(str => '**Notify » ' + str + '**').join('\n')}\n` +
                    `\`--------------------------\``
                    : `\`--------------------------\`\n` +
                    `${embed.title.split('\n').map(str => '**Notify » ' + str + '**').join('\n')}\n` +
                    `\`--------------------------\``
                : embed.description
                    ? noEmbedLink(embed.description)
                    : noEmbedLink(embed.title)
        )
    })
    client2.guilds.cache.forEach(async (guild) => {
        if (guild.members.cache.get(client1.user.id)) return
        const data = await db.findOne({
            'guildid': guild.id
        })
        if (!data) return
        const channel = guild.channels.cache.get(data.config.channels.livechat)
        if (!channel || !channel.isText()) return
        if (!guild.me.permissionsIn(channel).has('SEND_MESSAGES')) return
        if (guild.me.permissionsIn(channel).has('EMBED_LINKS')
            && data.config.chatType.toLowerCase() === 'embed') channel.send({ embeds: [embed] })
        else channel.send(
            notify == true
                ? embed.description
                    ? `\`--------------------------\`\n` +
                    `${embed.description.split('\n').map(str => '**Notify » ' + str + '**').join('\n')}\n` +
                    `\`--------------------------\``
                    : `\`--------------------------\`\n` +
                    `${embed.title.split('\n').map(str => '**Notify » ' + str + '**').join('\n')}\n` +
                    `\`--------------------------\``
                : embed.description
                    ? noEmbedLink(embed.description)
                    : noEmbedLink(embed.title)
        )
    })
}