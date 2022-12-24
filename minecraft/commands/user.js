const mineflayer = require('mineflayer')
const wait = require('node:timers/promises').setTimeout

module.exports = {
    name: 'user',
    aliases: ['data', 'stats', 'statics'],
    usage: '<kill|death|kda|join|seen|all> <user_name>',
    description: 'Thông tin về bot',
    /**
     * 
     * @param {mineflayer.Bot} bot 
     * @param {String[]} args 
     */
    run: async (bot, args) => {
        return
        const db = require('../../models/players')
        const chat = args[0] == bot.player.username ? '' : `/w ${args[0]}`
        if (!args[2]) return bot.chat(`${chat} Thiếu lựa chọn 'kill' hoặc 'death'`)
        if (!args[3]) return bot.chat(`${chat} Thiếu 'user_name'`)
        const data = await db.findOne({ name: args[3] == 'me' ? args[0] : args[3] })
        if (!data) return bot.chat(`${chat} Không tìm thấy data :v`)
        switch (args[2]) {
            case 'kill':
            case 'death':
                let kill_death = data[args[2]]
                bot.chat(`${chat} Total ${args[2]}: ${kill_death.record.length}`)
                if (kill_death.total != 0) {
                    await wait(1000)
                    bot.chat(`${chat} First ${args[2]}: ${kill_death.record[0]}`)
                    await wait(1000)
                    bot.chat(`${chat} Last ${args[2]}: ${kill_death.record[kill_death.record.length - 1]}`)
                }
                break;
            case 'kda':
                const kda = (data.kill.record.length / (data.death.record.length == 0 ? 1 : data.death.record.length)).toFixed(0)
                bot.chat(`${chat} KDA: ${kda}`)
                break;
            case 'join':
            case 'seen':
                let join_seen = data.date[args[2]]
                const date = new Date(join_seen * 1000);
                const time = date.toLocaleString('vi-VN')
                bot.chat(`${chat} ${args[2] == 'join' ? 'Đã bắt đầu ghi dữ liệu' : 'Nhìn thấy người chơi lần cuối'} vào lúc: ${time}`)
                break;
            case 'all':
                let all = {
                    kill: data.kill.record.length,
                    death: data.death.record.length,
                    kda: (data.kill.record.length / (data.death.record.length == 0 ? 1 : data.death.record.length)).toFixed(0),
                    join: new Date(data.date.join).toLocaleString('vi-VN'),
                    seen: new Date(data.date.seen).toLocaleString('vi-VN')
                }
                bot.chat(`${chat} Total kill: ${all.kill}`)
                await wait(1000)
                bot.chat(`${chat} Total death: ${all.death}`)
                await wait(1000)
                bot.chat(`${chat} KDA: ${all.kda}`)
                await wait(1000)
                bot.chat(`${chat} Bắt đầu ghi dữ liệu lúc: ${all.join}`)
                await wait(1000)
                bot.chat(`${chat} Thấy người chơi lần cuối lúc: ${all.seen}`)
                break;
            default: bot.chat(`${chat} Key không hợp lệ`)
        }
    }
} 