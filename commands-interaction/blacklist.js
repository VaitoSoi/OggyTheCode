const { CommandInteraction, MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const blacklist = require('../models/blacklist')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('blacklist')
        .setDescription('Blacklist 1 user')
        .addUserOption(option => option
            .setName('user')
            .setDescription('User bạn muốn bị blacklist')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('reason')
            .setDescription('Lý do user bị blacklist')
            .setRequired(true)
        )
        .addBooleanOption(option => option
            .setName('dms')
            .setDescription('Gửi tin nhắn cho user bị blacklist')
            .setRequired(true)
        ),
    /**
    * 
    * @param {CommandInteraction} interaction 
    */
    run: async (interaction) => {
        if (interaction.user.id !== '692271452053045279') return interaction.editReply('BOT OWNER ONLY')
        const client = interaction.client
        const user = interaction.options.getUser('user')
        if (!user) return interaction.editReply('Không phát hiện User !')
        let reason = interaction.options.getString('reason')
        if (!reason) reason = "Không có lý do.";
        blacklist.findOne({ id: user.id }, async (err, data) => {
            if (err) throw err;
            if (data) {
                interaction.editReply(`**${user.tag}** đã bị blacklist từ trước.`)
            } else {
                data = new blacklist({
                    id: user.id,
                    name: user.username,
                    reason: reason,
                    by: interaction.user.tag
                })
                await data.save()
                    .catch(err => console.log(err))
                const embed1 = new MessageEmbed()
                    .setTitle('Người dùng đã bị blacklist')
                    .addFields({
                        name: 'Username: ',
                        value: `> ${user.tag}`,
                        inline: true
                    },
                        {
                            name: 'Bởi: ',
                            value: `> ${interaction.user.tag}`,
                            inline: true
                        },
                        {
                            name: 'Lý do: ',
                            value: `> ${reason}`,
                            inline: false
                        })
                    .setColor('BLUE')
                    .setThumbnail(user.displayAvatarURL())
                    .setTimestamp()
                    .setFooter({ text: 'Vào lúc', iconURL: interaction.user.displayAvatarURL() })
                    .setAuthor({
                        name: client.user.tag + ' blacklist',
                        iconURL: client.user.displayAvatarURL()
                    })
                interaction.editReply({ embeds: [embed1] })
                if (interaction.options.getBoolean('dms') === true) user.send({ embeds: [embed1] })
            }
        })
    }
}