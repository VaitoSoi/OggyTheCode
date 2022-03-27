const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'trackAdd',
    player: true,
    async run(queue) {
        const client = queue.metadata.client
        const request = client.users.cache.get(`${queue.tracks[Number(queue.tracks.length) - 1].requestedBy.id}`)
        queue.metadata.send({
            embeds: [new MessageEmbed()
                .setAuthor({ name: `${client.user.tag}`, iconURL: client.user.avatarURL() })
                .setTitle('Thông tin về bài hát vừa được thêm vào hàng chờ.')
                .addFields({
                    name: 'Tên bài hát:',
                    value: '```' + `${queue.current.title}` + '```'
                },
                    {
                        name: '⏱ Thời gian: ',
                        value: `\`> ${queue.tracks[Number(queue.tracks.length) - 1].duration}\``,
                        inline: true,
                    },
                    {
                        name: '🤵 Bởi:',
                        value: `\`> ${queue.tracks[Number(queue.tracks.length) - 1].author}\``,
                        inline: true,
                    },
                    {
                        name: '🎧 Yêu cầu bởi:',
                        value: `\`> ${request.tag}\``,
                        inline: true,
                    })
                .setColor('RANDOM')
            ]
        }).then((m) => setTimeout(() => m.delete(), 30 * 1000))
    }
}