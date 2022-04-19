const { CommandInteraction, MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('2y2c')
        .setDescription('Xem hàng chờ của server 2y2c.org'),
    /**
    * 
    * @param {CommandInteraction} interaction 
    */ 
    run: async(interaction) => {
        if (interaction.deferred === false) await interaction.deferReply()
        const client = interaction.client
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
        await interaction.editReply({
            embeds: [
                embed1,
            ]
        })
    }
} 