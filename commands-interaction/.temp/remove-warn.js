const { CommandInteraction, MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removewarn')
        .setDescription('Xóa 1 cảnh cáo.')
        .addUserOption(option => option
            .setName('user')
            .setDescription('User muốn xóa cảnh cáo')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('reason')
            .setDescription('Lý do thu hồi warn cho user.')
            .setRequired(false)
        )
        .addBooleanOption(option => option
            .setName('dms')
            .setDescription('DMs cho user')
        ),
    /**
    * 
    * @param {CommandInteraction} interaction 
    */
    run: async (interaction) => {
        const client = interaction.client
        const db = require('../models/warns')
        const setchannel = require('../models/setchannel')
        if (!message.member.permissions.has("MANAGE_MESSAGES")) return message.channel.send('Bạn không có quyền `MANAGE_MESSAGES`')
        let user = interaction.options.getUser('user')
        let reason = interaction.options.getString('resson');
        if (!reason) reason = "Không có lý do.";
        const embed = new MessageEmbed()
            .setTitle('User đã được xóa 1 cảnh cáo')
            .addFields({
                name: 'Guild Name',
                value: `${interaction.guild.name}`,
                inline: true,
            },
                {
                    name: 'Username',
                    value: `${user.username}`,
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
            .setFooter({
                text: `${client.user.tag}`,
                iconURL: client.user.displayAvatarURL()
            })
        db.findOne({ guildid: interaction.guild.id, user: user.id }, async (err, data) => {
            if (err) throw err;
            if (data) {
                data.content.splice(0, 1)
                data.save()
                setchannel.findOne({ guilid: interaction.guild.id }, async (err, data) => {
                    if (err) throw err;
                    if (data) {
                        if (data.warn !== 'No data') {
                            const channel = message.guild.channels.cache.get(data.warn)
                            interaction.editReply(`Đã thu hồi 1 lệnh cảnh cáo của ${user.username}`)

                            channel.send(embed)
                            if (interaction.options.getBoolean('dms') === true) user.send(embed)
                        } else {
                            interaction.editReply({ embeds: [embed] })
                            if (interaction.options.getBoolean('dms') === true)user.send(embed)
                        }
                    } else {
                        interaction.editReply({ embeds: [embed] })
                        if (interaction.options.getBoolean('dms') === true) user.send(embed)
                    }
                })
                data.save()
            } else {
                interaction.editReply('Người dùng hiện tại không bị cảnh cáo')
            }
        })
    }
} 