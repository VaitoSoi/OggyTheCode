const window = require('prismarine-windows')
const { MessageEmbed } = require('discord.js')
const color = require('../modules/chat').colors
const send = require('../modules/chat').chat
const mineflayer = require('mineflayer')

module.exports = {
    name: 'windowOpen',
    /**
     * 
     * @param {mineflayer.Bot} bot
     * @param {window.Window} window 
     */
    async run(bot, window) {
        if (Number(window.slots.length) == 63 || Number(window.slots.length) == 62) {
            bot.simpleClick.leftMouse(13);
            send(bot.client1, bot.client2, embed1 = new MessageEmbed()
                .setTitle('Đã click vào cửa sổ `Chuyển Server`')
                .setColor(color.green), true)
        } else if (Number(window.slots.length) == 45 || Number(window.slots.length) == 46) {
            let pin = process.env.MC_PIN.split(' ').map(str => Number(str))
            if (process.env.MC_PIN.split(' ').length <= 1) pin = process.env.MC_PIN.split('').map(str => Number(str))
            bot.simpleClick.leftMouse(pin[0])
            bot.simpleClick.leftMouse(pin[1])
            bot.simpleClick.leftMouse(pin[2])
            bot.simpleClick.leftMouse(pin[3])
            send(bot.client1, bot.client2, embed1 = new MessageEmbed()
                .setTitle('Đã nhập PIN')
                .setColor(color.green), true)
        }
    }
}