const { CommandInteraction } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription('Chỉnh volume cho bot')
        .addNumberOption(option => option
            .setName('volume')
            .setDescription('Mức volume muốn chỉnh')
            .setRequired(true)
        ),
    /**
    * 
    * @param {CommandInteraction} interaction 
    */
    run: async (interaction) => {
        const client = interaction.client

        const ms = require('ms')
        const queue = client.player.getQueue(message.guild.id)
        if (!queue || !queue.nowPlaying()) return interaction.editReply('🛑 | Hàng chờ đang trống !')
        if (interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) return interaction.editReply('🛑 | Vui lòng vào chung channel để dùng lệnh!')
        const volume = interaction.options.getNumber('volume')
        if ((volume) < 0 || (volume) > 200) {
            interaction.editReply({ content: "❌ | Volume phải ở trong mức 0-200" });
            setTimeout(() => {
                interaction.deleteReply()
            }, 5000);
        }
        const success = queue.setVolume(volume);
        interaction.editReply({
            content: success ? `✅ | Đã chỉnh volume thành **${volume}%**!` : "❌ | Thất bại!"
        })
        setTimeout(() => { interaction.deleteReply() }, ms('5s'))
    }
} 