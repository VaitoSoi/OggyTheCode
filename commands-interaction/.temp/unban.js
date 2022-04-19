const { CommandInteraction, MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unban 1 user')
        .addIntegerOption(option => option
            .setName('userid')
            .setDescription('ID của user muốn unban')
            .setRequired(true)
        ),
    /**
    * 
    * @param {CommandInteraction} interaction 
    */
    run: async (interaction) => {
        const client = interaction.client

        const setchannel = require('../../models/setchannel')

        if (!interaction.member.permissions.has("BAN_MEMBERS")) return interaction.editReply('Bạn không có quyền `BAN_MEMBERS`')
        if (!interaction.guild.me.permissions.has("BAN_MEMBERS")) return interaction.editReply('Tôi không có quyền `BAN_MEMBERS`')
        let userid = interaction.options.getInteger('userid')
        let bans = await interaction.guild.bans.fetch();
        setchannel.findOne({ guildid: interaction.guild.id }, async (err, data) => {
            if (err) throw err;
            if (data) {
                if (data.ban !== 'No data') {
                    const Channel = interaction.guild.channels.cache.get(data.ban)
                    if (bans.has(userid)) {
                        try {
                            interaction.guild.members.unban(userid)
                            interaction.editReply(`Đã gỡ cấm cho ${userid}\nXem thêm tại <#${data.ban}>`)
                            Channel.send({
                                embeds:
                                    [
                                        new MessageEmbed()
                                            .setTitle('Người dùng đã được gỡ ban')
                                            .addFields({
                                                name: 'UserID',
                                                value: `${userid}`,
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
                                    ]
                            })
                        } catch (error) {
                            interaction.editReply('🛑 | Gặp lỗi khi unban user!')
                        }
                    } else {
                        interaction.editReply('UserID không hợp lệ hoặc không bị cấm.')
                    }
                } else {
                    if (bans.has(userid)) {
                        try {
                            interaction.guild.members.unban(userid)
                            interaction.editReply({
                                embeds:
                                    [
                                        new MessageEmbed()
                                            .setTitle('Người dùng đã được gỡ ban')
                                            .addFields({
                                                name: 'UserID',
                                                value: `${userid}`,
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
                                    ]
                            })
                        } catch (error) {
                            interaction.editReply('🛑 | Gặp lỗi khi unban user!')
                        }
                    } else {
                        interaction.editReply('UserID không hợp lệ hoặc không bị cấm.')
                    }
                }
            } else {
                if (bans.has(userid)) {
                    try {
                        interaction.guild.members.unban(userid)
                        interaction.editReply({
                            embeds:
                                [
                                    new MessageEmbed()
                                        .setTitle('Người dùng đã được gỡ ban')
                                        .addFields({
                                            name: 'UserID',
                                            value: `${userid}`,
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
                                ]
                        })
                    } catch (error) {
                        interaction.editReply('🛑 | Gặp lỗi khi unban user!')
                    }
                } else {
                    interaction.editReply('UserID không hợp lệ hoặc không bị cấm.')
                }
            }
        })
    }
} 