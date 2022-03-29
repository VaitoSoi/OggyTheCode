const setrole = require('../../models/setrole');
const { Message } = require('discord.js')

module.exports = {
    name: 'deleterole',
    category: 'moderation',
    aliases: ['delrole'],
    description: 'Xóa data của 1 channel.',
    permissions: ['MANAGE_ROLES'],
    /**
     * 
     * @param {*} client 
     * @param {Message} message 
     * @param {*} args 
     * @returns 
     */
    run: async (client, message, args) => {
        const type = args[0]
        if (!type) return message.channel.send('Vui lòng chọn 1 trong những role sau: \`mute, restart\`')
        if (type !== 'mute' && type !== 'restart') return message.channel.send('Vui lòng chọn 1 trong những role sau: \`mute, restart\`')
        setrole.findOne({ guildid: message.guild.id }, async (err, data) => {
            if (err) throw err;
            if (type === 'mute') {
                setrole.findOneAndUpdate({ guildid: message.guild.id }, { $set: { mute: 'No data' } }, async (err, data) => {
                    if (err) throw err;
                    message.channel.send(`Đã xóa data của role \`${type}\``)
                    data.save()
                })

            }
            if (type === 'restart') {
                setrole.findOneAndUpdate({ guildid: message.guild.id }, { $set: { restart: 'No data' } }, async (err, data) => {
                    if (err) throw err;
                    message.channel.send(`Đã xóa data của role \`${type}\``)
                    data.save()
                })
            }
        })
    }
}