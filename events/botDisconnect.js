const ms = require('ms')
module.exports = {
    name: 'botDisconnect',
    player: true,
    async run (queue) {
        queue.metadata.send('❌ | Bot bị ngắt kết nối với Voice Channel.').then(m => {
            setTimeout(async () => {
                m.delete()
            }, ms('10s'))
        })
    }
}