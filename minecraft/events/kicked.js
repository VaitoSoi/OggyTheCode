const send = require('../modules/chat').chat
const { MessageEmbed } = require('discord.js')
const color = require('../modules/chat').colors
const { Bot } = require('mineflayer')

module.exports = {
    name: 'kicked',
    /**
     * 
     * @param {Bot} bot 
     * @param {String} reason 
     * @param {Boolean} login 
     */
    async run(bot, reason, login) {
        const flame_cord_1 = /^kết nối lại (.+) để vào server$/
        const flame_cord_2 = /^flamecord$/
        const flame_cord_3 = /^ nếu bạn không vào được hãy báo cáo với owner$/
        const bot_sentry_1 = /^bot sentry$/
        let obj = JSON.parse(reason.toString())
        console.log(obj)
        if (obj.extra) {
            obj.extra.forEach(e => {
                if (!e.text) return
                let str = ''
                e.text.split('\n').forEach(text => {
                    if (flame_cord_1.test(text.toString().toLowerCase())
                        || bot_sentry_1.test(text.toString().toLowerCase())) {
                        send(bot.client1, bot.client2, new MessageEmbed()
                            .setDescription(
                                `Bot đã mất kết nối với server\n` +
                                `Lý do: \`Anti_bot\`\n` +
                                `Đang kết nối lại...`
                            )
                            .setColor(color.red), true
                        )
                        clearTimeout(bot.reconnect)
                        bot.reconnect = setTimeout(() => {
                            require('../main')(bot.client1, bot.client2)
                        }, 5 * 1000);
                    } if (flame_cord_2.test(text.toString().toLowerCase())
                        || flame_cord_3.test(text.toString().toLowerCase())) return
                    else if (text.trim() != '') str += `${text}\n`
                })
                if (str != '') send(bot.client1, bot.client2, new MessageEmbed()
                    .setDescription(
                        'Bot bị kick ra khỏi server\n' +
                        `Lý do: ${str}`
                    )
                    .setColor(color.red), true)
            })
        } else {
            if (obj.text && obj.text.toLowerCase() == 'you are already connected to this proxy!') {
                if (bot.login == 0) clearTimeout(bot.reconnect)
            } else if (obj.text.split('\n').join(' ').trim() == '') return
            else
                send(bot.client1, bot.client2, new MessageEmbed()
                    .setDescription(
                        'Bot bị kick ra khỏi server\n' +
                        `Lý do: ${obj.text ? obj.text.toString() : 
                            `${obj.translate == 'multiplayer.disconnect.kicked' ? 'Kick bởi Admin' : 'null'}`}`
                    )
                    .setColor(color.red), true)
        }
    }
}