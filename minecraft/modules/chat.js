module.exports.colors = {
    "blue": "#3AB0FF",
    "pink": "#FF698E",
    "purple": "#F637EC",
    "red": "#FA2314",
    "yellow": "#FAEA48",
    "green": "#87ff36"
}

module.exports.death_message = [
    /^(.+) died in a unique way$/,
    /^(.+) flew into a wall$/,
    /^(.+) thought they could swim forever$/,
    /^(.+) blew up(|! They were playing around with an end-crystal!)$/,
    /^(.+) ran out of food, and died$/,
    /^(.+) thought lava was a hot tub$/,
    /^(.+) fell from a high place$/,
    /^(.+) (killed|shot) themselves$/,
    /^(.+) was squished to death$/,
    /^(.+) was burnt to a crisp$/,
    /^(.+) was playing with magic$/,
    /^(.+) thought standing in fire was a good idea$/,
    /^(.+) was playing with (tnt|poision)$/,
    /^(.+) died to a wither skull$/,
    /^(.+) withered away$/,
    /^(.+) was pricked to death$/,
    /^(.+) fell into the void$/,
    /^(.+) tried climbing to greater heights and fell off (.+)$/,
    /^(.+) killed (.+)'s Wolf$/,
    /^(.+) was playing on a magma block too long$/,
    /^(.+) stood too close to (.+)'s bed in the nether$/,
    /^(.+) (was slain|was blown up|was pushed into lava|was pushed off a high place|was spat on|was struck) by ( |a )(.+)$/,
    /^(.+) tried playing with (.+) armor with thorns$/,
    /^(.+) (was slain by|murdered|killed|was ganed up on by some|was shot by a|was shot by|tried playing with) (.+)( somehow using| using| by|! One wacked them with|! One shot them with) (.+)$/,
]

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
    db.find().then((datas) => datas.forEach(data => {
        let guild = client1.guilds.cache.get(data.guildid) || client2.guilds.cache.get(data.guildid) || undefined
        if (!guild) return
        const channel = guild.channels.cache.get(data.config.channels.livechat)
        if (!channel || !channel.isText()) return
        const join_leave = data.config.feature ? data.config.feature.join_leave : data.config.join_leave
        if (join_leave == true && (!join_leave || join_leave == 'off')) return
        if (!guild.me.permissionsIn(channel).has('SEND_MESSAGES')) return
        let timestamp = '', dash = '--------------------------'
        const config_timestamp = data.config.feature ? data.config.feature.timestamp : data.config.timestamp
        if (config_timestamp && config_timestamp == 'on') {
            embed.setTimestamp(); timestamp = `[<t:${Math.floor(Date.now() / 1000)}:t>]`;
            dash = '---------------------------------------'
        }
        const chatType = data.config.feature ? data.config.feature.chatType : data.config.chatType
        if (guild.me.permissionsIn(channel).has('EMBED_LINKS')
            && (!chatType
                || chatType.toLowerCase() === 'embed')) channel.send({ embeds: [embed] }).catch(e => { })
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
    }))
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
    db.find().then((datas) => datas.forEach(async data => {
        let guild = client1.guilds.cache.get(data.guildid) || client2.guilds.cache.get(data.guildid) || undefined
        if (!guild) return
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
    }))
}