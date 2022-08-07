const { Client, Message } = require('discord.js')

module.exports = { 
    name: 'ping',
    description: 'Độ trễ của bot, ws và database',
    usage: '',
    /**
    * 
    * @param {Client} client 
    * @param {Message} message 
    * @param {String[]} args 
    */ 
    run: async(client, message, args) => {
        let now = Date.now()
        await require('../../../models/ping').find()
        let dbping = Date.now() - now
        /**
         * 
         * @param {Number} num 
         */
        async function rate (num) {
            let str = ''
            if (num >= 0 && num <= 250) str = '🟢'
            else if (num > 250 && num <= 500) str = '🟡'
            else if (num > 500 && num <= 1000) str = '🟠'
            else if (num > 1000) str = '🔴'
            return str + ' ' + num + 'ms'
        }
        message.reply('Checking...').then(async (m) => {
            let ping = m.createdTimestamp - message.createdTimestamp
            let wsping = client.ws.ping
            m.edit(
                '**-----Oggy & WS & DB Ping-----**\n' +
                `> Oggy: ${await rate(Number(ping))}\n` +
                `> WS: ${await rate(Number(wsping))}\n` + 
                `> Mongoose: ${await rate(Number(dbping))}\n` +
                `**--------------------------------------**`
            )
        })
    }
}