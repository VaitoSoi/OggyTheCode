const mineflayer = require('mineflayer')
const { MessageEmbed } = require('discord.js')
const sendRestart = require('../modules/sendRestart')
const sendChat = require('../modules/sendChat')
const color = require('../modules/color.json')

module.exports = {
    name: 'message',
    /**
     * 
     * @param {mineflayer.Bot} bot 
     * @param {*} msg 
     * @param {*} pos 
     * @returns 
     */
    async run(bot, msg, pos) {
        if (msg.toString().trim() == '') return
        let embedColor = color.blue
        const restartTime = /^UltimateAutoRestart » Restarting in (.+)!$/
        if (restartTime.test(msg.toString())) sendRestart(bot.client1, bot.client2, restartTime.exec(msg.toString())[1])
        const restartNow = /^UltimateAutoRestart » Restarting... join back soon!$/
        if (restartNow.test(msg.toString())) sendRestart(bot.client1, bot.client2, '', true)
        const whisper1 = /^nhắn cho (.+)$/
        const whisper2 = /^(.+) nhắn: (.+)$/
        if (whisper1.test(msg.toString()) || whisper2.test(msg.toString())) embedColor = color.pink
        sendChat(bot.client1, bot.client2, new MessageEmbed()
            .setDescription(msg.toString())
            .setColor(embedColor), false
        )
        if (msg.toString().trim().toLowerCase() == 'dùng lệnh/anarchyvn  để vào server.') {
            bot.chat('/anarchyvn');
            sendChat(bot.client1, bot.client2, new MessageEmbed()
                .setDescription('Đã nhập `/anarchyvn`')
                .setColor(color.green), true)
        }
    }
}