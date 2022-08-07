const { Guild } = require('discord.js')

module.exports = {
    name: 'guildCreate',
    /**
     * 
     * @param {Guild} guild 
     */
    async run(guild) {
        const client = guild.client
        if (client.type == 'client_2' 
        && guild.members.cache.get(client.client1.user.id)
        && guild.id != (process.env.ALLOW_GUILD ? process.env.ALLOW_GUILD : null)) {
            (await guild.fetchOwner()).user.send(`❌ | Phát hiện ${client.client1} trong guild` +
                `\n⏳Rời server sau 5 giây`)
            setTimeout(() => {
                guild.leave()
            }, 5 * 1000);
        }
    }
}