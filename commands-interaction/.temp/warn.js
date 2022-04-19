const { CommandInteraction, MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warn 1 user')
        .addUserOption(option => option
            .setName('user')
            .setDescription('User muốn warn.')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('reason')
            .setDescription('Lý do warnuser.')
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
    run: async(interaction) => {
        if (interaction.deferred === false) await interaction.deferReply()
        const client = interaction.client

        const db = require('../../models/warns')
        const setchannel = require('../../models/setchannel')
        if (!interaction.member.permissions.has("MANAGE_MESSAGES")) return message.channel.send('Bạn không có quyền `MANAGE_MESSAGES`')
        let user = interaction.options.getUser('user')
        let reason = interaction.options.getString('reason');
        if (!reason) reason = "Không có lý do.";
        db.findOne({ guildid: interaction.guild.id, user: user.id }, async (err, data) => {
            if (err) throw err;
            if (!data) {
                data = new db({
                    guildid: interaction.guild.id,
                    user: user.id,
                    content: [
                        {
                            moderator: interaction.user.id,
                            reason: reason
                        }
                    ]
                })
            } else {
                const obj = {
                    moderator: interaction.user.id,
                    reason: reason
                }
                data.content.push(obj)
            }
            data.save()
        })
        const embed = new MessageEmbed()
            .setTitle('User đã bị cảnh cáo')
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
            .setColor('RED')

        setchannel.findOne({ guilid: interaction.guild.id }, async (err, data) => {
            if (err) throw err;
            if (data) {
                if (data.warn !== 'No data') {
                    const Channel = interaction.guild.channels.cache.get(data.warn)
                    interaction.editReply(`Đã warn ${user.username}\nXem thêm tại <#${data.ban}>`)
                    if (interaction.options.getBoolean('dms') === true) user.send({ embeds: [embed] })
                    Channel.send({ embeds: [embed] })
                } else {
                    if (interaction.options.getBoolean('dms') === true) user.send({ embeds: [embed] })
                    message.reply({ embeds: [embed] })
                }
            } else {
                if (interaction.options.getBoolean('dms') === true) user.send({ embeds: [embed] })
                message.reply({ embeds: [embed] })
            }
        })
    }
} 