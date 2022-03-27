const setchannel = require('../models/setchannel')
const { GuildMember } = require('discord.js')

module.exports = {
    name: 'guildMemberRemove',
    /**
     * 
     * @param {GuildMember} member 
     */
    async run(member) {
        const data = await setchannel.findOne({ guildid: member.guild.id })
        if (data) {
            const data1 = data.welcome
            if (data1 === 'No data') {
                return
            } else {
                const Channel = member.guild.channels.cache.get(data.welcome)
                Channel.send(`\`${member.tag}\` vừa rời khỏi ${member.guild.name}`)
            }
        }
    }
}