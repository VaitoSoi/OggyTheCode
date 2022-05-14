const { CommandInteraction } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('prefix')
        .setDescription('Chuyển prefix của server')
        .addStringOption(option => option
            .setName('prefix')
            .setDescription('Prefix muốn chuyển thành.')
            .setRequired(true)
        ),
    /**
    * 
    * @param {CommandInteraction} interaction 
    */
    run: async (interaction) => {
        const client = interaction.client
        const prefixSchema = require('../models/prefix')
        const baseprefix = process.env.PREFIX
        const res = await interaction.options.getString('prefix')
        if (res === baseprefix) return interaction.editReply('Vui lòng dùng lệnh `reset-prefix`')

        prefixSchema.findOne({ GuildId: interaction.guild.id }, async (err, data) => {
            if (err) throw err;
            if (data) {
                await prefixSchema.findOneAndDelete({ GuilId: interaction.guild.id })
                data = new prefixSchema({
                    GuildId: interaction.guild.id,
                    Prefix: res,
                    GuildName: interaction.guild.name,
                    UserId: interaction.user.id,
                    UserName: interaction.user.username
                })
                data.save()
                interaction.editReply(`Prefix đã đc đổi thành "**${res}**"`)
            } else {
                data = new prefixSchema({
                    GuildId: interaction.guild.id,
                    Prefix: res,
                    GuildName: interaction.guild.name,
                    UserId: interaction.user.id,
                    UserName: interaction.user.username
                })
                data.save()
                interaction.editReply(`Prefix đã đc đổi thành "**${res}**"`)
            }
        })
    }
} 