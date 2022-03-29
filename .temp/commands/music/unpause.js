const { checkSameRoom, noMusicEmbed } = require('../../util/utils');
const ms = require('ms')

module.exports = {
    name: 'unpause',
    aliases: ['resume', 'tieptuc'],
    category: 'music',
    description: 'Tiếp tục phát nhạc trên đài phát thanh',
    usage: ',unpause xong thế thôi',
    run: async (client, message, args) => {
        if (checkSameRoom(message)) return;
        const queue = client.player.getQueue(message.guild.id)
        if (!queue || !queue.nowPlaying()) return noMusicEmbed(message);
        await queue.setPaused(false);
    },
};