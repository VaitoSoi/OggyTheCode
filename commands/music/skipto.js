const { Client, Message } = require('discord.js')
const { player } = require('../../index')

module.exports = {
    name: 'skipto',
    aliases: ['chuyenden'],
    description: 'Chuyển đến 1 bài hát trong hàng chờ.',
    usage: '<số thứ tự của bài hát>',
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async(client, message, args) => {
        const queue = player.getQueue(message.guild)
        if (isNaN(Number(args[0]))) return message.channel.send('🔴 | Vui lòng nhập 1 con số.')
        let track  = Number
        if (Number(args[0]) >= 1) track = Number(args[0]) - 1
        else if (Number(args[0]) == 0) track = Number(args[0]) 
        if (!message.member.voice.channelId) return message.channel.send('🛑 | Vui lòng vào voice channel!')
        if (!queue || !queue.nowPlaying) return message.channel.send('🛑 | Không phát hiện hàng chờ.')
        if (!queue.tracks[Number(args[0])]) return message.channel.send('🛑 | Không tìm thấy bài hát trong hàng chờ !')
        message.channel.send('⏭ | Sẽ chuyển tới bài: ```' + queue.tracks[track] + '```')
        queue.skipTo(track)
    }
}