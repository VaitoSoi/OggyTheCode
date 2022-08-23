const { CommandInteraction, MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const util = require('minecraft-server-util')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Lấy thông tin về 1 server')
        .addStringOption(o => o
            .setName('ip')
            .setDescription('IP của server')
            .setRequired(true)
        )
        .addNumberOption(o => o
            .setName('port')
            .setDescription('Cổng của server')
        ),
    /**
    * 
    * @param {CommandInteraction} interaction 
    */
    run: async (interaction) => {
        const client = interaction.client
        const ip = interaction.options.getString('ip')
        const port = interaction.options.getNumber('port') ? interaction.options.getNumber('ip') : 25565
        const embed = new MessageEmbed()
            .setAuthor({
                name: `${client.user.tag} Server Utils`,
                iconURL: client.user.displayAvatarURL()
            })
            .setTitle(`\`${ip.toUpperCase()}\` Status`)
            .setFooter({
                text: `${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL()
            })
            .setTimestamp()
            .setThumbnail(`https://eu.mc-api.net/v3/server/favicon/${ip}`)
        const now = Date.now()
        await util.status(ip, port)
            .then((response) => {
                const ping = Date.now() - now
                embed
                    .setColor('GREEN')
                    .setDescription(
                        `**Status:** 🟢 Online\n` +
                        `**Player:** ${response.players.online}/${response.players.max}\n` +
                        `**Version:** ${response.version.name}\n` +
                        `**Ping:** ${ping}ms\n` +
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