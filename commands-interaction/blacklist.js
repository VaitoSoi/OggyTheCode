const { CommandInteraction, MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const blacklist = require('../models/blacklist')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('blacklist')
        .setDescription('Blacklist 1 user')
        .addStringOption(option => option
            .setName('action')
            .setDescription('Xóa / Thêm blacklist')
            .setRequired(true)
            .addChoice('Add', 'add')
            .addChoice('Remove', 'remove')
        )
        .addUserOption(option => option
            .setName('user')
            .setDescription('User bạn muốn bị blacklist')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('reason')
            .setDescription('Lý do user bị blacklist')
        )
        .addBooleanOption(option => option
            .setName('dms')
            .setDescription('Gửi tin nhắn cho user bị blacklist')
        ),
    /**
    * 
    * @param {CommandInteraction} interaction 
    */
    run: async (interaction) => {
        if (interaction.user.id !== '692271452053045279') return interaction.editReply('BOT OWNER ONLY')
        let client = interaction.client
            , user = interaction.options.getUser('user')
            , reason = interaction.options.getString('reason')
            , data = blacklist.findOne({ id: user.id })
            , action = interaction.options.getString('action').toLowerCase()
        if (!user) return interaction.editReply('Không phát hiện User !')
        if (!reason) reason = "Không có lý do.";
        if (action === 'add') {
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
        } else if (action === 'remove') {
            if (!data) {
                blacklist.findOneAndDelete({ id: user.id })
                const embed = new MessageEmbed()
                    .setTitle('Người dùng đã được gỡ blacklist')
                    .addFields({
                        name: 'Username:',
                        value: `> ${user.username}`,
                        inline: true
                    },
                        {
                            name: 'Bởi: ',
                            value: `> ${interaction.user.tag}`,
                            inline: true
                        },
                        {
                            name: 'Lý do',
                            value: `> ${reason}`,
                            inline: true
                        })
                    .setColor('BLUE')
                    .setThumbnail(user.displayAvatarURL())
                    .setTimestamp()
                    .setFooter({ text: 'Vào lúc', iconURL: interaction.user.displayAvatarURL() })
                    .setAuthor({
                        name: client.user.tag + ' blacklist',
                        iconURL: client.user.displayAvatarURL()
                    })
                interaction.editReply({ embeds: [embed] })
                if (interaction.options.getBoolean('dms') === true) user.send({ embeds: [embed] })
            } else {
                interaction.editReply('Người dùng chưa bị blacklist.\nVui lòng dùng lệnh blacklist để blacklist.')
            }
        }
    }
}