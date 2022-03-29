const { Message, Client } = require('discord.js')

module.exports = {
    name: 'setrole',
    aliases: ['caivaitro'],
    description: 'Để cài 1 vai trò',
    usage: '<id hoặc tag>',
    permissions: ['MANAGE_ROLES'],
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {*} args 
     */
    run: async (client, message, args) => {
        const setrole = require('../../models/setrole')
        const type = args[1]
        if (isNaN(args[2])) {
            const id = message.mentions.roles.first().id
        } else {
            const id = message.guild.roles.cache.get(args[2])
        }
        if (!id) return message.channel.send('Vui lòng ghi ID hoặc tag role')
        if (type.toLowerCase() !== 'restart' && type.toLowerCase() !== 'mute' && !type) return message.channel.send(`Vui lòng chọn 1 trong những lựa chọn sau: \`restart, mute\``)
        if (type.toLowerCase() === 'restart') {
            setrole.findOneAndUpdate({ guildid: message.guildId }, { $set: { restart: `${id.id}` } }, async (err, data) => {
                if (err) throw err;
                if (data) {
                    message.channel.send(`Đã cài vai trò \`@${id.name}\` thành Restart role`)
                } else if (!data) {
                    message.channel.send('Không tìm thấy dữ liệu.\nĐang tạo dữ liệu...')
                    data = new setrole({
                        guildid: message.guildId,
                        guildname: message.guild.name,
                        restart: id.id,
                        mute: 'No data',
                    })
                    data.save()
                    message.channel.send(`Đã tạo dữ liệu.\nĐã cài vai trò \`@${id.name}\` thành Restart role`)
                }
            })
        } else if (type.toLowerCase() === 'mute') {
            setrole.findOneAndUpdate({ guildid: message.guildId }, { $set: { restart: `${id.id}` } }, async (err, data) => {
                if (err) throw err;
                if (data) {
                    message.channel.send(`Đã cài vai trò \`@${id.name}\` thành Restart role`)
                } else if (!data) {
                    message.channel.send('Không tìm thấy dữ liệu.\nĐang tạo dữ liệu...')
                    data = new setrole({
                        guildid: message.guildId,
                        guildname: message.guild.name,
                        restart: 'No data',
                        mute: id.id,
                    })
                    data.save()
                    message.channel.send(`Đã tạo dữ liệu.\nĐã cài vai trò \`@${id.name}\` thành Restart role`)
                }
            })
        }
    }
}