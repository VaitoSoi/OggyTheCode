const { Message } = require('discord.js')

/**
 * 
 * @param {Message} message
 */
module.exports = async (message) => {
    return message.channel.send(
        'Nếu bạn cần hỗ trợ thì hạy vào Support Server của bot: https://discord.com/invite/NBsnNGDeQd'
        )
}