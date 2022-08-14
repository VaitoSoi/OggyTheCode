const Discord = require('discord.js')

/**
 * Send to all server
 * @param {Discord.Client} client1 
 * @param {Discord.Client} client2 
 * @param {Discord.MessageEmbed} embed 
 * @param {Boolean} now
 */
module.exports = (client1, client2, time, now) => {
    const db = require('../../models/option')
    /**
     * @param {Discord.Channel} channel 
     */
    const delMess = (channel, data) => channel.messages.fetch().forEach((msg) => {
        if (msg.id === data.config.messages.restart) return
        if (msg.author.id !== client1.user.id) return
        if ((Date.now() - msg.createdTimestamp) < 60 * 60 * 1000) return
        msg.delete().catch((e) => { })
    })
    client1.guilds.cache.forEach(async (guild) => {
        const data = await db.findOne({
            'guildid': guild.id
        })
        if (!data) return
        const channel = guild.channels.cache.get(data.config.channels.restart)
        if (!channel || !channel.isText()) return
        if (!guild.me.permissionsIn(channel).has('SEND_MESSAGES')) return
        const role = guild.roles.cache.get(data.config.roles.restart)
        if (!role) return
        await delMess(channel, data)
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
    client2.guilds.cache.forEach(async (guild) => {
        if (guild.members.cache.get(client1.user.id)) return
        const data = await db.findOne({
            'guildid': guild.id
        })
        if (!data) return
        const channel = guild.channels.cache.get(data.config.channels.restart)
        if (!channel || !channel.isText()) return
        if (!guild.me.permissionsIn(channel).has('SEND_MESSAGES')) return
        const role = guild.roles.cache.get(data.config.roles.restart)
        if (!role) return
        await delMess(channel, data)
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