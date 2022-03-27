const { CommandInteraction, MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

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
        if (!c) return interaction.reply({
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
                    interaction.reply(`Lệnh \`${cmd}\` không bị tắt!`)
                } else {
                    const cmds = data.commands
                    for (let i = 0; i < cmds.length; i++) {
                        if (data.commands[i] === cmd) {
                            dcommand.findOneAndUpdate({ guildid: interaction.guildId }, { $set: { commands: data.commands.slice(0, i).concat(data.commands.slice(i + 1, data.commands.length)) } }, async (err, data) => {
                                if (err) throw err;
                                if (data) {
                                    interaction.reply(`Đã bật lệnh ${cmd}`)
                                    data.save()
                                }
                            })
                        }
                    }
                }
            } else {
                interaction.channel.send('Không thấy data.').then(msg => {
                    msg.edit('Đang tạo data')
                    data = new dcommand({
                        guildid: interaction.guildId,
                        guildname: interaction.guild.name,
                        commands: []
                    })
                    data.save()
                    msg.delete()
                    interaction.reply('Đã tạo data và đã bật lệnh ' + cmd)
                })
            }
        })
    }
}