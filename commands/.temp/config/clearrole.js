const setrole = require('../../models/setrole')
const { Message } = require('discord.js')

module.exports = {
    name: 'clearrole',
    category: 'moderation',
    aliases: ['deleteallrole', 'delallrole'],
    description: 'Lệnh đã bị khai tử',
    permissions: ['MANAGE_ROLES'],
    /**
     * 
     * @param {*} client 
     * @param {Message} message 
     * @param {*} args 
     * @returns 
     */
    run: async(client, message, args) => {
        return message.reply('🛑 | Lệnh đã bị khai tử!\n▶ | Vui lòng dùng lệnh `config`!')
        if (!message.member.permissions.has('MANAGE_ROLES')) return message.reply('🛑 | Bạn thiếu quyền `MANAGE_ROLES`')
        setrole.findOne({ guildid : message.guild.id }, async(err, data) => {
            if(err) throw err;
            if(data){
                await setrole.findOneAndDelete({ guildid : message.guild.id })
                message.channel.send('Đã xóa các data về channel.')
                data.save()
            } else {
                message.channel.send('Không tìm thấy data.')
            }
        })
    }
}