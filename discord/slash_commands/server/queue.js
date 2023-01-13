const { CommandInteraction, MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const { Bot } = require('mineflayer')
const axios = require('axios').default

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Thông tin về hàng chờ | Hiện đang dùng API của Oggy'),
    /**
    * @param {CommandInteraction} interaction
    * @param {Bot} bot
    */
    run: async (interaction, bot) => {
        const res = await (await axios.get(`https://oggy-api.vaitosoi.repl.co/api/queue`))?.data?.queue ?? 'API Error'
        interaction.editReply(
            'Thông tin về hàng chờ của AnarchyVN:\n' +
            '> Hàng chờ: ' + res
        )
    }
}