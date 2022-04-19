const { MessageEmbed, MessageActionRow, MessageButton, Client, Message } = require('discord.js');
const { noMusicEmbed } = require('../../util/utils')
const { player } = require('../../index')
const ms = require('ms')

module.exports = {
    name: 'queue',
    aliases: ['q'],
    description: 'Hiện danh sách bài hát đg chờ',
    catergory: 'music',
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {*} args 
     * @returns 
     */
    run: async (client, message, args) => {
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
        const queue = client.player.getQueue(message.guild.id)
        if (!queue || !queue.nowPlaying()) return noMusicEmbed(message);
        if (!queue.tracks.length) {
            const embed = new MessageEmbed()
                .setColor('GREEN')
                .setAuthor({ name: `Danh sách bài hát đang chờ phát tại ${message.guild.name}`, iconURL: message.guild.iconURL })
                .addFields({
                    name: `Bài hát đang phát`,
                    value: `[${queue.current.title}](${queue.current.url})\n*Người yêu cầu: ${queue.current.requestedBy}*\n`
                });
            return message.channel.send({ embeds: [embed] })
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
        message.channel.send({ embeds: [embed], components: [row] })
    },
};