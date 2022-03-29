const { VoiceState } = require('discord.js')
const { player } = require('../index')
const ms = require('ms')

module.exports = {
    name: 'voiceStateUpdate',
    /**
     * 
     * @param {VoiceState} oldState 
     * @param {VoiceState} newState 
     */
    async run(oldState, newState) {
        const guild = oldState ? oldState.guild : newState.guild
        const queue = player.getQueue(guild)
        let timeout = ''
        if (oldState.channelId && !newState.channelId && !guild.me.voice.channelId && queue) {
            if (!queue) return
            queue.destroy()
            queue.metadata.send({ content: '🛑 | Xóa queue do bot bị ngắt kết nối với <#' + oldState.id + '>' })
        } else if (oldState.channelId === guild.me.voice.channelId && !newState.channelId && guild.me.voice.channelId) {
            if (!queue) return
            if (guild.me.voice.channel.members.size == 1) {
                queue.metadata.send({ content: '🛑 | Rời khỏi Voice channel sau 30s' })
                    .then((m) => setTimeout(() => {
                        m.delete()
                    }, 10 * 1000))
                global.timeout = setTimeout(() => {
                    queue.stop()
                    queue.metadata.send({ content: '🛑 | Xóa Queue và rời khỏi voice channel do không có ai.' }).then((m) => m.delete(), 30 * 1000)
                }, 10 * 1000)
            }
        } else if (guild.me.voice.channelId && newState.channelId === guild.me.voice.channelId) {
            if (!queue) return
            if (newState.member.user.id === guild.me.user.id) {
                return queue.metadata.send({ content: '🟢 | Đã kết nối với channel <#' + guild.me.voice.channelId + '>' })
                    .then(m => {
                        setTimeout(async () => {
                            m.delete()
                        }, ms('10s'))
                    })
            } else {
                if (timeout && timeout !== '') clearTimeout(timeout)
                if (newState.channelId !== oldState.channelId && oldState.channelId) queue.metadata.send({ content: '🟢 | Tiếp tục phát bài hát.' }).then((m) => setTimeout(() => m.delete(), 10 * 1000))
            }
        }
    }
}