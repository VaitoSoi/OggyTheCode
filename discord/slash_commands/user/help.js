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

        let dirs = fs.readdirSync('./discord/slash_commands/')
        let categories = []
        let option = []
        dirs.forEach((dir) => {
            let files = fs.readdirSync(`./discord/slash_commands/${dir}/`).filter(file => file.endsWith('.js'))
            categories.push({
                name: dir.toString().toLowerCase(),
                cmds: files
            })
            option.push({
                label: (dir.toLowerCase() === 'user' ?
                    '🤵'
                    : dir.toLowerCase() === 'server' ?
                        '⛏'
                        : '') + ' ' +
                    dir[0].toUpperCase() + dir.slice(1).toLowerCase(),
                description: `Có ${files.length} lệnh` + ' | ' +
                    (dir.toLowerCase() === 'user' ?
                        'Là các lệnh cơ bản của bot'
                        : dir.toLowerCase() === 'server' ?
                            `Là các lệnh liên quan đến ${process.env.MC_HOST}`
                            : ''),
                value: dir.toLowerCase()
            })
        })

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
                '[Invite Oggy](https://discord.com/oauth2/authorize?client_id=898782551110471701&permissions=93264&scope=bot+applications.commands) | ' +
                '[Invite Oggy 2](https://discord.com/oauth2/authorize?client_id=974862207106027540&permissions=93264&scope=bot+applications.commands)\n'
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
                        const cmd = require(`../${cmds.name}/${c}`)
                        if (!cmd) return
                        embed.addField(cmd.data.name, cmd.data.description, true)
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
