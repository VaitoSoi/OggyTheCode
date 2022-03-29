const { CommandInteraction } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('disable')
        .setDescription('Tắt 1 lệnh')
        .addStringOption(option => option
            .setName('command')
            .setDescription('Tên câu lệnh')
            .setRequired(true)
        ),
    /**
    * 
    * @param {CommandInteraction} interaction 
    */
    run: async (interaction) => {
        const client = interaction.client
        const dcommand = require('../models/commands')
        const cmd =
            client.commands.get(interaction.options.getString('command').toLowerCase()) ||
            client.commands.find(
                (c) => c.aliases && c.aliases.includes(getString('command'))
            );
        if (!cmd) return interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setTitle(`❌ | Không tìm thấy lệnh \`${cmd}\``)
                    .setColor('#f00c0c')
            ]
        })
        dcommand.findOne({ guildid: interaction.guildId }, async (err, data) => {
            if (err) throw err;
            if (data) {
                if (data.commands.includes(cmd.name)) return interaction.reply(`Lệnh \`${cmd.name}\` đã bị tắt!`)
                data.commands.push(`${cmd.name.toLowerCase()}`)
                data.save()
                interaction.reply(`Đã tắt lệnh\`${cmd.name}\``)
            } else if (!data) {
                interaction.channel.send('Không thấy data.').then(msg => {
                    msg.edit('Đang tạo data')
                    data = new dcommand({
                        guildid: interaction.guildId,
                        guildname: interaction.guild.name,
                        commands: [cmd.name.toLowerCase()]
                    })
                    data.save()
                    msg.delete()
                    interaction.reply('Đã tạo data')
                })
            }
        })

    }
} 