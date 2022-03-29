const { checkSameRoom, noMusicEmbed } = require('../../util/utils');
const ms = require('ms')

module.exports = {
    name: 'skip',
    category: 'music',
    aliases: ['s', 'next'],
    description: 'Nghe bài hát tiếp theo trên đài phát thanh',
    usage: ',skip xong thế thôi(thg dev nó vẫn chx bt cách lm skipto, ae thông cảm cho nó)',
    run: async (client, message, args) => {
        if (checkSameRoom(message)) return;
        const queue = client.player.getQueue(message.guild.id)
        if (!queue || !queue.nowPlaying()) return noMusicEmbed(message);
        await queue.skip();
    },
};