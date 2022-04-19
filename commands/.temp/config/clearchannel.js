const setchannel = require('../../models/setchannel')
const { Message } = require('discord.js')

module.exports = {
    name: 'clearchannel',
    category: 'moderation',
    aliases: ['deleteallchannel', 'delallchannel'],
    description: 'Lệnh đã bị khai tử',
    permissions: ['MANAGE_CHANNELS'],
    /**
     * 
     * @param {*} client 
     * @param {Message} message 
     * @param {*} args 
     */
    run: async(client, message, args) => {
        return message.reply('🛑 | Lệnh đã bị khai tử!\n▶ | Vui lòng dùng lệnh `config`!')
        if (!message.member.permissions.has('MANAGE_CHANNELS')) return message.reply('🛑 | Bạn thiếu quyền `MANAGE_CHANNELS`')
        setchannel.findOne({ guildid : message.guild.id }, async(err, data) => {
            if(err) throw err;
            if(data){
                await setchannel.findOneAndDelete({ guildid : message.guild.id })
                message.channel.send('Đã xóa các data về channel.')
                data.save()
            } else {
                message.channel.send('Không tìm thấy data.')
            }
        })
    }
}