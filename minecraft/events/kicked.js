const send = require('../modules/sendChat')
const { MessageEmbed } = require('discord.js')
const color = require('../modules/color.json')
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
        const r1 = /^kết nối lại (.+) để vào server$/
        const r1a = /^(.+)kết nối lại (.+) để vào server(.+)$/
        const r2 = /^bot sentry$/
        let obj = JSON.parse(reason.toString())
        if (obj.extra) {
            obj.extra.forEach(e => {
                if (!e.text) return
                e.text.split('\n').forEach(text => {
                    if (r1.test(text.toString().toLowerCase())
                        || r1a.test(text.toString().toLowerCase())
                        || r2.test(text.toString().toLowerCase())) {
                        if (bot.login == 0) clearTimeout(bot.reconnect)
                        send(bot.client1, bot.client2, new MessageEmbed()
                            .setDescription(
                                `Bot đã mất kết nối với server\n` +
                                `Lý do: \`Anti_bot\`\n` +
                                `Đang kết nối lại...`
                            )
                            .setColor(color.red), true
                        )
                        setTimeout(() => {
                            require('../main')(bot.client1, bot.client2)
                        }, 5 * 1000);
                    }
                })
            })
        } else
            send(bot.client1, bot.client2, new MessageEmbed()
                .setDescription(reason.toString())
                .setColor(color.red), true)
    }
}