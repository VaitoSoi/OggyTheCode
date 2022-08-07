const { Client, Message, MessageEmbed } = require('discord.js')
const util = require('minecraft-server-util')
let commandName = ''
let i = 0
process.env.MC_HOST.split('').forEach(n => {
    if (n.toLowerCase() === '.') {
        return commandName = process.env.MC_HOST.split('').slice(0, i).join('')
    } else i++
})

module.exports = { 
    name: commandName,
    description: `Hiện tất cả thông tin về server ${process.env.MC_HOST}`,
    usage: '',
    /**
    * 
    * @param {Client} client 
    * @param {Message} message 
    * @param {String[]} args 
    */ 
    run: async(bot, client, message, args) => {
        const embed = new MessageEmbed()
            .setAuthor({
                name: `${client.user.tag} Server Utils`,
                iconURL: client.user.displayAvatarURL()
            })
            .setTitle(`\`ANARCHYVN\` Status`)
            .setFooter({
                text: `${message.author.tag}`,
                iconURL: message.author.displayAvatarURL()
            })
            .setTimestamp()
            .setThumbnail(`https://eu.mc-api.net/v3/server/favicon/${process.env.MC_HOST}`)
        const now = Date.now()
        await util.status(process.env.MC_HOST, Number(process.env.MC_PORT))
            .then((response) => {
                const ping = Date.now() - now
                embed
                    .setColor('GREEN')
                    .setDescription(
                        `**Status:** 🟢 Online\n` +
                        `**Player:** ${response.players.online}/${response.players.max}\n` +
                        `**Version:** ${response.version.name}\n` +
                        `**Ping:** ${ping}\n` +
                        `**MOTD:** \n>>> ${response.motd.clean}\n`
                    )
            })
            .catch(e => {
                embed
                    .setColor('RED')
                    .setDescription(
                        '**Status:** 🔴 Offline\n' +
                        'Phát hiện lỗi khi lấy dữ liệu từ server:' +
                        '```' + `${e}` + '```'
                    )
            })
        message.reply({
            embeds: [embed]
        })
    }
}