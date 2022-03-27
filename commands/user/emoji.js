const { parse } = require('twemoji-parser');
const { Util, MessageEmbed } = require('discord.js')

module.exports = {
    name: 'emoji',
    description: 'Để phóng to emoji(thường dành cho mấy thằng bị cận nặng như thg dev)',
    usage: 'emoji <cái emoji mà m cần phóng to ra>',
    aliases: ['e'],
    category: 'user',
    run: (client, message, args) => {
        const emoji = args[0]
        if (!emoji) return message.channel.send("J z cha nội ko nhập emoji lấy j show.");

        let custom = Util.parseEmoji(emoji);
        const embed = new MessageEmbed()
            .setTitle("Nè cha nội");

        if (custom.id) {
            let link = `https://cdn.discordapp.com/emojis/${custom.id}.${cutom.animated ? "gif" : "png"}`
            embed.setImage(link)
                .setFooter({ text: `Emoji Id ${custom.id}` });
            return message.channel.send({ embeds: [embed] });
        } else {
            let parsed = parse(emoji, { assetType: 'png' });
            if (!parsed[0]) return message.channel.send("Có cái quần đùi j đâu ?");
            embed.setImage(parsed[0].url);
            return message.reply({ embeds: [embed] })
        }
    }
}