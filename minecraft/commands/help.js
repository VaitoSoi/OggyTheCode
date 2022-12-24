const mineflayer = require('mineflayer')
const wait = require('node:timers/promises').setTimeout

module.exports = {
    name: 'help',
    aliases: ['h', 'sos'],
    usage: '[command-name]',
    description: 'Hiện các lệnh hiện có',
    /**
     * 
     * @param {mineflayer.Bot} bot 
     * @param {String[]} args 
     */
    run: async (bot, args) => {
        const cmd = await bot.cmds.find(cmd => cmd.name === args[2])
            || await bot.cmds.find(
                cmd =>
                    cmd.aliases != null && Array.isArray(cmd.aliases)
                        ? cmd.aliases.includes(args[2])
                        : false
            )
        if (!args[2] || !cmd) bot.chat(`Các lệnh hiện có: ${bot.cmds.map(e => e.name).join(', ')}`)
        else {
            let str = ''
            if (Object.keys(bot.players).includes(args[0])
                && args[0] != bot.player.username) str = `/w ${args[0]} `
            bot.chat(`${str}Name: ${cmd.name}`)
            await wait(1000).catch(e => {})
            bot.chat(`${str}Description: ${cmd.description ? cmd.description : 'Không có mô tả'}`)
            await wait(1000).catch(e => {})
            bot.chat(`${str}Aliases: ${cmd.aliases ? cmd.aliases.join(', ') : 'Không có tên gọi khác'}`)
            await wait(1000).catch(e => {})
            bot.chat(`${str}Useage: !${cmd.name} ${cmd.usage ? cmd.usage : ''}`)
        }
    }
}