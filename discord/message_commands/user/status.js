const { Client, Message, MessageEmbed } = require('discord.js')
const util = require('minecraft-server-util')

module.exports = { 
    name: 'status',
    description: 'Thông tin về 1 server',
    usage: '<ip> <port>',
    /**
    * 
    * @param {Client} client 
    * @param {Message} message 
    * @param {String[]} args 
    */ 
    run: async(client, message, args) => {
        if (!args[1]) return message.reply('🛑 | Vui lòng cho biết IP')
        let port = args[2] != undefined && !isNaN(args[2]) ? Number(args[2]) : 25565
        const embed = new MessageEmbed()
            .setAuthor({
                name: `${client.user.tag} Server Utils`,
                iconURL: client.user.displayAvatarURL()
            })
            .setTitle(`\`${args[1].toUpperCase()}\` Status`)
            .setFooter({
                text: `${message.author.tag}`,
                iconURL: message.author.displayAvatarURL()
            })
            .setTimestamp()
            .setThumbnail(`https://eu.mc-api.net/v3/server/favicon/${args[1]}`)
        const now = Date.now()
        await util.status(args[1], port)
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