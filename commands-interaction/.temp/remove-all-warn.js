const { CommandInteraction, MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removeallwarn')
        .setDescription('Xóa tất cả cảnh cáo.')
        .addUserOption(option => option
            .setName('user')
            .setDescription('User muốn xóa cảnh cáo')
            .setRequired(true)    
        )
        .addStringOption(option => option
            .setName('reason')
            .setDescription('Lý do thu hồi warns cho user.')
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
        if (!message.member.permissions.has("MANAGE_MESSAGES")) return message.channel.send('Bạn thiếu quyền `MANAGE_MESSAGES`')
        const db = require('../models/warns')
        const setchannel = require('../models/setchannel')
        let user = interaction.options.getUser('user')
        let reason = interaction.options.getString('resson');
        if (!reason) reason = "Không có lý do.";
        const embed = new MessageEmbed()
            .setTitle('User đã được xóa mọi cảnh cáo')
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
        db.findOneAndDelete({ guildid: interaction.guild.id, user: user.id }, async (err, data) => {
            if (err) throw err;
            if (data) {
                data.save()
                setchannel.findOne({ guilid: interaction.guild.id }, async (err, data) => {
                    if (err) throw err;
                    if (data) {
                        if (data.warn !== 'No data') {
                            const channel = message.guild.channels.cache.get(data.warn)
                            interaction.editReply(`Đã thu hồi tất cả lệnh cảnh cáo của ${user.username}`)

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
            } else {
                interaction.editReply('Người dùng không bị cảnh cáo.')
            }
        })
    }
} 