const { CommandInteraction, MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Mute 1 user')
        .addUserOption(option => option
            .setName('user')
            .setDescription('User muốn mute.')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('reason')
            .setDescription('Lý do mute user.')
            .setRequired(false)
        )
        .addBooleanOption(option => option
            .setName('dms')
            .setDescription('DMs cho user')
            .setRequired(false)
        )
        .addStringOption(option => option
            .setName('time')
            .setDescription('Thời gian để user có thể unmute')
        ),
    /**
    * 
    * @param {CommandInteraction} interaction 
    */
    run: async (interaction) => {
        const client = interaction.client
        const channel = require('../models/setchannel')
        const setrole = require('../models/setrole')
        let role = ''
        const data = await setrole.findOne({
            guildid: interaction.guildId
        })
        if (data) {
            role = interaction.guild.roles.cache.get(data.mute)
            if (!role) return interaction.reply('Role được cho không hợp lệ!')
        } else {
            role = interaction.guild.roles.cache.find(r => r.name.toLowerCase() === 'muted')
        }
        if (!interaction.memberPermissions.has("MANAGE_ROLES")) return interaction.reply('Bạn không có quyền `MANAGE_ROLES`')
        if (!interaction.guild.me.permissions.has("MANAGE_ROLES")) return interaction.reply('Tôi không có quyền `MANAGE_ROLES`')
        let Member = interaction.guild.members.cache.get(interaction.options.getUser('user'))
        let reason = interaction.options.getString('resson');
        if (!reason) reason = "Không có lý do.";
        if (Member.roles.cache.has(role.id)) return interaction.reply(`${Member.displayName} đã bị mute từ trước!`)
        await Member.roles.add(role1)
        const embed = new MessageEmbed()
            .setTitle('User đã bị mute')
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
        channel.findOne({ guildid: interaction.guild.id }, async (err, data) => {
            if (err) throw err;
            if (data) {
                if (data.mute !== 'No data') {
                    const Channel = interaction.guild.channels.cache.get(data.mute)
                    if (interaction.options.getBoolean('dms') === true) Member.send(embed)
                        .catch(error => { })
                    interaction.reply('Đã mute ' + Member.user.tag)
                    Channel.send({ embeds: [embed] })
                } else {
                    if (interaction.options.getBoolean('dms') === true) Member.send(embed)
                        .catch(error => { })
                    interaction.reply({ embeds: [embed] })
                }
            } else {
                if (interaction.options.getBoolean('dms') === true) Member.send(embed)
                    .catch(error => { })
                interaction.reply({ embeds: [embed] })
            }
        })
        if (interaction.options.getString('time')) try {
            setTimeout(async () => {
                await Member.roles.remove(role.id)
                Member.user.send({
                    embeds: [
                        new MessageEmbed()
                            .setTitle('User đã được unmute')
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
                                    value: `**${client.user.tag}**`,
                                    inline: true
                                },
                                {
                                    name: 'Lý do',
                                    value: `Hết hiệu lực tempmute`,
                                    inline: true
                                })
                            .setColor('BLUE')
                            .setTimestamp()
                            .setAuthor({ name: `${client.user.tag} | Vào`, iconURL: client.user.avatarURL() })
                    ]
                })
            }, ms(interaction.options.getString('time')));
        } catch (error) {

        }
    }
} 