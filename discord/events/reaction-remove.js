const { MessageReaction, User } = require('discord.js')

module.exports = {
    name: 'messageReactionRemove',
    /**
     * 
     * @param {MessageReaction} reaction 
     * @param {User} user 
     */
    async run(reaction, user) {
        const client = reaction.client
        if (reaction.emoji.name != '📢') return
        if (client.type == 'client_2' && reaction.message.guild.members.cache.get(client.client1.user.id)) return
        const db = require('../../models/option')
        const data = await db.findOne({
            guildid: reaction.message.guildId
        })
        if (!data) return
        if (reaction.message.id != data.config.messages.restart) return
        const role = reaction.message.guild.roles.cache.get(data.config.roles.restart)
        if (!role) return
        reaction.message.guild.members.cache.get(user.id).roles.remove(
            role, 'Oggy Reaction-Role'
        )
            .then((mem) => reaction.message.reply({
                content: `Đã xóa role ${role} cho ${user}`,
                allowedMentions: {
                    parse: ['users']
                }
            }).then(m => setTimeout(() => m.delete().catch(e => {}), 5 * 1000)))
            .catch((e) => reaction.message.reply(`Lỗi: \`\`\`${e}\`\`\``)
                .then(m => setTimeout(() => m.delete().catch(e => {}), 15 * 1000)))
    }
}