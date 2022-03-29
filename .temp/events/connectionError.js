const ms = require('ms')
module.exports = {
    name: 'connectionError',
    player: true,
    async run (queue) {
        queue.metadata.send('❌ | Đã xảy ra lỗi khi kết nối đến Voice Channel!').then(m => {
            setTimeout(async () => {
                m.delete()
            }, ms('10s'))
        })
    }
}