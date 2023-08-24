import { EmbedBuilder } from "discord.js";
import { SlashCommandBuilder } from "../../lib";
import ascii from 'ascii-table3'

export default new SlashCommandBuilder()
    .setName('tablist')
    .setDescription('Hiển thị tablist của máy chủ đang chạy')
    .setRun((interaction, client) => {
        if (!client.bot) return interaction.editReply('🔴 Bot đang offline')
        const players = Object.keys(client.bot.players)
        const table = new ascii.AsciiTable3()
            .setStyle('none')
        for (let i = 0; i < players.length; i += 3)
            table.addRow(...players.slice(i, i + 3).filter(player => !!player))
        table.setAlign(players.length, ascii.AlignmentEnum.LEFT)
        const embed = new EmbedBuilder()
            .setAuthor({
                name: `${interaction.client.user.tag} Tablist`,
                iconURL: interaction.client.user.displayAvatarURL()
            })
            .setTimestamp()
            .setFooter({
                text: `OggyTheCode ${client?.package.version ?? 'v1.0.0'}`,
                iconURL: `https://github.com/${client?.package.github ?? 'vaitosoi'}.png`
            })
            .setDescription(
                '```' + (client.bot.tablist.header.toString() || 'Nothing up here •-•') + '```' + '\n' +
                '```' + table.toString() + '```' + '\n' +
                '```' + (client.bot.tablist.footer.toString() || 'Nothing down here •-•') + '```' + '\n'
            )
        return interaction.editReply({
            embeds: [embed]
        })
    })