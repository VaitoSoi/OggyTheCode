const { MessageEmbed } = require('discord.js')
module.exports = {
    name: 'avatar',
    category: 'user',
    description: 'T sẽ show khuôn mặt xênh đệp của m',
    usage:'[id hoặc tag]',
    aliases: ['avt'],
    run: (client, message, args) => {
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member
            const URL = member.user.avatarURL({ format: 'jpg', dynamic: true, size: 1024})
            const embed = new MessageEmbed()
                .setImage(URL)
                .setURL(URL)
                .setTitle('Nguồn của avatar')
                message.reply({embeds :[embed]})
     }
 }