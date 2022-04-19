const setchannel = require('../../models/setchannel');
const { Message } = require('discord.js')

module.exports = {
    name: 'deletechannel',
    category: 'moderation',
    aliases: ['delchannel'],
    description: 'Lệnh đã bị khai tử',
    permissions: ['MANAGE_CHANNELS'],
    /**
     * 
     * @param {*} client 
     * @param {Message} message 
     * @param {*} args 
     * @returns 
     */
    run: async (client, message, args) => {
        return message.reply('🛑 | Lệnh đã bị khai tử!\n▶ | Vui lòng dùng lệnh `config`!')
        if (!message.member.permissions.has('MANAGE_CHANNELS')) return message.reply('🛑 | Bạn thiếu quyền `MANAGE_CHANNELS`')
        const type = args[0]
        if (!type) return message.channel.send('Vui lòng chọn 1 trong những loại channel sau \`mute, ban, kick, warn, welcome, goodbye, livechat\`')
        if (type !== 'mute' && type !== 'ban' && type !== 'kick' && type !== 'welcome' && type !== 'warn' && type !== 'goodbye' && type !== 'livechat') return message.channel.send('Vui lòng chọn 1 trong những loại channel sau \`mute, ban, kick, warn, welcome, goodbye, livechat\`')
        setchannel.findOne({ guildid: message.guild.id }, async (err, data) => {
            if (err) throw err;
            if (type === 'mute') {
                setchannel.findOneAndUpdate({ guildid: message.guild.id }, { $set: { mute: 'No data' } }, async (err, data) => {
                    if (err) throw err;
                    message.channel.send(`Đã xóa data của channel ${type}`)
                    data.save()
                })

            } else if (type === 'ban') {
                setchannel.findOneAndUpdate({ guildid: message.guild.id }, { $set: { ban: 'No data' } }, async (err, data) => {
                    if (err) throw err;
                    message.channel.send(`Đã xóa data của channel ${type}`)
                    data.save()
                })
            } else if (type === 'kick') {
                setchannel.findOneAndUpdate({ guildid: message.guild.id }, { $set: { kick: 'No data' } }, async (err, data) => {
                    if (err) throw err;
                    message.channel.send(`Đã xóa data của channel ${type}`)
                    data.save()
                })
            } else if (type === 'warn') {
                setchannel.findOneAndUpdate({ guildid: message.guild.id }, { $set: { warn: 'No data' } }, async (err, data) => {
                    if (err) throw err;
                    message.channel.send(`Đã xóa data của channel ${type}`)
                    data.save()
                })
            } else if (type === 'welcome') {
                setchannel.findOneAndUpdate({ guildid: message.guild.id }, { $set: { welcome: 'No data' } }, async (err, data) => {
                    if (err) throw err;
                    message.channel.send(`Đã xóa data của channel ${type}`)
                    data.save()
                })
            } else if (type === 'goodbye') {
                setchannel.findOneAndUpdate({ guildid: message.guild.id }, { $set: { goodbye: 'No data' } }, async (err, data) => {
                    if (err) throw err;
                    message.channel.send(`Đã xóa data của channel ${type}`)
                    data.save()
                })
            } else if (type === 'livechat') {
                setchannel.findOneAndUpdate({ guildid: message.guild.id }, { $set: { livechat: 'No data' } }, async (err, data) => {
                    if (err) throw err;
                    message.channel.send(`Đã xóa data của channel ${type}`)
                    data.save()
                })
            } else if (type === 'submitshow') {
                setchannel.findOneAndUpdate({ guildid: message.guild.id }, { $set: { submitshow: 'No data' } }, async (err, data) => {
                    if (err) throw err;
                    message.channel.send(`Đã xóa data của channel ${type}`)
                    data.save()
                })
            } else if (type === 'submitnoti') {
                setchannel.findOneAndUpdate({ guildid: message.guild.id }, { $set: { submitnoti: 'No data' } }, async (err, data) => {
                    if (err) throw err;
                    message.channel.send(`Đã xóa data của channel ${type}`)
                    data.save()
                })
            }
        })
    }
}