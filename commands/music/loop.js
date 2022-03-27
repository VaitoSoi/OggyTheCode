const { QueueRepeatMode } = require('discord-player')
const { noMusicEmbed } = require('../../util/utils')

module.exports = {
    name: 'loop',
    category: 'music',
    aliases: ['laplai'],
    description: 'Dùng để lặp lại hàng chờ',
    usage: '<off/track/queue/autoplay>',
    run: async (client, message, args) => {
        const queue = client.player.getQueue(message.guild.id)
        if(!queue || !queue.nowPlaying()) noMusicEmbed(message)
        const type = args[0]
        if (!type || type !== 'off' || type !== 'track' || type !== 'queue' || type !== 'autoplay') return messgae.channel.send('Vui lòng nhập loại "<off/track/queue/autoplay>"')
        var loopmode = 0
        if (type === 'off') loopmode = 0
        if (type === 'track') loopmode = 1
        if (type === 'queue') loopmode = 2
        if (type === 'autoplay') loopmode = 3
        const success = queue.setRepeatMode(loopmode);
        const mode = loopmode === QueueRepeatMode.TRACK ? "🔂" : loopmode === QueueRepeatMode.QUEUE ? "🔁" : "▶";
        message.reply({ content: success ? `${mode} | Cập nhật chế độ lặp lại!` : "❌ | Xảy ra lỗi!" }).then((mgs) => {
            setTimeout(() => {
                msg.delete()
            }, ms('5s'))
        })
    }
}