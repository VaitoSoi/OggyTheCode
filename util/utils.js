const checkSameRoom = (message) => {
    if (!message.member.voice.channel) return message.reply('M có trg voice channel đâu mà nghe nhạc');
    if (!message.guild.me.voice.channelID || message.guild.me.voice.channelID == message.member.voice.channelID) return;
    return message.reply('Vô chung voice channel với t đi, m mới nghe nhạc đc');
}

const { MessageEmbed } = require('discord.js');
const noMusicEmbed = (message) => {
    message.channel.send({
        embeds: [new MessageEmbed()
            .setColor('RED')
            .setDescription('**❌ | Không có bài hát trong hàng chờ.**')
        ]
    })
}

module.exports.noMusicEmbed = noMusicEmbed,

module.exports.checkSameRoom = checkSameRoom