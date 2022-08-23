const mineflayer = require('mineflayer')
const chat = require('../modules/chat').chat
const { MessageEmbed } = require('discord.js')
const color = require('../modules/chat').colors
const ms = require('ms')

module.exports = {
    name: 'end',
    /**
     * 
     * @param {mineflayer.Bot} bot 
     * @param {String} reason
     */
    async run(bot, reason) {
        bot.login = 0
        bot.joinAt = 0
        let reconnect = '3m'
        let r = reason
        let auto = true
        if (reason.toLowerCase().split(' ')[0] == 'admin') 
            reason.toLowerCase().split(' ').slice(1).forEach((args) => {
                let key, value, i = 0
                args.split('').forEach((c) => {
                    if (c === ':') {
                        key = args.split('').slice(0, i).join('').toLowerCase()
                        value = args.split('').splice(i + 1).join('')
                    } else i++
                });
                if (!['reason', 'time', 'auto-reconnect'].includes(key)) return
                if (key == 'reason')
                    r = value == 'restart'
                        ? 'Yêu cầu Restart từ Admin'
                        : value == 'disconnect'
                            ? 'Yêu cầu Disconnect từ Admin'
                            : 'Yêu cầu từ Admin'
                else if (key == 'time') reconnect = value
                else if (key == 'auto-reconnect')
                    auto = value == 'true'
                        ? true
                        : false
            })
        else if (reason.toLowerCase() == 'restart') reconnect = '5m'
        else if (reason.toLowerCase() == 'socketclosed') reconnect = '1m'
        chat(bot.client1, bot.client2, new MessageEmbed()
            .setDescription(
                `Bot đã mất kết nối với server\n` +
                `Lý do: \`${r.toString()}\`\n` +
                `Kết nối lại sau ${reconnect}`
            )
            .setColor(color.red), true
        )
        clearTimeout(bot.reconnect)
        bot.reconnect = setTimeout(() => {
            if (auto == true) {
                chat(bot.client1, bot.client2, new MessageEmbed()
                    .setDescription(`Đang kết nối lại với server....`)
                    .setColor(color.yellow), true
                )
                require('../main')(bot.client1, bot.client2)
            }
        }, ms(reconnect));
    }
}