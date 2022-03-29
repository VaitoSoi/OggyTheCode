const ms = require('ms')
module.export = {
    name: 'channelEmpty',
    player: true,
    async run(queue) {
        queue.metadata.send('❌ | Voice Channel trống, đang rời channel...').then(m => {
            setTimeout(async () => {
                m.delete()
            }, ms('10s'))
        })
        setTimeout(() => {
            if (queue.metadata.guild.me.voiceChannel !== undefined) {
                queue.metadata.me.voiceChannel.leave();
            } else return
        }, ms('1s'))
    }
}