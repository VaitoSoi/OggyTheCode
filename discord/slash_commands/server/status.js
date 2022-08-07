const { CommandInteraction, MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const { Bot } = require('mineflayer')
const util = require('minecraft-server-util')
let commandName = ''
let i = 0
process.env.MC_HOST.split('').forEach(n => {
    if (n.toLowerCase() === '.') {
        return commandName = process.env.MC_HOST.split('').slice(0, i).join('')
    } else i++
})

module.exports = {
    data: new SlashCommandBuilder()
        .setName(commandName)
        .setDescription(`Hiện tất cả các thông tin về ${process.env.MC_HOST}`),
    /**
    * 
    * @param {CommandInteraction} interaction 
    * @param {Bot} bot
    */
    run: async (interaction, bot) => {
        const embed = new MessageEmbed()
            .setAuthor({
                name: `${client.user.tag} Server Utils`,
                iconURL: client.user.displayAvatarURL()
            })
            .setTitle(`\`${process.env.MC_HOST}\` Status`)
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
        interaction.editReply({
            embeds: [embed]
        })
    }
}