const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'tracksAdd',
    player: true,
    async run(queue) {
        const client = queue.metadata.client
        queue.metadata.send({
            embeds: [new MessageEmbed()
                .setAuthor({ name: `${client.user.tag}`, iconURL: client.user.avatarURL() })
                .setTitle('Thông tin về playlist vừa thêm vào hàng chờ')
                .addFields({
                    name: '📃 Tên của playlist:',
                    value: `\`> ${queue.tracks[Number(queue.tracks.length) - 1].playlist.title}\``,
                    inline: true
                },
                    {
                        name: '🤵 Chủ của playlist:',
                        value: `\`> ${queue.tracks[Number(queue.tracks.length) - 1].playlist.author.name}\``,
                        inline: true,
                    },
                    {
                        name: '🎶 Số bài hát có trong playlist:',
                        value: `\`> ${queue.tracks[Number(queue.tracks.length) - 1].playlist.tracks.length} bài hát\``,
                        inline: true,
                    })
                .setColor("RANDOM")
            ]
        }).then((m) => setTimeout(() => m.delete(), 30 * 1000))
    }
}