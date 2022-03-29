const { CommandInteraction, MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rpc')
        .setDescription('Hiện list RPC của bot'),
    /**
    * 
    * @param {CommandInteraction} interaction 
    */ 
    run: async(interaction) => {
        const client = interaction.client

        const arrayOfStatus = require('../info/statusArray')
        interaction.reply({
            embeds: [
                new MessageEmbed()
                .setTitle('Các RPC của bot hiện tại.')
                .setDescription(arrayOfStatus.join('\n'))
                .setFooter({ text: `${interaction.user.tag} • ${interaction.guild.name}`, iconURL: interaction.user.avatarURL() })
                .setTimestamp()
                .setColor('RANDOM')
            ]
        })
    }
} 