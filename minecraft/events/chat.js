const mineflayer = require('mineflayer')

module.exports = {
    name: 'chat',
    /**
     * 
     * @param {mineflayer.Bot} bot 
     * @param {String} username 
     * @param {String} chat 
     */
    async run(bot, username, chat) {
        let prefix = '!'
        let msg = chat.toString()
        let args = msg.trim().split(/ +/g)
        if (args[0] == '>') args = args.slice(1)
        if (!args[0]) return
        //if (username == bot.player.username) return
        if (args[0] == bot.player.username) return bot.chat(`Prefix: ${prefix} | Dùng ${prefix}help để biết thêm thông tin về các lệnh`)
        if (!args[0].startsWith(prefix)) return
        args[0] = args[0].slice(prefix.length)
        const cmd = await bot.cmds.find(cmd => cmd.name === args[0])
            || await bot.cmds.find(
                cmd =>
                    cmd.aliases != null && Array.isArray(cmd.aliases)
                        ? cmd.aliases.includes(args[0])
                        : false
            )
        if (!cmd) return
        args = [username.toString()].concat(args)
        if (username == bot.player.username) await require('node:timers/promises').setTimeout(1000)
        cmd.run(bot, args)
    }
}