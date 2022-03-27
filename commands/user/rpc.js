const { MessageEmbed, Message } = require('discord.js')

const arrayOfStatus = require('../../info/statusArray')

module.exports = {
    name: 'rpc',
    aliases: ['bot-rpc', 'botrpc'],
    usage: '',
    description: 'Dùng để xem các RPC của bot',
    /**
     * @param {Message} message 
     */
    run: async(client, message, args) => {
        message.channel.send({embeds:[new MessageEmbed()
        .setTitle('Các RPC của bot hiện tại.')
        .setDescription(arrayOfStatus.join('\n'))
        .setFooter({text: `${message.author.tag} • ${message.guild.name}`, iconURL: message.author.avatarURL()})
        .setTimestamp()
        .setColor('RANDOM')
        ]})
    }
}