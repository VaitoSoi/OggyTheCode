const { CommandInteraction } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Lấy avatar của 1 user')
        .addUserOption(option => option
                .setName('user')
                .setDescription('User mà bạn muốn lấy avatar')
                .setRequired(true)
            ),
    /**
    * 
    * @param {CommandInteraction} interaction 
    */ 
    run: async(interaction) => {
        const client = interaction.client
        const URL = interaction.options.getUser('user').avatarURL({ format: 'jpg', dynamic: true, size: 1024 })
        const embed = new MessageEmbed()
            .setImage(URL)
            .setURL(URL)
            .setTitle('Nguồn của avatar')
        interaction.reply({ embeds: [embed] })
    }
} 