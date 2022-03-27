const { Client, Message, MessageEmbed } = require('discord.js')

module.exports = {
    name: '2y2c',
    description: "Xem queue của server `2y2c.org`",
    aliases: ['2y2c-queue', 'queue-2y2c', 'hangcho-2y2c'],
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async (client, message, args) => {
        const embed1 = new MessageEmbed()
            .setAuthor({
                name: 'Hàng chờ 2y2c',
                iconURL: 'https://cdn.discordapp.com/attachments/936994104884224020/943075438056603698/2y2c.png'
            })
            .setTitle('Cách hoạt động của việc tính hàng chờ.')
            .setDescription('Hàng chờ được tính bằng 2 cách: \n +  QueueChecker: Login vào server và lấy `Vị trí hàng chờ` đầu tiên mỗi 5m.\n+  OggyTheBot: Lấy số player trong server Bot đang ở trừ tổng player.\n ‼ Cách tính trên chỉ là ước tính và có thể sai sót !')
            .setFooter({
                text: `${client.user.tag}`,
                iconURL: client.user.displayAvatarURL()
            })
            .setTimestamp()
            .setColor('RANDOM')
        message.channel.send({
            embeds: [
                embed1,
            ]
        })
    }
}