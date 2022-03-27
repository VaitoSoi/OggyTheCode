const kd = require('../../models/kd')
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'firstkill',
    aliases: ['fk'],
    description: 'Dùng để kiêm tra lần chết đầu tiên trong server 2y2c.org',
    usage: '<Tên ingame, Vd: VaitoSoi>',
    run: async(client, message, args) => {
        const user = args[0]
        kd.findOne({ username: user }, async(err, data) => {
            if (err) throw err;
            if (data) {
                if (!data.firstkill) return message.channel.send('Không tìm thấy dữ liệu')
                message.channel.send({embeds:[new MessageEmbed()
                    .setDescription(data.firstkill)
                    .setColor('RANDOM')]}
                )
            } else {
                message.channel.send('Không tìm thấy dữ liệu')
            }
        })
    }
}