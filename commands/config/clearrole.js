const setrole = require('../../models/setrole')

module.exports = {
    name: 'clearrole',
    category: 'moderation',
    aliases: ['deleteallrole', 'delallrole'],
    description: 'Xóa hết những channel đã set',
    permissions: ['MANAGE_ROLES'],
    run: async(client, message, args) => {
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