module.exports.colors = {
    "blue": "#3AB0FF",
    "pink": "#FF698E",
    "purple": "#F637EC",
    "red": "#FA2314",
    "yellow": "#FAEA48",
    "green": "#87ff36"
}

const Discord = require('discord.js')

/**
 * Send to all server
 * @param {Discord.Client} client1 
 * @param {Discord.Client} client2 
 * @param {Discord.MessageEmbed} embed 
 * @param {Boolean | undefined} notify
 * @param {Boolean | undefined} join_leave
 */
module.exports.chat = (client1, client2, embed, notify, join_leave) => {
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
        if (join_leave == true && (!data.config.join_leave || data.config.join_leave == 'off')) return
        if (!guild.me.permissionsIn(channel).has('SEND_MESSAGES')) return
        let timestamp = '', dash = '--------------------------'
        if (data.config.timestamp && data.config.timestamp == 'on') {
            embed.setTimestamp(); timestamp = `[<t:${Math.floor(Date.now() / 1000)}:t>]`; 
            dash = '---------------------------------------'
        }
        if (guild.me.permissionsIn(channel).has('EMBED_LINKS')
            && (!data.config.chatType
                || data.config.chatType.toLowerCase() === 'embed')) channel.send({ embeds: [embed] }).catch(e => { })
        else channel.send(
            notify == true
                ? embed.description
                    ? `\`${dash}\`\n` +
                    `${embed.description.split('\n').map(str => `${timestamp} **Notify » ${str} **`).join('\n')}\n` +
                    `\`${dash}\``
                    : `\`${dash}\`\n` +
                    `${embed.title.split('\n').map(str => `${timestamp} **Notify » ${str} **`).join('\n')}\n` +
                    `\`${dash}\``
                : embed.description
                    ? `${timestamp} ${noEmbedLink(embed.description)}`
                    : `${timestamp} ${noEmbedLink(embed.title)}`
        ).catch(e => { })
    })
    client2.guilds.cache.forEach(async (guild) => {
        if (guild.members.cache.get(client1.user.id)) return
        const data = await db.findOne({
            'guildid': guild.id
        })
        if (!data) return
        const channel = guild.channels.cache.get(data.config.channels.livechat)
        if (!channel || !channel.isText()) return
        if (join_leave == true && (!data.config.join_leave || data.config.join_leave == 'off')) return
        if (!guild.me.permissionsIn(channel).has('SEND_MESSAGES')) return
        let timestamp = '', dash = '--------------------------'
        if (data.config.timestamp && data.config.timestamp == 'on') {
            embed.setTimestamp(); timestamp = `[<t:${Math.floor(Date.now() / 1000)}:t>]`; 
            dash = '---------------------------------------'
        }
        if (guild.me.permissionsIn(channel).has('EMBED_LINKS')
            && (!data.config.chatType
                || data.config.chatType.toLowerCase() === 'embed')) channel.send({ embeds: [embed] }).catch(e => { })
        else channel.send(
            notify == true
                ? embed.description
                    ? `\`${dash}\`\n` +
                    `${embed.description.split('\n').map(str => `${timestamp} **Notify » ${str} **`).join('\n')}\n` +
                    `\`${dash}\``
                    : `\`${dash}\`\n` +
                    `${embed.title.split('\n').map(str => `${timestamp} **Notify » ${str} **`).join('\n')}\n` +
                    `\`${dash}\``
                : embed.description
                    ? `${timestamp} ${noEmbedLink(embed.description)}`
                    : `${timestamp} ${noEmbedLink(embed.title)}`
        ).catch(e => { })
    })
}

/**
 * Send to all server
 * @param {Discord.Client} client1 
 * @param {Discord.Client} client2 
 * @param {Discord.MessageEmbed} embed 
 * @param {Boolean} now
 */
module.exports.restart = (client1, client2, time, now) => {
    const db = require('../../models/option')
    /**
     * @param {Discord.TextChannel} channel 
     */
    const delMess = async (channel, data) => (await channel.messages.fetch()).forEach((msg) => {
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