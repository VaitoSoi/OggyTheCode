const { CommandInteraction } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Tiếp tục phát 1 bài hát'),
    /**
    * 
    * @param {CommandInteraction} interaction 
    */ 
    run: async(interaction) => {
        if (interaction.deferred === false) await interaction.deferReply()
        const client = interaction.client

        const queue = client.player.getQueue(message.guild.id)
        if (!queue || !queue.nowPlaying()) return interaction.editReply('🛑 | Hàng chờ đang trống !')
        if (interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) return interaction.editReply('🛑 | Vui lòng vào chung channel để dùng lệnh!')
        await queue.setPaused(false);
        interaction.editReply('▶ | Đã tiếp tục bài hát')
        setTimeout(() => {
            interaction.deleteReply()
        }, 5000);
    }
} 