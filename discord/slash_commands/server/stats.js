const { CommandInteraction, MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const { Bot } = require('mineflayer')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Thông tin về một user')
        .addStringOption(option => option
            .setName('type')
            .setDescription('Loại thông tin cần lấy')
            .addChoices(
                { name: 'kill', value: 'kill' },
                { name: 'death', value: 'death' },
                { name: 'kda', value: 'kda' },
                { name: 'join', value: 'join' },
                { name: 'seen', value: 'seen' },
                { name: 'date', value: 'date' },
                { name: 'all', value: 'all' }
            )
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('user_name')
            .setDescription('Tên user cần thông tin')
            .setRequired(true)
        )
        .addBooleanOption(option => option
            .setName('full_message')
            .setDescription('Cho hiện toàn bộ tin nhắn kill hoặc death')
        ),
    /**
    * @param {CommandInteraction} interaction
    * @param {Bot} bot
    */
    run: async (interaction, bot) => {
        const type = interaction.options.getString('type')
        const name = interaction.options.getString('user_name')
        const full = interaction.options.getBoolean('full_message')
        //console.log({ type, name, full })
        const db = require('../../../models/players')
        const data = await db.findOne({ name: name })
        if (!data) return interaction.editReply('🔴 | Không tìm thấy data')
        const embed = new MessageEmbed()
            .setAuthor({
                name: 'Oggy Data',
                iconURL: interaction.client.user.displayAvatarURL()
            })
            .setDescription(`Thông tin về \`${name}\``)
            .setThumbnail(`https://cravatar.eu/avatar/${name}/128`)
            .setFooter({
                text: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL()
            })
            .setTimestamp()
        const embed_array = []
        switch (type) {
            case 'kill':
            case 'death':
                let kill_death = data[type].record
                embed.addFields({
                    name: type.toUpperCase(),
                    value:
                        '```' +
                        `Total: ${kill_death.length}\n` +
                        `First: ${kill_death[1] || 'Không có'}\n` +
                        `Last: ${kill_death[kill_death.length - 1] || 'Không có'}` +
                        '```\n' +
                        `${full == true ? `🔽 Toàn bộ các tin nhắn (${kill_death.length} tin nhắn)` : ''}`
                })
                let a = kill_death
                while (a.length)
                    embed_array.push(
                        new MessageEmbed()
                            .setDescription('```' + a.splice(0, 10).join('\n') + '```')
                    )
                break
            case 'kda':
                let kill = data.kill.record
                let death = data.death.record
                embed.addFields({
                    name: 'KDA',
                    value:
                        '```' +
                        `Kill: ${kill.length}\n` +
                        `Death: ${death.length}\n` +
                        `KDA: ${(kill.length / (death.length == 0 ? 1 : death.length)).toFixed(0)}` +
                        '```'
                })
                break
            case 'join':
            case 'seen':
                let join_seen = data.date[type]
                embed
                    .setDescription('')
                    .addFields({
                        name:
                            type == 'join'
                                ? 'Dữ liệu được bắt đầu ghi vào lúc'
                                : 'Thấy người chơi lần cuối lúc',
                        value: join_seen == 0 ? 'Đếch biết :))' : new Date(join_seen * 1000).toLocaleString('vi-VN')
                    })
                break;
            case 'date':
                let join = data.date.join
                let seen = data.date.seen
                /**
                 * @param {Number} time 
                 */
                let time = (time) => new Date(time * 1000).toLocaleString('vi-VN')
                embed.addFields({
                    name: 'DATE',
                    value: '```' +
                        `Join: ${join == 0 ? 'Đếch biết :)' : time(join)}\n` +
                        `Seen: ${seen == 0 ? 'Đếch biết :)' : time(seen)}` +
                        '```'
                })
                break;
            case 'all':
                let all = {
                    kill: data.kill.record.length,
                    death: data.death.record.length,
                    kda: (data.kill.record.length / (data.death.record.length == 0 ? 1 : data.death.record.length)).toFixed(0),
                    join: new Date(data.date.join).toLocaleString('vi-VN'),
                    seen: new Date(data.date.seen).toLocaleString('vi-VN')
                }
                embed.addFields(
                    {
                        name: 'KDA',
                        value:
                            '```' + 
                            `Kill: ${all.kill}\n` +
                            `Death: ${all.death}\n` +
                            `KDA: ${all.kda}\n` +
                            '```'
                    },
                    {
                        name: 'DATE',
                        value: 
                            '```' +
                            `Join: ${all.join}\n` +
                            `Seen: ${all.seen}\n` +
                            '```'
                    }
                )
        }
        interaction.editReply({ embeds: [embed] })
        if (full == true) while (embed_array.length) {
            //console.log(embed_array.length)
            await require('node:timers/promises').setTimeout(1000)
            interaction.channel.send({ embeds: embed_array.splice(0, 10) })
                .then(async msg => setTimeout(() => msg.delete(), 30 * 1000))
        }
    }
}