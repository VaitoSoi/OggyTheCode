const { MessageEmbed } = require('discord.js')
const { response } = require('express')
const minecraft = require('minecraft-server-util')
const { report } = require('superagent')

module.exports = {
    name: 'status',
    description: 'Thông tin về sever muốn biết.',
    usage: ' <ip> <port>',
    category: 'user',
    run: async (client, message, args) => {
        const ip = args[0]
        if (!ip) return message.channel.send('Không đưa IP làm ăn kiểu gì.')
        let port = args[1]
        if (!port) {
            message.channel.send('Nếu không nhập port của sever. Chuyển port về mặc định "**25565**".')
            port = 25565
        }
        minecraft.status(ip, { port: parseInt(port) }).then((response) => {
            const embed = new MessageEmbed()
                .setColor('RANDOM')
                .setTitle('Minecraft Sever Info')
                .setThumbnail(message.guild.iconURL({ dynamic: true }))
                .setFooter({ text: `${message.author.tag} • ${message.guild.name}`, iconURL: `${message.author.displayAvatarURL()}` })
                .setTimestamp()
                .setAuthor({ name: `${client.user.username}`, iconURL: client.user.displayAvatarURL() })
                .addFields({
                    name: 'IP',
                    value: `${response.host}`
                },
                    {
                        name: 'Port',
                        value: `${response.port}`
                    },
                    {
                        name: 'Số Player hiện tại',
                        value: `${response.onlinePlayers}/${response.maxPlayers}`
                    },
                    {
                        name: 'Phiên bản',
                        value: `${response.version}`
                    })
            message.reply({ embeds: [embed] })
        })
            .catch((error) => {
                message.channel.send(`Đã gặp lỗi khi tìm thông tin về sever. Vui lòng thử lại.Lỗi: **${error}**`)
                throw error
            })
    }
}