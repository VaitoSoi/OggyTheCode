const { MessageEmbed } = require('discord.js');
const { noMusicEmbed } = require('../../util/utils');
const ms = require('ms')

module.exports = {
    name: 'nowplaying',
    aliases: ['np'],
    description: 'Thể hiện tên bài hát đg phát',
    category: 'music',
    run: async (client, message, args) => {
        const queue = client.player.getQueue(message.guild.id)
        if (!queue || !queue.nowPlaying()) return noMusicEmbed(message);
        const progressBar = queue.createProgressBar();
        const request = client.users.cache.get(`${queue.current.requestedBy.id}`)
        const embed = new MessageEmbed()
            .setAuthor({ name: `${client.user.tag}`, iconURL: client.user.avatarURL() })
            .setTitle(`Thông tin về bài hát đang phát tại ${message.guild.name}`)
            .setImage(queue.current.thumbnail)
            .setDescription("```" + `> ${queue.current.title}\n${progressBar}` + "```")
            .addFields({
                name: '⏱ Thời gian: ',
                value: `\`> ${queue.current.duration}\``,
                inline: true,
            },
                {
                    name: '🤵 Bởi:',
                    value: `\`> ${queue.current.author}\``,
                    inline: true,
                },
                {
                    name: '🎧 Yêu cầu bởi:',
                    value: `\`> ${request.tag}\``,
                    inline: true,
                })
            .setColor('RANDOM')
        if (queue.current.playlist) {
            embed.addFields({
                name: '📃 Tên của playlist:',
                value: `\`> ${queue.current.playlist.title}\``,
                inline: true,
            },
                {
                    name: '🤵 Chủ của playlist:',
                    value: `\`> ${queue.current.playlist.author.name}\``,
                    inline: true,
                },
                {
                    name: '🎶 Số bài hát có trong playlist:',
                    value: `\`> ${queue.current.playlist.tracks.length} bài hát\``,
                    inline: true,
                })
        }
        console.log(queue.getPlayerTimestamp().current)
        return message.channel.send({embeds:[embed]})
    }
}