const { checkSameRoom, noMusicEmbed } = require('../../util/utils')
const ms = require('ms')

module.exports = {
    name: 'shuffle',
    desription: 'Xáo trộn thứ tự các bài hát trong queue',
    category: 'music',
    run: async(client, message, args) => {
        const queue = client.player.getQueue(message.guild.id)
        if (!queue || !queue.nowPlaying()) noMusicEmbed(message)
        if (checkSameRoom(message)) return;
        await queue.shuffle();
        message.channel.send('✅ | Đã xáo trộn hàng chờ').then(m => {
            setTimeout(async() => {
                m.delete()
            }, ms('5s'))
        })
    },
};