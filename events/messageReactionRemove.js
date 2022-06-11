const { MessageReaction, User } = require('discord.js')

module.exports = {
    name: 'messageReactionRemove',
    /**
     * 
     * @param {MessageReaction} reaction 
     * @param {User} user 
     */
    async run (reaction, user) {
        try {
            const client = reaction.message.guild.members.cache.get(process.env.ID_1)
                , client2 = reaction.message.guild.me.user.id
            if (client && client2 === process.env.ID_2) return
        } catch (e) {

        }
        if (user.id === reaction.message.client.user.id) return
        let data = await require('../models/option').findOne({ guildid: reaction.message.guildId })
        if (!data) return
        if (reaction.emoji.name === '📢') {
            var have = false
            try {
                if (
                    !data.config.message.restart
                    || data.config.message.restart !== reaction.message.id
                    || !data.config.role.restart
                ) have = false
                else have = true
            } catch (error) {

            }
            if (!have) return
            let role = reaction.message.guild.roles.cache.get(data.config.role.restart)
                reaction.message.guild.members.cache.get(user.id).roles.remove(
                    role,
                    'Oggy Reaction-Role'
                ).then((member) => member.user.send(`✅ | Đã gỡ role \`${role.name}\``).catch(e => {}))
        }
    }
}