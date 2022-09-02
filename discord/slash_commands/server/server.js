const { CommandInteraction, MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const { Bot } = require('mineflayer')
const util = require('minecraft-server-util')
const ascii = require('ascii-table')
let commandName = ''
let i = 0
if (process.env.MC_HOST != 'localhost')
    commandName = process.env.MC_HOST.split('').slice(0, process.env.MC_HOST.split('').indexOf('.')).join('')
else commandName = 'server'

module.exports = {
    data: new SlashCommandBuilder()
        .setName(commandName)
        .setDescription(`Hiện tất cả các thông tin về ${process.env.MC_HOST}`),
    server: true,
    /**
    * 
    * @param {CommandInteraction} interaction 
    * @param {Bot} bot
    */
    run: async (interaction, bot) => {
        const client = interaction.client
        const embed = new MessageEmbed()
            .setAuthor({
                name: `${client.user.tag} Server Utils`,
                iconURL: client.user.displayAvatarURL()
            })
            .setTitle(`\`${process.env.MC_HOST.toUpperCase()}\` Status`)
            .setFooter({
                text: `${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL()
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
        interaction.editReply({
            embeds: [embed]
        })
    }
}