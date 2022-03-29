const { CommandInteraction, MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warns')
        .setDescription('Xem số warn mà user hiện có')
        .addUserOption(option => option
            .setName('user')
            .setDescription('User muốn xem warn')
            .setRequired(true)
        ),
    /**
    * 
    * @param {CommandInteraction} interaction 
    */
    run: async (interaction) => {
        const client = interaction.client
        const db = require('../../models/warns')
        let user = interaction.options.getUser('user')
        db.findOne({ guildid: interaction.guild.id, user: user.id }, async (err, data) => {
            if (err) throw err;
            if (data) {
                const embed = new MessageEmbed()
                    .setTitle(`${user.tag}'s warns'`)
                    .setColor('BLUE')
                    .setAuthor({
                        name: `${client.user.tag}`,
                        iconURL: client.user.displayAvatarURL()
                    })
                    .setFooter({
                        text: `${interaction.user.tag}`,
                        iconURL: interaction.user.displayAvatarURL()
                    })
                    .setTimestamp()
                let num = 0
                data.content.forEach((d) => {
                    num++
                    embed.addFields({
                        name: `Warn ${num}:`,
                        value: '``` Moderator: ' + interaction.guild.members.cache.get(d.moderator).user.tag + '\nReason: ' + d.reason + '```',
                        inline: true
                    })
                })
                interaction.reply({
                    embeds: [
                        embed
                    ]
                })
            } else {
                interaction.reply('Không tìm thấy data của người dùng.')
            }
        })
    }
} 