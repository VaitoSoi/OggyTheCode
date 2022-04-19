const { CommandInteraction, MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const delay = require('../util/delay')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('enable')
        .setDescription('Bật 1 lệnh đã tắt trước đó')
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

        const dcommand = require('../../models/commands')
        const c =
            client.commands.get(interaction.options.getString('command').toLowerCase()) ||
            client.commands.find(
                (c) => c.aliases && c.aliases.includes(getString('command'))
            );
        if (!c) return interaction.editReply({
            embeds: [
                new MessageEmbed()
                    .setTitle(`❌ | Không tìm thấy lệnh **\`${args[1]}\`**`)
                    .setColor('#f00c0c')
            ]
        })
        const cmd = c.name
        dcommand.findOne({ guildid: interaction.guildId }, async (err, data) => {
            if (err) throw err;
            if (data) {
                if (!data.commands.includes(cmd)) {
                    interaction.editReply(`Lệnh \`${cmd}\` không bị tắt!`)
                } else {
                    const cmds = data.commands
                    for (let i = 0; i < cmds.length; i++) {
                        if (data.commands[i] === cmd) {
                            dcommand.findOneAndUpdate({ guildid: interaction.guildId }, { $set: { commands: data.commands.slice(0, i).concat(data.commands.slice(i + 1, data.commands.length)) } }, async (err, data) => {
                                if (err) throw err;
                                if (data) {
                                    interaction.editReply(`Đã bật lệnh ${cmd}`)
                                    data.save()
                                }
                            })
                        }
                    }
                }
            } else {
                interaction.channel.send('Không thấy data.')
                delay(1000)
                interaction.editReply('Đang tạo data')
                data = new dcommand({
                    guildid: interaction.guildId,
                    guildname: interaction.guild.name,
                    commands: []
                })
                data.save()
                interaction.editReply('Đã tạo data và đã bật lệnh ' + cmd)
            }
        })
    }
}