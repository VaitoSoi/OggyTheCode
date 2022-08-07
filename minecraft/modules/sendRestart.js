const Discord = require('discord.js')

/**
 * Send to all server
 * @param {Discord.Client} client 
 * @param {Discord.MessageEmbed} embed 
 * @param {Boolean} now
 */
module.exports = (client, time, now) => {
    const db = require('../../models/option')
    client.guilds.cache.forEach(async (guild) => {
        const data = await db.findOne({
            'guildid': guild.id
        })
        if (!data) return
        const channel = guild.channels.cache.get(data.config.channels.restart)
        if (!channel || !channel.isText()) return
        if (!guild.me.permissionsIn(channel).has('SEND_MESSAGES')) return
        const role = guild.roles.cache.get(data.config.roles.restart)
        if (!role) return
        (await channel.messages.fetch()).forEach((msg) => {
            if (msg.id === data.config.messages.restart) return
            if (msg.author.id !== client.user.id) return
            if ((Date.now() - msg.createdTimestamp) < 60 * 60 * 1000) return
            msg.delete().catch((e) => { })
        })
        if (!now) channel.send({
            content: `${role} | Server sẽ khởi động trong vòng ${time} nữa...`,
            allowedMentions: {
                parse: ['roles']
            }
        })
        else channel.send({
            content: `${role} | Server đang khởi động lại...`,
            allowedMentions: {
                parse: ['roles']
            }
        })
    })
}