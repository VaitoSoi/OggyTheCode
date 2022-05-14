const ms = require('ms')
const arrayOfStatus = require('../info/statusArray')
const { Client, Collection } = require('discord.js')

module.exports = {
    name: 'ready',
    /**
     * 
     * @param {Client} client 
     */
    async run(client) {
        return
        await require('../handler/commands-interaction')(client)
        console.log(`${client.user.username} is onl now`)
        let index = 0
        setInterval(() => {
            if (index === arrayOfStatus.length) index = 0;
            const status = arrayOfStatus[index];
            client.user.setActivity(status);
            index++;
        }, ms('5sec'))
        /**
        * 
        * Minecraft Bot
        * 
        */

        const { createBot } = require('../minecraft/minecraftbot')
        createBot(client)
        console.log('Đã load Minecraft Bot!')
    }
}