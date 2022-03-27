const { checkSameRoom, noMusicEmbed } = require('../../util/utils');
const { MessageEmbed } = require('discord.js')
const ms = require('ms')

module.exports = {
    name: 'stop',
    category: 'music',
    aliases: ['dunglai'],
    description: 'Dừng phát nhạc trên đài phát thanh',
    usage:',stop thế thôi',
    run: async (client, message, args) => {
        if (checkSameRoom(message)) return;
        const queue = client.player.getQueue(message.guild.id)
        if (!queue || !queue.nowPlaying()) return noMusicEmbed(message);
        await queue.destroy();
        message.channel.send('✅ | Đã dừng phát nhạc.').then(m => {
            setTimeout(async() => {
                m.delete()
            }, ms('5s'))
        })
    }
}

