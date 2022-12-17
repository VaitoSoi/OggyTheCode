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
        chat.chat(bot.client1, bot.client2, new MessageEmbed()
            .setDescription(msg.toString())
            .setColor(embedColor), false
        )
        if (msg.toString().trim().toLowerCase() == 'dùng lệnh/anarchyvn  để vào server.') {
            await wait(1000)
            bot.chat('/anarchyvn');
            chat.chat(bot.client1, bot.client2, new MessageEmbed()
                .setDescription('Đã nhập `/anarchyvn`')
                .setColor(chat.colors.green), true)
        }
        /*
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
            /^Shop: (.+)$/,
            'Please log-in in order to use the chat or any commands!',
            /^(.+) joined the game$/,
            /^CS: (.+)$/,
            /^UltimateAutoRestart » CONSOLE forced a restart. Restarting in (.+)$/,
            /^(.+) (has completed the challenge|reached the goal) (.+)$/,
            /^[AFK+] (.+)$/,
            'Already connecting to this server!',
            /^Exception Connecting:ReadTimeoutException : (.+)$/,
            /^[Broadcast] (.+)$/,
            ...chat.death_message
        ].forEach(text => {
            if (typeof text == 'object') test = text.test(msg.toString().trim()) ? true : test
            else if (typeof text == 'string') test = msg.toString().trim() == text ? true : test
        })
        if (test == false) bot.client1.channels.cache.get(process.env.DM_CHANNEL).send('```' + msg.toString() + '```')
        chat.death_message.forEach(reg => {
            if (reg.test(msg.toString().trim())) {
                const exce = reg.exec(msg.toString().trim())
                const victim = exce[1]
                const killer = exce[2]
                return data.kill_death(msg.toString().trim(), victim, killer)
            }
        })
        */
    }
}