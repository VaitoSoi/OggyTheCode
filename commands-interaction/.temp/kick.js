const { CommandInteraction, MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kick 1 user')
        .addUserOption(option => option
            .setName('user')
            .setDescription('User muốn kick.')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('reason')
            .setDescription('Lý do kick user.')
            .setRequired(false)
        )
        .addBooleanOption(option => option
            .setName('dms')
            .setDescription('DMs cho user')
            .setRequired(false)
        ),
    /**
    * 
    * @param {CommandInteraction} interaction 
    */
    run: async (interaction) => {
        const client = interaction.client
        const setchannel = require('../models/setchannel')
        if (!interaction.member.permissions.has("KICK_MEMBERS")) return interaction.editReply('Bạn không có quyền `KICK_USERS`')
        if (!interaction.guild.me.permissions.has("KICK_MEMBERS")) return interaction.editReply('Tôi không có quyền `KICK_USERS`')
        let member = interaction.guild.members.cache.get(interaction.options.getUser('user'))
        let reason = interaction.options.getString('reason');
        if (!reason) reason = "Không có lý do."
        const embed = new MessageEmbed()
            .setTitle('User đã bị kick!')
            .addFields({
                name: 'Guild Name',
                value: `${interaction.guild.name}`,
                inline: true,
            },
                {
                    name: 'Username',
                    value: `${member.user.username}`,
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
            .setTimestamp()
            .setAuthor({ name: `${client.user.tag} | Vào`, iconURL: client.user.avatarURL() })
        setchannel.findOne({ guilid: message.guild.id }, async (err, data) => {
            if (err) throw err;
            if (data) {
                if (data.kick !== 'No data') {
                    const Channel = interaction.guild.channels.cache.get(data.kick)
                    if (member.kickable) {
                        if (interaction.options.getBoolean('dms') === true) member.send(embed)
                            .catch(error => { })
                            .then(m => member.kick({ reason }))
                        interaction.editReply(`Đã kick ${member.user.tag}`)
                        Channel.send(embed)
                    } else {
                        interaction.editReply('Không thể kick thành viên ' + member.user.tag)
                    }
                } else {
                    if (member.kickable) {
                        if (interaction.options.getBoolean('dms') === true) member.send(embed)
                            .catch(error => { })
                            .then(m => member.kick({ reason }))
                        interaction.editReply({ embeds: [embed] })
                    } else {
                        interaction.editReply('Không thể đuổi thành viên ' + member.user.tag)
                    }
                }
            } else {
                if (member.kickable) {
                    if (interaction.options.getBoolean('dms') === true) member.send(embed)
                        .catch(error => { })
                        .then(m => member.kick({ reason }))
                    interaction.editReply({ embeds: [embed] })
                } else {
                    interaction.editReply('Không thể đuổi thành viên ' + member.user.tag)
                }
            }
        })
    }
}