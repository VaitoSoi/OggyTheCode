const { CommandInteraction, MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const { Bot } = require('mineflayer')
const ms = require('ms')
const axios = require('axios').default

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Thông tin về một user | Hiện đang dùng API của mo0nbot')
        .addStringOption(option => option
            .setName('type')
            .setDescription('Loại thông tin cần lấy')
            .addChoices(
                { name: 'join_date', value: 'joindate' },
                { name: 'play_time', value: 'playtime' },
                { name: 'stats', value: 'stats' },
                { name: 'seen', value: 'seen' }
            )
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('user_name')
            .setDescription('Tên user cần thông tin')
            .setRequired(true)
        ),
    /**
    * @param {CommandInteraction} interaction
    * @param {Bot} bot
    */
    run: async (interaction, bot) => {
        const type = interaction.options.getString('type'),
            user_name = interaction.options.getString('user_name'),
            api = process.env.MO0NBOT_API,
            res = await axios.get(`https://api.mo0nbot.ga/data/anarchyvn/${type}/${user_name}?key=${api}`)
        //console.log(res.data)
        if (res.data.statusCode == 404) return interaction.editReply(`Không thể tìm thấy user \`${user_name}\` trên API`)
        switch (type) {
            case 'joindate':
                interaction.editReply(`Dữ liệu của \`${user_name}\` bắt đầu ghi vào <t:${Math.round(res.data.data.time / 1000)}:F>`);
                break;
            case 'playtime':
                interaction.editReply(`Tổng thời gian onliine của \`${user_name}\` là \`${ms(res.data.data.time)}\``);
                break;
            case 'stats': 
                interaction.editReply(
                    `Thông tin về số lần giết và chết của \`${user_name}\`\n:` +
                    `> **Kill(s)**: ${res.data.data.kills}\n` +
                    `> **Death(s)**: ${res.data.data.deaths}`
                );
                break;
            case 'seens':
                interaction.editReply(`Nhìn thấy \`${user_name}\` lần cuối vào <t:${Math.round(res.data.data.time/1000)}:F>`);
                break;
            default:
                interaction.editReply('Nếu bạn thấy tin nhắn này thì hãy báo cho admin ngay nhé')
        }
    }
}