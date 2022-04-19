const { CommandInteraction, MessageSelectMenu, MessageActionRow, MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Xem tất cả / một lệnh')
        .addStringOption(option => option
            .setName('command')
            .setDescription('Tên lệnh')
            .setRequired(false)
        ),
    /**
    * 
    * @param {CommandInteraction} interaction 
    */
    run: async (interaction) => {
        const client = interaction.client
        const { readdirSync } = require('fs')
        const prefixSchema = require('../models/prefix')
        const p = process.env.PREFIX
        const ms = require('ms')
        const dcommand = require('../models/commands')
        var prefix = ''

        const data = await prefixSchema.findOne({ GuildId: interaction.guild.id });

        if (data) {
            prefix = data.Prefix
        } else {
            prefix = p
        }

        if (!interaction.options.getString('command')) {

            let categories = [];
            readdirSync("./commands/").forEach((dir) => {
                const commands = readdirSync(`./commands/${dir}/`).filter((file) =>
                    file.endsWith(".js")
                );

                const cmds = commands.map((command) => {
                    let file = require(`../commands/${dir}/${command}`);
                    if (!file) return console.log('Error')

                    if (!file.name) return "Không tìm thấy lệnh.";

                    let name = file.name.replace(".js", "");

                    return `${name}`;
                });

                let data = new Object();

                data = {
                    name: dir.toUpperCase(),
                    value: cmds.length === 0 ? "Đang tải." : cmds.join(" "),
                };

                categories.push(data);
            });
            const embed = new MessageEmbed()
                .setThumbnail(client.user.avatarURL())
                .setFooter({
                    text: `Yêu cầu bởi: ${interaction.user.tag} • ${interaction.guild.name}`,
                    iconURL: interaction.user.avatarURL()
                })
                .setTimestamp()
                .setColor('RANDOM')
                .setTitle(`${client.user.username} Helps`)
                .setDescription(`Prefix hiện tại của bot là: \`${prefix}\`\n\n**Các lệnh cơ bản hữu ích:**\n> \`${prefix}set\` để có thể chỉnh cchannel, role,...\n> \`${prefix}help\` để xem menu này.\n> \`${prefix}botinfo\` để xem toàn bộ thông tin về bot.\n\n **Các link hữu ích:**\n[Invite](https://discord.com/api/oauth2/authorize?client_id=898782551110471701&permissions=351497286&scope=bot%20applications.commands) | [Support server](https://discord.gg/NBsnNGDeQd)`)
            const row = (state) => [
                new MessageActionRow().addComponents(
                    new MessageSelectMenu()
                        .setCustomId('helpmenu')
                        .setPlaceholder('Danh mục lệnh.')
                        .setDisabled(state)
                        .addOptions([
                            {
                                label: '🤵 User',
                                description: 'Là các lệnh mà User có thể dùng.',
                                value: 'user'
                            },
                            {
                                label: '⛏ Ingame',
                                description: 'Là các lệnh liên quan đến server 2y2c.org',
                                value: 'server'
                            },
                        ])
                )
            ]

            await interaction.editReply({
                embeds: [embed],
                components: row(false)
            })

            const collector = interaction.channel.createMessageComponentCollector({
                componentType: 'SELECT_MENU',
                time: ms('5m'),
            })

            collector.on('collect', async (interaction) => {
                const idirectory = interaction.values.toString();
                const category = categories.find(
                    (x) => x.name.toUpperCase() === idirectory.toUpperCase()
                )
                const command = category.value.split(' ')
                const embed = new MessageEmbed()
                    .setColor('RANDOM')
                    .setAuthor({
                        name: `${client.user.tag} Help`,
                        iconURL: client.user.avatarURL()
                    })
                    .setTitle(`**Tất cả lệnh của ${category.name.toUpperCase()}**`)
                    .setDescription(`Prefix của bot là: \`${prefix}\` \n Vd: \`${prefix}help\``)
                    .setFooter({
                        text: `${interaction.user.tag} • ${interaction.guild.name}`,
                        iconURL: interaction.user.avatarURL()
                    })

                const data1 = await dcommand.findOne({ guildid: interaction.guild.id })
                command.forEach(async (name) => {
                    const c = client.commands.get(name.toLowerCase())
                    if (data1) {
                        const n = c.name
                        const comm = data1.commands
                        if (!comm || Number(comm.length) == 0 || !comm.includes(n)) {
                            embed.addFields({
                                name: `✅ | \`${c.name}\``,
                                value: `${c.description ? c.description : 'Lệnh không có mô tả.'}`,
                                inline: true
                            })
                        } else if (comm.includes(n)) {
                            embed.addFields({
                                name: `❌ | \`${c.name}\``,
                                value: `${c.description ? c.description : 'Lệnh không có mô tả.'}`,
                                inline: true
                            })
                        }
                    } else {
                        embed.addFields({
                            name: `✅ | \`${c.name}\``,
                            value: `${c.description ? c.description : 'Lệnh không có mô tả.'}`,
                            inline: true
                        })
                    }
                })
                interaction.update({ embeds: [embed], components: row(false) })
            })
            collector.on('end', () => {
                interaction.editReply({ components: row(true) })
            })
        } else {
            const command =
                client.commands.get(interaction.options.getString('command').toLowerCase()) ||
                client.commands.find(
                    (c) => c.aliases && c.aliases.includes(interaction.options.getString('command').toLowerCase())
                );

            if (!command) {
                const embed = new MessageEmbed()
                    .setTitle(`Không tìm thấy lệnh! Sử dụng \`${prefix}help\` để xem tất cả lệnh!`)
                    .setColor("FF0000");
                return interaction.editReply({ embeds: [embed] });
            }

            const embed = new MessageEmbed()
                .setTitle("Chi tiết lệnh:")
                .addFields({
                    name: "PREFIX:", 
                    value: `\`${prefix}\``, 
                    inline: true
                },{
                    name: "LỆNH:",
                    value: `${command.name 
                        ? `\`${command.name}\`` 
                        : "Không có tên cho lệnh này."}`,
                    inline: true
                },{
                    name: "MÔ TẢ LỆNH:",
                    value: `${command.description
                        ? command.description
                        : "Không có mô tả cho lệnh này"}`,
                    inline: false
                },{
                    name: "ALIASES:",
                    value: `Không có Aliases cho slash command`,
                    inline: true
                },{
                    name: "CÁCH DÙNG:",
                    value: `${command.usage 
                    ? `${prefix}${command.name} ${command.usage}` 
                    : `${prefix}${command.name}`}`,
                    inline: true
                })
                .setFooter({
                    text: `Yêu cầu bởi ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                })
                .setTimestamp()
                .setColor('RANDOM');
            return interaction.reply({ embeds: [embed] });
        }
    }
} 