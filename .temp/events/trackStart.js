const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js')
const { Queue } = require('discord-player')
const temp = require('../models/tempmusic')
const ms = require('ms')

module.exports = {
    name: 'trackStart',
    player: true,
    /**
     * 
     * @param {Queue} queue 
     */
    async run(queue) {
        const client = queue.metadata.client
        const row1 = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('previousong')
                    .setStyle('PRIMARY')
                    .setLabel('⏮')
            )
            .addComponents(
                new MessageButton()
                    .setCustomId('minimizevolume')
                    .setStyle('PRIMARY')
                    .setLabel('🔉')
            )
            .addComponents(
                new MessageButton()
                    .setCustomId('pausesong')
                    .setStyle('PRIMARY')
                    .setLabel('⏸')
            )
            .addComponents(
                new MessageButton()
                    .setCustomId('maximizevolume')
                    .setStyle('PRIMARY')
                    .setLabel('🔊')
            )
            .addComponents(
                new MessageButton()
                    .setCustomId('nextsong')
                    .setStyle('PRIMARY')
                    .setLabel('⏭')
            )
        const row2 = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('queue')
                    .setStyle('PRIMARY')
                    .setLabel('📃 Queue')
            )
            .addComponents(
                new MessageButton()
                    .setCustomId('loop')
                    .setStyle('PRIMARY')
                    .setLabel('🔃 Loop')
            )
            .addComponents(
                new MessageButton()
                    .setCustomId('shuffle')
                    .setStyle('PRIMARY')
                    .setLabel('🔀 Shuffle')
            )
            .addComponents(
                new MessageButton()
                    .setCustomId('stop')
                    .setStyle('PRIMARY')
                    .setLabel('🛑 Stop')
            )
        const progressBar = queue.createProgressBar();
        const channel = client.channels.cache.get(queue.metadata.id)
        const guild = client.guilds.cache.get(channel.guild.id)
        const request = client.users.cache.get(`${queue.current.requestedBy.id}`)
        const embed = new MessageEmbed()
            .setAuthor({ name: `${client.user.tag}`, iconURL: client.user.avatarURL() })
            .setTitle(`Thông tin về bài hát đang phát tại ${guild.name}`)
            .setThumbnail(queue.current.thumbnail)
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
        channel.send({
            embeds: [
                embed
            ],
            components: [
                row1,
                row2
            ]
        }).then(async (m) => {
            await temp.findOneAndDelete({ guildid: guild.id })
            const data = new temp({
                guildid: guild.id,
                msgid: m.id
            })
            await data.save()
        })
    }
}