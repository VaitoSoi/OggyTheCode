const { Guild } = require('discord.js')

module.exports = {
    name: 'guildCreate',
    /**
     * 
     * @param {Guild} guild 
     */
    async run(guild) {
        const client = guild.client
        if ((client.type == 'client_2'
            && guild.members.cache.get(client.client1.user.id)) ||
            (client.type == 'client_1'
                && guild.members.cache.get(client.client2.user.id))
            && guild.id != (process.env.ALLOW_GUILD ? process.env.ALLOW_GUILD : null)) {
            (await guild.fetchOwner()).user.send(`❌ | Phát hiện ${client.client1} trong guild` +
                `\n⏳Rời guild sau 5 giây`)
            let g = client.type == 'client_2'
                ? guild
                : await client.client2.guilds.cache.get(guild.id)
            setTimeout(async () => {
                await g.leave()
            }, 5 * 1000);
        }
    }
}