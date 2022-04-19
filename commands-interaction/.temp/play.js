const { CommandInteraction } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Thêm 1 bài hát hoặc phát hàng chờ')
        .addStringOption(option => option
            .setName('song')
            .setDescription('URL hoặc Tên bài hát muốn thêm/phát')
            .setRequired(true)
        ),
    /**
    * 
    * @param {CommandInteraction} interaction 
    */
    run: async (interaction) => {
        const client = interaction.client

        if (interaction.deferred === false) await interaction.deferReply()
        const ms = require('ms');
        const { QueryType } = require('discord-player')
        const queue = await client.player.createQueue(interaction.guild, {
            metadata: interaction.channel
        });

        const music = interaction.options.getString('song')
        const searchResult = await client.player.search(music, {
            requestedBy: interaction.user,
            searchEngine: QueryType.AUTO
        })
            .catch((err) => { interaction.editReply('Phát hiện lỗi khi phát nhạc! Lỗi: ```' + err + '```') });
        if (!searchResult || !searchResult.tracks.length) {
            interaction.editReply("Không tìm thấy bài hát")
            setTimeout(() => {
                interaction.deleteReply()
            }, ms('5s'))
        }
        try {
            if (!queue.connection) await queue.connect(interaction.member.voice.channel);
        } catch {
            void client.player.deleteQueue(interaction.guild.id);
            return void interaction.editReply({ content: "Không thể tham gia vào voice channel của bạn" })
        }

        await interaction.editReply({ content: `⏱ | Đang tải ${searchResult.playlist ? "playlist" : "bài hát"}...` })
        setTimeout(() => {
            interaction.deleteReply()
        }, 10 * 1000);
        searchResult.playlist ? queue.addTracks(searchResult.tracks) : queue.addTrack(searchResult.tracks[0])
        await queue.play()
    }
} 