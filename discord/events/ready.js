const { Client } = require('discord.js')

module.exports = {
    name: 'ready',
    /**
     * Ready event
     * @param {Client} client 
     */
    async run(client) {
        console.log(`[${client.type.toUpperCase()}] ${client.user.tag} IS READY`)
        require('../handler/slash.js')(client)
        if (client.num == '1') client.start_mc(client, client.client2)
    }
}