const { CommandInteraction, MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('check')
        .setDescription('Kiểm tra xem user có bị chặn hay không')
        .addUserOption(o => o
            .setName('user')
            .setDescription('User muốn kiểm tra')
            .setRequired(true)
        ),
    /**
    * 
    * @param {CommandInteraction} interaction 
    */
    run: async (interaction) => {
        const client = interaction.client
        const db = require('../../../models/blacklist')
        const user = interaction.options.getUser('user')
        let data = await db.findOne({ id: user.id })
        if (!data) return interaction.editReply({ content: `🛑 | ${user} chưa bị chặn.` })
        interaction.editReply({
            embeds: [
                new MessageEmbed()
                    .setTitle('User Blacklist')
                    .setThumbnail(user.displayAvatarURL())
                    .setFooter({
                        text: `${interaction.user.tag}`,
                        iconURL: interaction.user.displayAvatarURL()
                    })
                    .setAuthor({
                        name: client.user.tag,
                        iconURL: client.user.displayAvatarURL()
                    })
                    .setColor('RANDOM')
                    .setDescription(
                        'Thông tin về User bị blacklist\n' +
                        `Tag: \`${user.tag}\`\n` +
                        `UserID: \`${user.id}\`\n` +
                        `Lý do: \`${data.reason}\`\n` +
                        `Bởi: \`${data.by}\`\n` +
                        `Loại: \`${data.type ? data.type : 'all'}\`\n` +
                        `Lúc: ${data.at
                            ? `<t:${data.at}:f> (<t:${data.at}:R>)` : `\`¯\\_(ツ)_/¯\``}\n` +
                        `Hết hạn: ${data.end.toLowerCase() != 'vĩnh viễn'
                            ? `<t:${data.end}:f> (<t:${data.end}:R>)` : `\`${data.end}\``}`
                    )
                    .setTimestamp()
            ]
        })
    }
} 