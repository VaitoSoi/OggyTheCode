const { CommandInteraction } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Xáo trộn hàng chờ'),
    /**
    * 
    * @param {CommandInteraction} interaction 
    */ 
    run: async(interaction) => {
        if (interaction.deferred === false) await interaction.deferReply()
        const client = interaction.client

        const ms = require('ms')
        const queue = client.player.getQueue(interaction.guild.id)
        if (!queue || !queue.nowPlaying()) return interaction.editReply('🛑 | Hàng chờ đang trống !')
        if (interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) return interaction.editReply('🛑 | Vui lòng vào chung channel để dùng lệnh!')
        await queue.shuffle();
        interaction.editReply('✅ | Đã xáo trộn hàng chờ')
        setTimeout(async () => {
            interaction.deleteReply()
        }, ms('5s'))
    }
} 