const { Interaction, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js')
const { QueueRepeatMode } = require('discord-player')
const ms = require('ms')

module.exports = {
    name: 'interactionCreate',
    /**
     * 
     * @param {Interaction} interaction 
     * @returns 
     */
    async run(interaction) {
        const { player } = require('../index')
        const client = interaction.client
        if (!interaction.guildId) return
        const queue = player.getQueue(interaction.guildId)

        // Nếu interaction là nút

        if (interaction.isButton()) {

            /**
             * 
             * v Hàng chờ nhạc
             * 
             */

            if (interaction.customId === 'queuenextpage') {
                const last = interaction.message.embeds[0].fields[Number(interaction.message.embeds[0].fields.length) - 1].name.split(' ')[0]
                if (!last) return
                const i0 = Number(last)
                const i = i0 + 1
                const i2 = i + 10
                if (!queue) return
                var row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('queuepreviouspage')
                            .setLabel('<<<')
                            .setStyle('SUCCESS')
                    )
                    .addComponents(
                        new MessageButton()
                            .setCustomId('queuedeletemessage')
                            .setLabel('🗑️')
                            .setStyle('DANGER')
                    )
                    .addComponents(
                        new MessageButton()
                            .setCustomId('queuenextpage')
                            .setLabel('>>>')
                            .setStyle('SUCCESS')
                    )
                if (Number(i2) >= queue.tracks.length) {
                    row = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setCustomId('queuepreviouspage')
                                .setLabel('<<<')
                                .setStyle('SUCCESS')
                        )
                        .addComponents(
                            new MessageButton()
                                .setCustomId('queuedeletemessage')
                                .setLabel('🗑️')
                                .setStyle('DANGER')
                        )
                        .addComponents(
                            new MessageButton()
                                .setCustomId('queuenextpage')
                                .setLabel('>>>')
                                .setStyle('SUCCESS')
                                .setDisabled()
                        )
                }
                const embed = new MessageEmbed()
                    .setTitle(`Các bài hát trong queue tại server **${interaction.message.guild.name}**`)
                    .setFooter({
                        text: `Tất cả bài hát: ${queue.tracks.length} | Tổng cộng thời gian: ${ms(queue.totalTime)}`
                    })
                    .setAuthor({
                        name: `${interaction.user.tag}`,
                        iconURL: interaction.user.displayAvatarURL()
                    })
                    .addFields({
                        name: 'Bài hát đang phát',
                        value: `${queue.current.title}\nLink: ${queue.current.url}\nBởi: ${queue.current.author} | Thời gian: ${ms(queue.current.durationMS)}\nNgười yêu cầu: ${queue.current.requestedBy}`
                    })
                    .setColor('RANDOM')
                var n = i
                const queue1 = queue.tracks.slice(i, i2)
                queue1.forEach(track => {
                    embed.addFields({
                        name: `${n} ${track.title}`,
                        value: `Link: ${track.url}\nBởi: ${track.author} | Thời gian: ${ms(track.durationMS)}\nNgười yêu cầu: ${track.requestedBy}`
                    })
                    n++
                })
                interaction.update({ embeds: [embed], components: [row] })

            } else if (interaction.customId === 'queuepreviouspage') {
                const first = interaction.message.embeds[0].fields[2].name.split(' ')[0]
                if (!first) return
                const i0 = Number(first)
                var i = i0 - 11
                if (i < 0) i = 0
                const i2 = Number(i) + 10
                if (!queue) return
                var row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('queuepreviouspage')
                            .setLabel('<<<')
                            .setStyle('SUCCESS')
                            .setDisabled()
                    )
                    .addComponents(
                        new MessageButton()
                            .setCustomId('queuedeletemessage')
                            .setLabel('🗑️')
                            .setStyle('DANGER')
                    )
                    .addComponents(
                        new MessageButton()
                            .setCustomId('queuenextpage')
                            .setLabel('>>>')
                            .setStyle('SUCCESS')
                    )
                if (Number(i0) <= 0 || Number(i0) == 1) {
                    row = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setCustomId('queuepreviouspage')
                                .setLabel('<<<')
                                .setStyle('SUCCESS')
                        ).addComponents(
                            new MessageButton()
                                .setCustomId('queuedeletemessage')
                                .setLabel('🗑️')
                                .setStyle('DANGER')
                        )
                        .addComponents(
                            new MessageButton()
                                .setCustomId('queuenextpage')
                                .setLabel('>>>')
                                .setStyle('SUCCESS')
                        )
                }
                const embed = new MessageEmbed()
                    .setTitle(`Các bài hát trong queue tại server **${interaction.message.guild.name}**`)
                    .setFooter({ text: `Tất cả bài hát: ${queue.tracks.length} | Tổng cộng thời gian: ${ms(queue.totalTime)}` })
                    .setAuthor({ name: `${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
                    .addFields({
                        name: 'Bài hát đang phát',
                        value: `\`\`\` ${queue.current.title} \`\`\`\nLink: ${queue.current.url}\nBởi: ${queue.current.author} | Thời gian: ${ms(queue.current.durationMS)}\nNgười yêu cầu: ${queue.current.requestedBy}`
                    })
                    .setColor('RANDOM')
                var n = i
                const queue1 = queue.tracks.slice(i, i2)
                queue1.forEach(track => {
                    embed.addFields({
                        name: `${n} ${track.title}`,
                        value: `Link: ${track.url}\nBởi: ${track.author} | Thời gian: ${ms(track.durationMS)}\nNgười yêu cầu: ${track.requestedBy}`
                    })
                    n++
                })
                interaction.update({ embeds: [embed], components: [row] })
            } else if (interaction.customId === 'queuedeletemessage') {
                interaction.reply({ content: '🗑 | Đã xóa tin nhắn.', ephemeral: true })
                return interaction.message.delete()
            }
            /** 
             * ^ Hàng chờ nhạc
             * 
             * v Tin nhắn từ máy phát nhạc
             */

            // Bài hát trước

            else if (interaction.customId === 'previousong') {
                if (!queue || !queue.nowPlaying) {
                    interaction.reply({ content: '❌ | Không phát hiện hàng chờ !', ephemeral: true })
                    return interaction.message.delete()
                }
                if (!interaction.member.voice.channel) return interaction.reply({
                    content: '🛑 | Vui lòng kết nối đến Voice Channel để dùng lệnh.',
                    ephemeral: true
                })
                if (!interaction.guild.me.voice.channelId || interaction.guild.me.voice.channelId !== interaction.member.voice.channel.id) return interaction.reply({
                    content: '🛑 | Vui lòng vô chung Voice Channel với bot để dùng lệnh.',
                    ephemeral: true
                })
                if (queue.previousTracks.length == 1) return interaction.reply({
                    content: '🛑 | Không phát hiện bài hát trước !',
                    ephemeral: true
                })
                queue.back()
                interaction.reply({ content: '⏮ | Đã chuyển về bài trước.', ephemeral: true })
            }

            // Giảm âm lượng

            else if (interaction.customId === 'minimizevolume') {
                if (!queue || !queue.nowPlaying) {
                    interaction.reply({ content: '❌ | Không phát hiện hàng chờ !', ephemeral: true })
                    return interaction.message.delete()
                }
                if (!interaction.member.voice.channel) return interaction.reply({
                    content: '🛑 | Vui lòng kết nối đến Voice Channel để dùng lệnh.',
                    ephemeral: true
                })
                if (!interaction.guild.me.voice.channelId || interaction.guild.me.voice.channelId !== interaction.member.voice.channel.id) return interaction.reply({
                    content: '🛑 | Vui lòng vô chung Voice Channel với bot để dùng lệnh.',
                    ephemeral: true
                })
                const volume = Number(queue.volume) - 10
                if (volume < 0) return interaction.reply({ content: 'Không thể chỉnh volume xuống thấp hơn 0', ephemeral: true })
                queue.setVolume(Number(volume))
                interaction.reply({ content: `🔉 | Đã chỉnh volume thành ${volume}%`, ephemeral: true })
            }

            // Tiếp tục bài hát

            else if (interaction.customId === 'playsong') {
                if (!queue || !queue.nowPlaying) {
                    interaction.reply({ content: '❌ | Không phát hiện hàng chờ !', ephemeral: true })
                    return interaction.message.delete()
                }
                if (!interaction.member.voice.channel) return interaction.reply({
                    content: '🛑 | Vui lòng kết nối đến Voice Channel để dùng lệnh.',
                    ephemeral: true
                })
                if (!interaction.guild.me.voice.channelId || interaction.guild.me.voice.channelId !== interaction.member.voice.channel.id) return interaction.reply({
                    content: '🛑 | Vui lòng vô chung Voice Channel với bot để dùng lệnh.',
                    ephemeral: true
                })
                queue.setPaused(false)
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
                interaction.message.edit({ embeds: [interaction.message.embeds[0]], components: [row1, row2] })
                interaction.reply({ content: '▶ | Đã tiếp tục bài hát', ephemeral: true })
            }

            // Tạm dừng bài hát

            else if (interaction.customId === 'pausesong') {
                if (!queue || !queue.nowPlaying) {
                    interaction.reply({ content: '❌ | Không phát hiện hàng chờ !', ephemeral: true })
                    return interaction.message.delete()
                }
                if (!interaction.member.voice.channel) return interaction.reply({
                    content: '🛑 | Vui lòng kết nối đến Voice Channel để dùng lệnh.',
                    ephemeral: true
                })
                if (!interaction.guild.me.voice.channelId || interaction.guild.me.voice.channelId !== interaction.member.voice.channel.id) return interaction.reply({
                    content: '🛑 | Vui lòng vô chung Voice Channel với bot để dùng lệnh.',
                    ephemeral: true
                })
                queue.setPaused(true)
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
                            .setCustomId('playsong')
                            .setStyle('PRIMARY')
                            .setLabel('▶')
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
                interaction.message.edit({ embeds: [interaction.message.embeds[0]], components: [row1, row2] })
                interaction.reply({ content: '⏸ | Đã dừng bài hát.', ephemeral: true })
            }

            // Tăng âm lượng

            else if (interaction.customId === 'maximizevolume') {
                if (!queue || !queue.nowPlaying) {
                    interaction.reply({ content: '❌ | Không phát hiện hàng chờ !', ephemeral: true })
                    return interaction.message.delete()
                }
                if (!interaction.member.voice.channel) return interaction.reply({
                    content: '🛑 | Vui lòng kết nối đến Voice Channel để dùng lệnh.',
                    ephemeral: true
                })
                if (!interaction.guild.me.voice.channelId || interaction.guild.me.voice.channelId !== interaction.member.voice.channel.id) return interaction.reply({
                    content: '🛑 | Vui lòng vô chung Voice Channel với bot để dùng lệnh.',
                    ephemeral: true
                })
                const volume = Number(queue.volume) + 10
                if (volume > 100) return interaction.reply({ content: 'Không thể chỉnh volume lớn hơn 100', ephemeral: true })
                queue.setVolume(Number(volume))
                interaction.reply({ content: `🔊 | Đã chỉnh volume thành ${volume}%`, ephemeral: true })
            }

            // Bỏ qua bài hát

            else if (interaction.customId === 'nextsong') {
                if (!queue || !queue.nowPlaying) {
                    interaction.message.delete()
                    return interaction.reply({ content: '❌ | Không phát hiện hàng chờ !', ephemeral: true })
                }
                if (!interaction.member.voice.channel) return interaction.reply({
                    content: '🛑 | Vui lòng kết nối đến Voice Channel để dùng lệnh.',
                    ephemeral: true
                })
                if (!interaction.guild.me.voice.channelId || interaction.guild.me.voice.channelId !== interaction.member.voice.channel.id) return interaction.reply({
                    content: '🛑 | Vui lòng vô chung Voice Channel với bot để dùng lệnh.',
                    ephemeral: true
                })
                queue.skip()
                interaction.reply({ content: '⏭ | Đã bỏ qua bài hát', ephemeral: true })
            }

            // Nhắn hàng chờ

            else if (interaction.customId === 'queue') {
                if (!queue || !queue.nowPlaying) {
                    interaction.message.delete()
                    return interaction.reply({ content: '❌ | Không phát hiện hàng chờ !', ephemeral: true })
                }
                if (!interaction.member.voice.channel) return interaction.reply({
                    content: '🛑 | Vui lòng kết nối đến Voice Channel để dùng lệnh.',
                    ephemeral: true
                })
                if (!interaction.guild.me.voice.channelId || interaction.guild.me.voice.channelId !== interaction.member.voice.channel.id) return interaction.reply({
                    content: '🛑 | Vui lòng vô chung Voice Channel với bot để dùng lệnh.',
                    ephemeral: true
                })
                const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('queuepreviouspage')
                            .setLabel('<<<')
                            .setStyle('SUCCESS')
                            .setDisabled()
                    )
                    .addComponents(
                        new MessageButton()
                            .setCustomId('queuedeletemessage')
                            .setLabel('🗑️')
                            .setStyle('DANGER')
                    )
                    .addComponents(
                        new MessageButton()
                            .setCustomId('queuenextpage')
                            .setLabel('>>>')
                            .setStyle('SUCCESS')
                    )
                if (!queue.tracks.length) {
                    const embed = new MessageEmbed()
                        .setColor('GREEN')
                        .setAuthor({ name: `Danh sách bài hát đang chờ phát tại ${interaction.message.guild.name}`, iconURL: interaction.message.guild.iconURL({ dynamic: true }) })
                        .addFields({
                            name: `${n} ${queue.current.title}`,
                            value: `Link: ${queue.current.url}\nBởi: ${queue.current.author} | Thời gian: ${ms(queue.current.durationMS)}\nNgười yêu cầu: ${queue.current.requestedBy}`
                        });
                    return interaction.reply({ embeds: [embed] })
                }

                const embed = new MessageEmbed()
                    .setTitle(`Các bài hát trong queue tại server **${interaction.message.guild.name}**`)
                    .setFooter({ text: `Tất cả bài hát: ${queue.tracks.length} | Tổng cộng thời gian: ${ms(queue.totalTime)}` })
                    .setAuthor({ name: `${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
                    .addFields({
                        name: 'Bài hát đang phát',
                        value: `${queue.current.title}\nLink: ${queue.current.url}\nBởi: ${queue.current.author} | Thời gian: ${ms(queue.current.durationMS)}\nNgười yêu cầu: ${queue.current.requestedBy}`
                    })
                    .setColor('RANDOM')
                var n = 0
                const queue1 = queue.tracks.slice(0, 10)
                queue1.forEach(track => {
                    n++
                    embed.addFields({
                        name: `${n} ${track.title}`,
                        value: `Link: ${track.url}\nBởi: ${track.author} | Thời gian: ${ms(track.durationMS)}\nNgười yêu cầu: ${track.requestedBy}`
                    })
                })
                interaction.reply({ embeds: [embed], components: [row] })
            }

            // Lặp lại bài hát, hàng chờ,v.v..

            else if (interaction.customId === 'loop') {
                if (!queue || !queue.nowPlaying) {
                    interaction.reply({ content: '❌ | Không phát hiện hàng chờ !', ephemeral: true })
                    return interaction.message.delete()
                }
                if (!interaction.member.voice.channel) return interaction.reply({
                    content: '🛑 | Vui lòng kết nối đến Voice Channel để dùng lệnh.',
                    ephemeral: true
                })
                if (!interaction.guild.me.voice.channelId || interaction.guild.me.voice.channelId !== interaction.member.voice.channel.id) return interaction.reply({
                    content: '🛑 | Vui lòng vô chung Voice Channel với bot để dùng lệnh.',
                    ephemeral: true
                })
                const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('loopoff')
                            .setStyle('PRIMARY')
                            .setLabel('OFF')
                    )
                    .addComponents(
                        new MessageButton()
                            .setCustomId('looptrack')
                            .setStyle('PRIMARY')
                            .setLabel('TRACK')
                    )
                    .addComponents(
                        new MessageButton()
                            .setCustomId('loopqueue')
                            .setStyle('PRIMARY')
                            .setLabel('QUEUE')
                    )
                    .addComponents(
                        new MessageButton()
                            .setCustomId('loopautoplay')
                            .setStyle('PRIMARY')
                            .setLabel('AUTOPLAY')
                    )
                interaction.reply({ embeds: [new MessageEmbed().setTitle('Vui lòng chọn 1 tùy chọn phía dưới !')], components: [row], ephemeral: true })
            }

            // Xáo trộn hàng chờ

            else if (interaction.customId === 'shuffle') {
                if (!queue || !queue.nowPlaying) {
                    interaction.reply({ content: '❌ | Không phát hiện hàng chờ !', ephemeral: true })
                    return interaction.message.delete()
                }
                if (!interaction.member.voice.channel) return interaction.reply({
                    content: '🛑 | Vui lòng kết nối đến Voice Channel để dùng lệnh.',
                    ephemeral: true
                })
                if (!interaction.guild.me.voice.channelId || interaction.guild.me.voice.channelId !== interaction.member.voice.channel.id) return interaction.reply({
                    content: '🛑 | Vui lòng vô chung Voice Channel với bot để dùng lệnh.',
                    ephemeral: true
                })
                queue.shuffle()
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
                let arrayOfOption = []
                let num = 0
                queue.tracks.forEach((t) => {
                    num++
                    if (num >= 26) return;
                    let name = ''
                    if (t.title.split(' ').length > 15) {
                        let num2 = 0
                        t.title.split(' ').forEach((n) => {
                            if (num2 > 15 || name.split('') > 90) {
                                return
                            } else {
                                name = name + ' ' + t.title.split(' ')[num2]
                                num2++
                            }
                        })
                    } else name = t.title
                    arrayOfOption.push({
                        label: `${num}. ${name}...`,
                        value: `${num}`
                    })
                })
                const row3 = new MessageActionRow()
                    .addComponents(
                        new MessageSelectMenu()
                            .setCustomId('skiptomenu')
                            .setPlaceholder('Các bài hát trong hàng chờ')
                            .setDisabled(false)
                            .addOptions(arrayOfOption)
                    )
                interaction.message.edit({
                    embeds: interaction.message.embeds,
                    components: [
                        row1,
                        row2,
                        row3
                    ]
                })
                interaction.reply({ content: '🔀 | Đã xáo trộn hàng chờ.', ephemeral: true })
            }

            // Dừng phát nhạc

            else if (interaction.customId === 'stop') {
                if (!queue || !queue.nowPlaying) {
                    interaction.reply({ content: '❌ | Không phát hiện hàng chờ !', ephemeral: true })
                    return interaction.message.delete()
                }
                if (!interaction.member.voice.channel) return interaction.reply({
                    content: '🛑 | Vui lòng kết nối đến Voice Channel để dùng lệnh.',
                    ephemeral: true
                })
                if (!interaction.guild.me.voice.channelId || interaction.guild.me.voice.channelId !== interaction.member.voice.channel.id) return interaction.reply({
                    content: '🛑 | Vui lòng vô chung Voice Channel với bot để dùng lệnh.',
                    ephemeral: true
                })
                queue.destroy()
                interaction.reply({ content: '⏹ | Đã dừng phát nhạc', ephemeral: true })
            }

            /**
             * ^ Tin nhắn từ máy phát nhạc
             * 
             * v Loại lặp hàng chờ
             */

            // Tắt

            else if (interaction.customId === 'loopoff') {
                if (!queue || !queue.nowPlaying) {
                    interaction.reply({ content: '❌ | Không phát hiện hàng chờ !', ephemeral: true })
                    return interaction.message.delete()
                }
                if (!interaction.member.voice.channel) return interaction.reply({
                    content: '🛑 | Vui lòng kết nối đến Voice Channel để dùng lệnh.',
                    ephemeral: true
                })
                if (!interaction.guild.me.voice.channelId || interaction.guild.me.voice.channelId !== interaction.member.voice.channel.id) return interaction.reply({
                    content: '🛑 | Vui lòng vô chung Voice Channel với bot để dùng lệnh.',
                    ephemeral: true
                })
                const loopmode = 0
                const success = queue.setRepeatMode(loopmode);
                const mode = loopmode === QueueRepeatMode.TRACK ? "🔂" : loopmode === QueueRepeatMode.QUEUE ? "🔁" : "▶";
                interaction.reply({ content: success ? `${mode} | Cập nhật chế độ lặp lại!` : "❌ | Xảy ra lỗi!", ephemeral: true })
            }

            // Bài hát

            else if (interaction.customId === 'looptrack') {
                if (!queue || !queue.nowPlaying) {
                    interaction.reply({ content: '❌ | Không phát hiện hàng chờ !', ephemeral: true })
                    return interaction.message.delete()
                }
                if (!interaction.member.voice.channel) return interaction.reply({
                    content: '🛑 | Vui lòng kết nối đến Voice Channel để dùng lệnh.',
                    ephemeral: true
                })
                if (!interaction.guild.me.voice.channelId || interaction.guild.me.voice.channelId !== interaction.member.voice.channel.id) return interaction.reply({
                    content: '🛑 | Vui lòng vô chung Voice Channel với bot để dùng lệnh.',
                    ephemeral: true
                })
                const loopmode = 1
                const success = queue.setRepeatMode(loopmode);
                const mode = loopmode === QueueRepeatMode.TRACK ? "🔂" : loopmode === QueueRepeatMode.QUEUE ? "🔁" : "▶";
                interaction.reply({ content: success ? `${mode} | Cập nhật chế độ lặp lại!` : "❌ | Xảy ra lỗi!", ephemeral: true })
            }

            // Hàng chờ

            else if (interaction.customId === 'loopqueue') {
                if (!queue || !queue.nowPlaying) {
                    interaction.reply({ content: '❌ | Không phát hiện hàng chờ !', ephemeral: true })
                    return interaction.message.delete()
                }
                if (!interaction.member.voice.channel) return interaction.reply({
                    content: '🛑 | Vui lòng kết nối đến Voice Channel để dùng lệnh.',
                    ephemeral: true
                })
                if (!interaction.guild.me.voice.channelId || interaction.guild.me.voice.channelId !== interaction.member.voice.channel.id) return interaction.reply({
                    content: '🛑 | Vui lòng vô chung Voice Channel với bot để dùng lệnh.',
                    ephemeral: true
                })
                const loopmode = 2
                const success = queue.setRepeatMode(loopmode);
                const mode = loopmode === QueueRepeatMode.TRACK ? "🔂" : loopmode === QueueRepeatMode.QUEUE ? "🔁" : "▶";
                interaction.reply({ content: success ? `${mode} | Cập nhật chế độ lặp lại!` : "❌ | Xảy ra lỗi!", ephemeral: true })
            }

            // Tự phát nhạc

            else if (interaction.customId === 'loopautoplay') {
                if (!queue || !queue.nowPlaying) {
                    interaction.reply({ content: '❌ | Không phát hiện hàng chờ !', ephemeral: true })
                    return interaction.message.delete()
                }
                if (!interaction.member.voice.channel) return interaction.reply({
                    content: '🛑 | Vui lòng kết nối đến Voice Channel để dùng lệnh.',
                    ephemeral: true
                })
                if (!interaction.guild.me.voice.channelId || interaction.guild.me.voice.channelId !== interaction.member.voice.channel.id) return interaction.reply({
                    content: '🛑 | Vui lòng vô chung Voice Channel với bot để dùng lệnh.',
                    ephemeral: true
                })
                const loopmode = 3
                const success = queue.setRepeatMode(loopmode);
                const mode = loopmode === QueueRepeatMode.TRACK ? "🔂" : loopmode === QueueRepeatMode.QUEUE ? "🔁" : "▶";
                interaction.reply({ content: success ? `${mode} | Cập nhật chế độ lặp lại!` : "❌ | Xảy ra lỗi!", ephemeral: true })
            }
        }

        // Nếu interaction là Slash command
        else if (interaction.isCommand()) {
            const data = await require('../models/blacklist').findOne({ id: interaction.user.id })
            let ava = Boolean;
            // if (!interaction.command) return interaction.reply('[🛑] | ERROR: `INTERACTION.COMMAND is underfined`')
            const command = client.interactions.get(interaction.commandName)
            if (!command) return interaction.reply('[🛑] | ERROR: `COMMAND is underfined`')
            if (!data) {
                client.channels.cache.get(process.env.LOG_CHANNEL).send({
                    embeds: [
                        new MessageEmbed()
                            .setTitle('Đã có 1 lệnh được thực thi')
                            .addFields({
                                name: 'Lệnh:',
                                value: `Tên: ${command.data.name}\n`
                            },
                                {
                                    name: 'Người ra lệnh:',
                                    value: `Tên: ${interaction.user.tag}\nID: ${interaction.user.id}`
                                },
                                {
                                    name: 'Tại:',
                                    value: `Tên: ${interaction.guild.name}\nID: ${interaction.guildId}`
                                })
                            .setColor('RANDOM')
                            .setAuthor({
                                name: `${client.user.tag}`,
                                iconURL: client.user.avatarURL()
                            })
                            .setFooter({
                                text: `${interaction.guild.name}`,
                                iconURL: interaction.guild.iconURL()
                            })
                            .setTimestamp()
                    ]
                })

                const data2 = await require('../models/commands').findOne({ guildid: interaction.guildId })
                if (data2) {
                    const ar = data2.commands
                    if (ar.includes(command.name)) { ava = false } else { ava = true }
                } else {
                    ava = true
                }


                if (ava === false) {
                    interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setTitle(`❌ | Lệnh \`${cmd}\` đã bị tắt bởi Admin`)
                                .setColor('#f00c0c')
                        ]
                    })

                } else if (ava === true || !ava) {
                    if (command) {
                        if (command.category === 'music' && !interaction.member.voice.channel) return interaction.channel.send('Vô voice channel đi t mới mở cho mi nghe đc chứ')
                        try {
                            command.run(interaction);
                        } catch (err) {
                            interaction.reply('Đã xảy ra lỗi khi thực thi lệnh!\nLỗi:```' + err + '```')
                            /*
                            client.channels.cache.get('930786044692008960').send({
                                embeds: [
                                    new MessageEmbed()
                                        .setTitle(`Phát hiện lỗi khi thực thi lệnh!`)
                                        .addFields({
                                            name: 'Lệnh:',
                                            value: `${command.name}`
                                        },
                                            {
                                                name: 'Người ra lệnh:',
                                                value: `${interaction.author}`
                                            },
                                            {
                                                name: 'Lỗi:',
                                                value: '```' + `${err}` + '```' + '\nLỗi đã được thông báo tới console!'
                                            })
                                ]
                            })
                            console.log(err) */
                        }
                    }
                }
            } else {
                var by = data.by
                if (!by || !data.by) by = 'VaitoSoi#2220'
                interaction.reply({
                    embeds: [new MessageEmbed()
                        .setTitle('Bạn đã bị blacklist từ trước.')
                        .addFields({
                            name: 'UserID:',
                            value: `${data.id}`,
                            inline: true
                        },
                            {
                                name: 'Bởi:',
                                value: `${by}`,
                                inline: true
                            },
                            {
                                name: 'Lý do',
                                value: `${data.reason}`,
                                inline: false
                            })
                        .setAuthor({ name: `${client.user.tag} blacklist`, iconURL: client.user.avatarURL() })
                        .setFooter({ text: `${interaction.user.tag} • Lệnh: ${interaction.command.name ? interaction.command.name : 'underfined'}` })
                        .setColor('RANDOM')
                        .setThumbnail(interaction.user.displayAvatarURL())
                        .setTimestamp()
                    ]
                })
            }
        }
    }
}