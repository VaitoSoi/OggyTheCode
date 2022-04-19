const { CommandInteraction, MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unblacklist')
        .setDescription('Xóa blacklist 1 người')
        .addUserOption(option => option
            .setName('user')
            .setDescription('User muốn xóa blacklist')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('reason')
            .setDescription('Lý do xóa blacklist')
        )
        .addBooleanOption(option => option
            .setName('dms')
            .setDescription('DMs cho user')
        ),
    /**
    * 
    * @param {CommandInteraction} interaction 
    */ 
    run: async(interaction) => {
        if (interaction.deferred === false) await interaction.deferReply()
        const client = interaction.client

        const blacklist = require('../models/blacklist')
        if (interaction.user.id !== client.application.owner.id) return interaction.editReply('BOT OWNER ONLY')
        let User = interaction.options.getUser('user')
        let reason = interaction.options.getString('reason')
        if (!reason) reason = "Không có lý do.";

        blacklist.findOneAndDelete({ id: User.id }, async (err, data) => {
            if (err) throw err;
            if (data) {
                const embed = new MessageEmbed()
                    .setTitle('Người dùng đã được gỡ blacklist')
                    .addFields({
                        name: 'Username',
                        value: `${User.username}`,
                        inline: true
                    },
                        {
                            name: 'Bởi: ',
                            value: `**${interaction.user.tag}**`,
                            inline: true
                        },
                        {
                            name: 'Lý do',
                            value: `${reason}`,
                            inline: true
                        })
                    .setColor('BLUE')
                interaction.editReply({ embeds: [embed] })
                if (interaction.options.getBoolean('dms') === true) User.send(embed)
            } else {
                interaction.editReply('Người dùng chưa bị blacklist.\nVui lòng dùng lệnh blacklist để blacklist.')
            }
        })
    }
} 