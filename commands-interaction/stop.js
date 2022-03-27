const { CommandInteraction } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Dừng phát nhạc'),
    /**
    * 
    * @param {CommandInteraction} interaction 
    */
    run: async (interaction) => {
        const client = interaction.client

        const ms = require('ms')
        const queue = client.player.getQueue(message.guild.id)
        if (!queue || !queue.nowPlaying()) return interaction.reply('🛑 | Hàng chờ đang trống !')
        if (interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) return interaction.reply('🛑 | Vui lòng vào chung channel để dùng lệnh!')
        await queue.destroy();
        interaction.reply('✅ | Đã dừng phát nhạc.')
        setTimeout(async () => {
            interaction.deleteReply()
        }, ms('5s'))
    }
} 