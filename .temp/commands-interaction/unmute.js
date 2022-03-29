const { CommandInteraction, MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Unmute 1 user')
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
        ),
    /**
    * 
    * @param {CommandInteraction} interaction 
    */
    run: async (interaction) => {
        const client = interaction.client

        const setchannel = require('../models/setchannel')
        let Member = interaction.guild.members.cache.get(interaction.options.getUser('user'))
        let role = interaction.guild.roles.cache.get(require('../models/setrole').findOne({ guildid: interaction.guildId }).mute) || interaction.guild.roles.cache.find(r => r.name.toLocaleLowerCase() === 'muted')
        await Member.roles.remove(role)
        let reason = interaction.options.getString('reason')
        if (!reason) reason = "Không có lý do.";
        const embed = new MessageEmbed()
            .setTitle('User đã được gỡ mute')
            .addFields({
                name: 'Guild Name',
                value: `${interaction.guild.name}`,
                inline: true,
            },
                {
                    name: 'Username',
                    value: `${Member.user.username}`,
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
        setchannel.findOne({ guildid: interaction.guild.id }, async (err, data) => {
            if (err) throw err;
            if (data) {
                if (data.mute !== 'No data') {
                    const Channel = interaction.guild.channels.cache.get(data.mute)
                    interaction.reply(`Đã unmute ${Member.displayName}\nXem thêm tại <#${data.mute}>`)
                    Channel.send(embed)
                    if (interaction.options.getBoolean('dms') === true) Member.user.send(embed)
                } else {
                    interaction.reply({ embeds: [embed] })
                    if (interaction.options.getBoolean('dms') === true) Member.user.send(embed)
                }
            } else {
                interaction.reply({ embeds: [embed] })
                if (interaction.options.getBoolean('dms') === true) Member.user.send(embed)
            }
        })
    }
} 