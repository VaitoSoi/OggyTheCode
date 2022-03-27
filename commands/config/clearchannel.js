const setchannel = require('../../models/setchannel')

module.exports = {
    name: 'clearchannel',
    category: 'moderation',
    aliases: ['deleteallchannel', 'delallchannel'],
    description: 'Xóa hết những channel đã set',
    permissions: ['MANAGE_CHANNELS'],
    run: async(client, message, args) => {
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