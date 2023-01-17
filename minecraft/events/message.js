const mineflayer = require('mineflayer')
const { MessageEmbed } = require('discord.js')
const chat = require('../modules/chat')
const data = require('../modules/data')
const wait = require('node:timers/promises').setTimeout

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
        let embedColor = chat.colors.blue
        const restartTime = /^UltimateAutoRestart » Restarting in (.+)!$/
        if (restartTime.test(msg.toString())
            && !['1s', '2s', '3s'].includes(restartTime.exec(msg.toString())[1]))
            chat.restart(bot.client1, bot.client2, restartTime.exec(msg.toString())[1])
        const restartNow = /^UltimateAutoRestart » Restarting... join back soon!$/
        if (restartNow.test(msg.toString())) {
            chat.restart(bot.client1, bot.client2, '', true)
            bot.end('Restart')
        }
        const whisper1 = /^nhắn cho (.+)$/
        const whisper2 = /^(.+) nhắn: (.+)$/
        if (whisper1.test(msg.toString()) || whisper2.test(msg.toString())) embedColor = chat.colors.pink
        if (msg.toString().startsWith('[ANARCHYVN]')) embedColor = chat.colors.red
        if (msg.toString() == 'đang vào AnarchyVN...'
            || msg.toString() == 'Connecting to the server...') embedColor = chat.colors.yellow
        if (msg.toString() == 'Please log-in in order to use the chat or any commands!'
            || msg.toString() == 'Oops something went wrong... Putting you back in queue.'
            || msg.toString() == 'Already connecting to this server!') embedColor = chat.colors.red
        chat.chat(bot.client1, bot.client2, new MessageEmbed()
            .setDescription(msg.toString())
            .setColor(embedColor), false
        )
        if (msg.toString().trim().toLowerCase() == 'dùng lệnh/anarchyvn  để vào server.') {
            await wait(1000).catch(e => { })
            bot.chat('/anarchyvn');
            chat.chat(bot.client1, bot.client2, new MessageEmbed()
                .setDescription('Đã nhập `/anarchyvn`')
                .setColor(chat.colors.green), true)
        }
        //if (!bot.client1.channels.cache.get(process.env.DM_CHANNEL)) return
        //if (msg.toString().startsWith('[ANARCHYVN]')) bot.client1.channels.cache.get(process.env.DM_CHANNEL).send('```' + msg.toString() + '```').catch(e => {})
    }
}