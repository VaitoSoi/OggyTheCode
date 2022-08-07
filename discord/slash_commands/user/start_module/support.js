const { CommandInteraction } = require('discord.js')

/**
 * 
 * @param {CommandInteraction} interaction 
 */
module.exports = (interaction) => {
    return interaction.channel.send(
        'Nếu bạn cần hỗ trợ thì hạy vào Support Server của bot: https://discord.com/invite/NBsnNGDeQd'
        )
}