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
        let m = '.'
        let i = setInterval(() => {
            if ((client.num == '2' && client.client1.executed == true)
                || (client.num == '1' && client.executed == true)) clearInterval(i)
            if (m.length < 5) m += '.'
            else m = '.'
            client.user.setPresence({
                activities: [{ name: `Connecting${m}`, type: 'LISTENING' }],
                status: 'idle'
            })
        }, 1 * 1000)
        if (client.num == '1') client.start_mc(client, client.client2)
    }
}