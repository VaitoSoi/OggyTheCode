const mineflayer = require('mineflayer')
const { MessageEmbed } = require('discord.js')
const sendRestart = require('../modules/chat').restart
const sendChat = require('../modules/chat').chat
const color = require('../modules/chat').colors

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
        if (restartTime.test(msg.toString())
            && !['1s', '2s', '3s'].includes(restartTime.exec(msg.toString())[1]))
            sendRestart(bot.client1, bot.client2, restartTime.exec(msg.toString())[1])
        const restartNow = /^UltimateAutoRestart » Restarting... join back soon!$/
        if (restartNow.test(msg.toString())) {
            sendRestart(bot.client1, bot.client2, '', true)
            bot.end('Restart')
        }
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
        if (!bot.client1.channels.cache.get(process.env.DM_CHANNEL)) return
        let test = false;
        [
            'dùng lệnh/anarchyvn  để vào server.',
            'đang vào anarchyvn...',
            /^UltimateAutoRestart » Restarting in (.+)!$/,
            /^UltimateAutoRestart » Restarting... join back soon!$/,
            /^nhắn cho (.+)$/,
            /^(.+) nhắn: (.+)$/,
            /^<(.+)> (.+)$/,
            'CommandWhitelist > No such command.',
            /^(.+) has made the advancement (.+)$/,
            /^Nếu bạn yêu thích server anarchyvn.net thì đừng quên vote tại đây (.+)$/,
            'Please log-in in order to use the chat or any commands!',
            /^(.+) joined the game$/,
            /^CS: (.+)$/,
            /^UltimateAutoRestart » CONSOLE forced a restart. Restarting in (.+)$/
        ].forEach(text => {
            if (typeof text == 'object') test = text.test(msg.toString().trim()) ? true : test
            else if (typeof text == 'string') test = msg.toString().trim() == text ? true : test
        })
        if (test == false) bot.client1.channels.cache.get(process.env.DM_CHANNEL).send('```' + msg.toString() + '```')
    }
}