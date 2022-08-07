const { CommandInteraction } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Bot and WS ping'),
    /**
    * 
    * @param {CommandInteraction} interaction 
    */ 
    run: async(interaction) => {
        const client = interaction.client
        /**
         * 
         * @param {Number} num 
         * @returns 
         */
        let now = Date.now()
        let dbping = 0
        const data = require('../../../models/ping').find()
        await data;
        dbping = Date.now() - now
        async function rate (num) {
            let str = ''
            if (num >= 0 && num <= 250) str = '🟢'
            else if (num > 250 && num <= 500) str = '🟡'
            else if (num > 500 && num <= 1000) str = '🟠'
            else if (num > 1000) str = '🔴'
            return str + ' ' + num + 'ms'
        }
        interaction.followUp('Checking...').then(async (m) => {
            let ping = m.createdTimestamp - interaction.createdTimestamp
            , wsping = client.ws.ping
            m.edit(
                '**-----Oggy & WS & DB Ping-----**\n' +
                `Oggy: ${await rate(Number(ping))}\n` +
                `WS: ${await rate(Number(wsping))}\n` + 
                `Mongoose: ${await rate(Number(dbping))}\n` +
                `**-------------------------------------**`
            )
        })
    }
}