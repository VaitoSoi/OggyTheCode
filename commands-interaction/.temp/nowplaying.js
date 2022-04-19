const { CommandInteraction } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nowplaying')
        .setDescription('Bài hát đang phát'),
    /**
    * 
    * @param {CommandInteraction} interaction 
    */ 
    run: async(interaction) => {
        if (interaction.deferred === false) await interaction.deferReply()
        const client = interaction.client

        const { MessageEmbed } = require('discord.js');
        const ms = require('ms')

        const queue = client.player.getQueue(interaction.guild.id)
        if (!queue || !queue.nowPlaying()) return interaction.editReply('🛑 | Hàng chờ đang trống')
        const progressBar = queue.createProgressBar();
        const request = client.users.cache.get(`${queue.current.requestedBy.id}`)
        const embed = new MessageEmbed()
            .setAuthor({ name: `${client.user.tag}`, iconURL: client.user.avatarURL() })
            .setTitle(`Thông tin về bài hát đang phát tại ${interaction.guild.name}`)
            .setImage(queue.current.thumbnail)
            .setDescription("```" + `> ${queue.current.title}\n${progressBar}` + "```")
            .addFields({
                name: '⏱ Thời gian: ',
                value: `\`> ${queue.current.duration}\``,
                inline: true,
            },
                {
                    name: '🤵 Bởi:',
                    value: `\`> ${queue.current.author}\``,
                    inline: true,
                },
                {
                    name: '🎧 Yêu cầu bởi:',
                    value: `\`> ${request.tag}\``,
                    inline: true,
                })
            .setColor('RANDOM')
        if (queue.current.playlist) {
            embed.addFields({
                name: '📃 Tên của playlist:',
                value: `\`> ${queue.current.playlist.title}\``,
                inline: true,
            },
                {
                    name: '🤵 Chủ của playlist:',
                    value: `\`> ${queue.current.playlist.author.name}\``,
                    inline: true,
                },
                {
                    name: '🎶 Số bài hát có trong playlist:',
                    value: `\`> ${queue.current.playlist.tracks.length} bài hát\``,
                    inline: true,
                })
        }
        return interaction.editReply({ embeds: [embed] })
    }
} 