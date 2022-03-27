const { checkSameRoom, noMusicEmbed } = require('../../util/utils');
const { MessageEmbed } = require('discord.js')
const ms = require('ms')

module.exports = {
    name: 'pause',
    aliases: ['tamdung'],
    category: 'music',
    description: 'Tạm dừng phát nhạc trên đài phát thanh',
    usage: ',pause xong thế thôi',
    run: async (client, message, args) => {
        if (checkSameRoom(message)) return;
        const queue = client.player.getQueue(message.guild.id)
        if (!queue || !queue.nowPlaying()) return noMusicEmbed(message);
        await queue.setPaused(true);
        await message.channel.send('✅ | Đã tạm dừng bài hát.').then(m => {
            setTimeout(async() => {
                m.delete()
            }, ms('5s'))
        })
    },
};