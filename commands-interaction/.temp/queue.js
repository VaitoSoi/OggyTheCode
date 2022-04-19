const { CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Xem hàng chờ nhạc'),
    /**
    * 
    * @param {CommandInteraction} interaction 
    */ 
    run: async(interaction) => {
        if (interaction.deferred === false) await interaction.deferReply()
        const client = interaction.client
        const ms = require('ms')
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('queuepreviouspage')
                    .setLabel('<<<')
                    .setStyle('SUCCESS')
                    .setDisabled()
            )
            .addComponents(
                new MessageButton()
                    .setCustomId('queuedeletemessage')
                    .setLabel('🗑️')
                    .setStyle('DANGER')
            )
            .addComponents(
                new MessageButton()
                    .setCustomId('queuenextpage')
                    .setLabel('>>>')
                    .setStyle('SUCCESS')
            )
        const queue = client.player.getQueue(interaction.guild.id)
        if (!queue || !queue.nowPlaying()) return interaction.editReply('🔴 | Hàng chờ đang trống !');
        if (!queue.tracks.length) {
            const embed = new MessageEmbed()
                .setColor('GREEN')
                .setAuthor({ name: `Danh sách bài hát đang chờ phát tại ${message.guild.name}`, iconURL: message.guild.iconURL })
                .addFields({
                    name: `Bài hát đang phát`,
                    value: `[${queue.current.title}](${queue.current.url})\n*Người yêu cầu: ${queue.current.requestedBy}*\n`
                });
            return interaction.editReply({ embeds: [embed] })
        }

        const embed = new MessageEmbed()
            .setTitle(`Các bài hát trong queue tại server **${message.guild.name}**`)
            .setFooter({ text: `Tất cả bài hát: ${queue.tracks.length} | Tổng cộng thời gian: ${ms(queue.totalTime)}` })
            .setAuthor({ name: `${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
            .addFields({
                name: 'Bài hát đang phát',
                value: `${queue.current.title}\nLink: ${queue.current.url}\nBởi: ${queue.current.author} | Thời gian: ${ms(queue.current.durationMS)}\nNgười yêu cầu: ${queue.current.requestedBy}`
            })
            .setColor('RANDOM')
        var n = 0
        const queue1 = queue.tracks.slice(0, 10)
        queue1.forEach(track => {
            n++
            embed.addFields({
                name: `${n} ${track.title}`,
                value: `Link: ${track.url}\nBởi: ${track.author} | Thời gian: ${ms(track.durationMS)}\nNgười yêu cầu: ${track.requestedBy}`
            })
        })
        interaction.editReply({ embeds: [embed], components: [row] })
    }
} 