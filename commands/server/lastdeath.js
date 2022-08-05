const kd = require('../../models/kd')
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'lastdeath',
    aliases: ['ld'],
    description: 'Dùng để kiêm tra lần chết gần nhất trong server anarchyvn.net',
    usage: '<Tên ingame, Vd: VaitoSoi>',
    run: async(client, message, args) => {
        const user = args[0]
        kd.findOne({ username: user }, async(err, data) => {
            if (err) throw err;
            if (data) {
                if (!data.lastdeath) return message.channel.send('Không tìm thấy dữ liệu')
                message.channel.send({embeds:[new MessageEmbed()
                    .setDescription(data.lastdeath)
                    .setColor('RANDOM')]}
                )
            } else {
                message.channel.send('Không tìm thấy dữ liệu')
            }
        })
    }
}