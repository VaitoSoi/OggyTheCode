const setchannel = require('../models/setchannel')

module.exports = {
    name: 'guildMemberAdd',
    run(member) {
        setchannel.findOne({ guildid: member.guild.id }, async (err, data) => {
            if (err) throw err;
            if (data) {
                const data1 = data.welcome
                if (data1 === 'No data') {
                    return
                } else {
                    const Channel = member.guild.channels.cache.get(data.welcome)
                    Channel.send(`Chào mừng <@${member.id}> đã đến với ${member.guild.name}`)
                }
            }
        })
    }
}