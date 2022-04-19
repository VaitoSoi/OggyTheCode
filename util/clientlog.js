const { Client, MessageEmbed } = require('discord.js')
/**
 * 
 * @param {Client} client 
 * @param {String} string 
 */
module.exports = (client, string) => {
    const channel = client.channels.cache.get(process.env.CONSOLE_CHANNEL)
    if (!channel) return
    channel.send({
        embeds: [
            new MessageEmbed()
                .setDescription('```' + `${string}` + '```')
                .setColor('NOT_QUITE_BLACK')
        ]
    })
}