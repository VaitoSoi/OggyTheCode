const { CommandInteraction, MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('Chỉnh chế độ lặp lại bài hát')
        .addStringOption(option => option
            .setName('mode')
            .setDescription('Chế độ lặp lại')
            .addChoice('Off', '0')
            .addChoice('Track', '1')
            .addChoice('Queue', '2')
            .addChoice('Autoplay', '3')
            .setRequired(true)
        ),
    /**
    * 
    * @param {CommandInteraction} interaction 
    */
    run: async(interaction) => {
        const client = interaction.client

        const { QueueRepeatMode } = require('discord-player')
        const queue = client.player.getQueue(interaction.guild.id)
        if (!queue || !queue.nowPlaying()) interaction.reply('🛑 | Hàng chờ nhạc đang trống !')
        var loopmode = Number(interaction.options.getString('loopmode'))
        const success = queue.setRepeatMode(loopmode);
        const mode = loopmode === QueueRepeatMode.TRACK ? "🔂" : loopmode === QueueRepeatMode.QUEUE ? "🔁" : "▶";
        interaction.reply({ content: success ? `${mode} | Cập nhật chế độ lặp lại!` : "❌ | Xảy ra lỗi!" })
        setTimeout(() => {
            interaction.deleteReply()
        }, 3 * 1000)
    }
} 