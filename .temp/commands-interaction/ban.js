const { CommandInteraction, MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban 1 member')
        .addUserOption(option => option
            .setName('member')
            .setDescription('Member mà bạn muốn ban.')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('reason')
            .setDescription('Lý do thành viên bị ban')
        ),
    /**
    * 
    * @param {CommandInteraction} interaction 
    */
    run: async (interaction) => {
        const client = interaction.client
        const member = interaction.guild.members.cache.get(interaction.options.getUser('member'))
        let reason = interaction.options.getString('reason')
        if (!reason) reason = "Không có lý do."
        const embed = new MessageEmbed()
            .setTitle('Thành viên đã bị cấm!')
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
            .setAuthor({ name: `${client.user.tag}`, iconURL: client.user.avatarURL() })
            .setColor('BLURPLE')
        setchannel.finOne({ guilid: interaction.guild.id }, async (err, data) => {
            if (err) throw err;
            if (data) {
                if (data.ban !== 'No data') {
                    if (member.bannable) {
                        member.send(embed).catch(error => interaction.reply({ content: 'Không thể gửi tin nhắn cho thành viên được mention(tags)!' }))
                            .then(m => member.ban({ reason }))
                        interaction.reply({ embeds: [embed] })
                        interaction.client.channels.cache.get(data.ban).send({ embeds: embed })
                    } else {
                        interaction.reply({ content: 'Không thể cấm thành viên được mention(tag)!' })
                    }
                } else {
                    if (member.bannable) {
                        member.send(embed).catch(error => message.channel.send({ content: 'Không thể gửi tin nhắn cho thành viên được mention(tags)!' }))
                            .then(m => member.ban({ reason }))
                        interaction.reply({ embeds: [embed] })
                    } else {
                        interaction.reply('Không thể cấm thành viên được mention(tag)!')
                    }
                }
            } else {
                if (member.bannable) {
                    member.send(embed).catch(error => message.channel.send('Không thể gửi tin nhắn cho thành viên được mention(tags)!'))
                        .then(m => member.ban({ reason }))
                    interaction.reply({ embeds: [embed] })
                } else {
                    interaction.reply({ content: 'Không thể cấm thành viên được mention(tag)!', ephemeral: ephemeral })
                }
            }
        })
    }
} 