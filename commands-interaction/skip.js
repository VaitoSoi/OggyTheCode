const { CommandInteraction } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Bỏ qua 1 bài hát'),
    /**
    * 
    * @param {CommandInteraction} interaction 
    */ 
    run: async(interaction) => {
        const client = interaction.client

        const queue = client.player.getQueue(interaction.guild.id)
        if (!queue || !queue.nowPlaying()) return interaction.reply('🛑 | Hàng chờ đang trống !')
        if (interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) return interaction.reply('🛑 | Vui lòng vào chung channel để dùng lệnh!')
        await queue.skip();
    }
} 