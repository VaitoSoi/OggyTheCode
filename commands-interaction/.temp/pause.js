const { CommandInteraction } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Tạm dừng bài hát'),
    /**
    * 
    * @param {CommandInteraction} interaction 
    */
    run: async (interaction) => {
        const client = interaction.client

        const ms = require('ms')
        const queue = client.player.getQueue(message.guild.id)
        if (interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) return interaction.editReply('🛑 | Vui lòng vào chung channel để dùng lệnh!')
        if (!queue || !queue.nowPlaying()) return interaction.editReply('🛑 | Hàng chờ đang trống !')
        await queue.setPaused(true);
        await interaction.editReply('⏸ | Đã tạm dừng bài hát.')
        setTimeout(async () => {
            interaction.deleteReply()
        }, ms('5s'))
    }
} 