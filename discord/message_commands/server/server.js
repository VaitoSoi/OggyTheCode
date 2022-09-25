const { Client, Message, MessageEmbed } = require('discord.js')
const mineflayer = require('mineflayer')
const util = require('minecraft-server-util')
const ascii = require('ascii-table')
let commandName = ''
let i = 0
if (process.env.MC_HOST != 'localhost')
    commandName = process.env.MC_HOST.split('').slice(0, process.env.MC_HOST.split('').indexOf('.')).join('')
else commandName = 'server'

module.exports = {
    name: commandName,
    description: `Hiện tất cả thông tin về server ${process.env.MC_HOST}`,
    usage: '',
    server: true,
    /**
    * @param {mineflayer.Bot} bot
    * @param {Client} client 
    * @param {Message} message 
    * @param {String[]} args 
    */
    run: async (client, message, args, bot) => {
        const embed = new MessageEmbed()
            .setAuthor({
                name: `${client.user.tag} Server Utils`,
                iconURL: client.user.displayAvatarURL()
            })
            .setTitle(`\`${process.env.MC_HOST.toUpperCase()}\` Status`)
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
                const table = new ascii()
                table.addRow(`🟢 Online`, ` 🙎‍♂️ Player: ${response.players.online}/${response.players.max}`)
                table.addRow(`⌛ Ping: ${ping}ms`, `${bot.getTps() ? `⏳ TPS: ${bot.getTps()} tps` : ''}`)
                embed
                    .setColor('GREEN')
                    .setDescription(
                        '```' +
                        table.toString().split('\n').slice(1, -1).map(str => str.slice(2, -2)).join('\n') + '\n' +
                        `Version: ${response.version.name}\n` +
                        `MOTD:\n` +
                        `${response.motd.clean}\n` +
                        '```'
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