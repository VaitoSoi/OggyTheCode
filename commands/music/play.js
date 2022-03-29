const ms = require('ms');
const { checkSameRoom } = require('../../util/utils');
const { QueryType } = require('discord-player')
const { player } = require('../../index')
const { Client, Message } = require('discord.js')

module.exports = {
    name: 'play',
    category: 'music',
    aliases: ['p'],
    description: 'Nghe nhạc trên đài phát thanh',
    usage: ',play <tên bài hát hoặc playlist m muốn nghe>',
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String} args 
     * @returns 
     */
    run: async (client, message, args) => {
        const queue = await player.createQueue(message.guild, {
            metadata: message.channel
        });
        if (checkSameRoom(message)) return;
        const music = args.join(" ")
        const searchResult = await player.search(music, {
            requestedBy: message.author,
            searchEngine: QueryType.AUTO
        })
            .catch(() => { message.channel.send('Phát hiện lỗi khi phát nhạc! Lỗi: ```' + err + '```') });
        if (!searchResult || !searchResult.tracks.length) return void message.reply("Không tìm thấy bài hát").then((msg) => {
            setTimeout(() => {
                msg.delete()
            }, ms('5s'))
        });

        try {
            if (!queue.connection) await queue.connect(message.member.voice.channel);
        } catch {
            void player.deleteQueue(message.guild.id);
            return void message.reply({ content: "Không thể tham gia vào voice channel của bạn" })
        }

        await message.channel.send({ content: `⏱ | Đang tải ${searchResult.playlist ? "playlist" : "bài hát"}...` }).then((msg) => { setTimeout(() => { msg.delete() }, 10000) })
        searchResult.playlist ? queue.addTracks(searchResult.tracks) : queue.addTrack(searchResult.tracks[0])
        await queue.play()
    },
};