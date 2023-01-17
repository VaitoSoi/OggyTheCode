const { CommandInteraction, MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Bot and WS ping'),
    /**
    * 
    * @param {CommandInteraction} interaction 
    */
    run: async (interaction) => {
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
        /**
         * @param {Number} ping
         * @returns {String} 
         */
        function rate(ping) {
            let str = ''
            if (ping >= 0 && ping <= 250) str = '🟢'
            else if (ping > 250 && ping <= 500) str = '🟡'
            else if (ping > 500 && ping <= 1000) str = '🟠'
            else if (ping > 1000) str = '🔴'
            return str + ' ' + ping + 'ms'
        }
        /**
         * @param {Number} ping 
         * @returns {String}
         */
        function color(ping) {
            let str = ''
            if (ping >= 0 && ping <= 250) str = '#87ff36'
            else if (ping > 250 && ping <= 500) str = '#FAEA48'
            else if (ping > 500 && ping <= 1000) str = '#F79400'
            else if (ping > 1000) str = '#FA2314'
            return str
        }
        interaction.channel.send('Checking...').then(async (m) => {
            const ping = m.createdTimestamp - interaction.createdTimestamp,
                wsping = client.ws.ping,
                average = Math.floor((ping + wsping + dbping) / 3)
            await m.delete()
            interaction.editReply({
                embeds: [
                    new MessageEmbed()
                        .setTitle('```     Ping của Oggy & WS & DB     ```')
                        .setDescription(
                            `Oggy: ${rate(ping)}\n` +
                            `WS: ${rate(wsping)}\n` +
                            `Mongoose: ${rate(dbping)}\n` +
                            `Average: ${rate(average)}`
                        )
                        .setColor(color(average))
                        .setTimestamp()
                        .setFooter({
                            text: 'Đo vào'
                        })
                ]
            })
        })
    }
}