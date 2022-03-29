const setchannel = require('../models/setchannel')
const ms = require('ms')

module.exports = {
    name: 'guildCreate',
    run(guild) {
        const blacklistguild = require('./models/blacklist-guild')
        blacklistguild.findOne({ guildid: guild.id }, async (err, data) => {
            if (err) throw err;
            if (data) {
                let defaultChannel = "";
                guild.channels.cache.map(channel => channel).forEach((channel) => {
                    if (channel.type == "text" && defaultChannel == "") {
                        if (channel.permissionsFor(guild.me).has("SEND_MESSAGES")) {
                            defaultChannel = channel;
                        }
                    }
                })
                defaultChannel.send('Phát hiện Guild trong Blacklist.\nRời sau 5s')
                const leaveguild = client.guilds.cache.get(guild.id)
                setTimeout(() => {
                    leaveguild.leave()
                }, ms('5s'))
            }
        })
    }
}