const { CommandInteraction, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const fs = require('node:fs')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Hiện tất cả lệnh bot có'),
    /**
    * 
    * @param {CommandInteraction} interaction 
    */
    run: async (interaction) => {
        const client = interaction.client

        let categories = []
        let option = []
        Object.keys(client.slash.categories).forEach((key) => {
            categories.push({
                name: key.toString().toLowerCase(),
                cmds: client.slash.categories[key]
            })
            option.push({
                label: (key.toLowerCase() === 'user'
                    ? '🤵'
                    : key.toLowerCase() === 'server'
                        ? '⛏'
                        : '') + ' ' +
                    key[0].toUpperCase() + key.slice(1).toLowerCase(),
                description: `Có ${client.slash.categories[key].length} lệnh` + ' | ' +
                    (key.toLowerCase() === 'user'
                        ? 'Là các lệnh cơ bản của bot'
                        : key.toLowerCase() === 'server'
                            ? `Là các lệnh liên quan đến ${process.env.MC_HOST}`
                            : ''),
                value: key.toLowerCase()
            })
        })

        const client1 = client.num == '1' ? client.user.id : client.client1.user.id
        const client2 = client.num == '1' ? client.client2.user.id : client.user.id
        const permissions = '93264'
        const scope = 'bot+applications.commands'

        const embed = new MessageEmbed()
            .setAuthor({
                name: `${client.user.tag} Help Menu`,
                iconURL: client.user.displayAvatarURL()
            })
            .setColor('RANDOM')
            .setFooter({
                text: `${interaction.user.tag} • ${interaction.guild.name}`,
                iconURL: interaction.user.displayAvatarURL()
            })
            .setTimestamp()
            .setThumbnail(client.user.displayAvatarURL())
            .setDescription(
                'Các lệnh cơ bản: \n' +
                '> `/config`: Điều chỉnh các cài đặt của bot.\n' +
                '> `/botinfo`: Toàn bộ thông tin về bot.\n' +
                '> `/help`: Hiện menu này.\n' +
                '\n' +
                'Các link liên quan của Oggy:\n' +
                `[Invite Oggy](https://discord.com/oauth2/authorize?client_id=${client1}&permissions=${permissions}&scope=${scope})` + ' | ' +
                `[Invite Oggy 2](https://discord.com/oauth2/authorize?client_id=${client2}&permissions=${permissions}&scope=${scope})\n`
            )
        interaction.editReply({
            embeds: [
                embed
            ],
            components: [
                new MessageActionRow()
                    .addComponents(
                        new MessageSelectMenu()
                            .setCustomId('category')
                            .setOptions([{
                                label: '🏠 Home',
                                description: 'Trở về trang chủ',
                                value: 'home'
                            }].concat(option))
                            .setPlaceholder('📃 Category')
                            .setDisabled(false)
                    )
            ]
        })
        interaction.channel.createMessageComponentCollector({
            componentType: 'SELECT_MENU',
            time: 5 * 60 * 1000,
        })
            .on('collect', async (inter) => {
                if (inter.customId !== 'category') return
                if (inter.values[0] === 'home') {
                    inter.update({
                        embeds: [embed]
                    })
                } else {
                    const cmds = await categories.find(f => f.name === inter.values[0])
                    if (!cmds) return
                    const embed = new MessageEmbed()
                        .setAuthor({
                            name: `${client.user.tag} Help Menu`,
                            iconURL: client.user.displayAvatarURL()
                        })
                        .setColor('RANDOM')
                        .setFooter({
                            text: `${interaction.user.tag} • ${interaction.guild.name}`,
                            iconURL: interaction.user.displayAvatarURL()
                        })
                        .setTimestamp()
                        .setThumbnail(client.user.displayAvatarURL())
                        .setTitle(`Các lệnh hiện có trong tập lệnh \`${cmds.name.toUpperCase()}\``)
                    cmds.cmds.forEach((c) => {
                        const cmd = client.slash.commands.get(c)
                        if (!cmd) return
                        embed.addFields({ name: cmd.data.name, value: cmd.data.description, inline: true })
                    })
                    inter.update({
                        embeds: [embed]
                    })
                }
            })
            .on('end', () => interaction.editReply({
                components: [],
                content: '❕ Time out!'
            }))
    }
}
