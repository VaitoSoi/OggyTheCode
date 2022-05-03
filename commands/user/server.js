const { MessageEmbed } = require('discord.js')
const minecraft = require('minecraft-server-util')

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
            message.channel.send('Nếu không nhập port của sever.\nPort sẽ là port mặc định: `25565`.')
            port = 25565
        } 
        const embed = new MessageEmbed()
            .setTitle('Minecraft Sever Info')
            .setFooter({ text: `${message.author.tag} • ${message.guild.name}`, iconURL: `${message.author.displayAvatarURL()}` })
            .setTimestamp()
            .setAuthor({ name: `${client.user.username}`, iconURL: client.user.displayAvatarURL() })

        await minecraft.status(ip, port).then((response) => {
            let sample
            if (!response.players.sample || response.players.sample.length == 0) sample = 'null'
            else if (response.players.sample && response.players.sample.length != 0) sample = response.players.sample
            embed
                .setColor('RANDOM')
                .addFields({
                    name: 'IP',
                    value: `${response.srvRecord.host}`,
                    inline: true
                },
                    {
                        name: 'Port',
                        value: `${response.srvRecord.port}`,
                        inline: true
                    },
                    {
                        name: 'MOTD',
                        value: `${response.motd.clean}`,
                        inline: false
                    },
                    {
                        name: 'Số Player hiện tại',
                        value: `${response.players.online}/${response.players.max}`,
                        inline: true
                    },
                    {
                        name: 'Sample player',
                        value: `${sample}`,
                        inline: true
                    },
                    {
                        name: 'Phiên bản',
                        value: `${response.version.name.replace("§1", "")}`,
                        inline: true
                    })
                .setThumbnail(message.guild.iconURL())
        })
            .catch((error) => {
                embed
                    .setColor('RED')
                    .setThumbnail('https://cdn.discordapp.com/attachments/936994104884224020/956369715192795246/2Q.png')
                    .setDescription('🛑 | Phát hiện lỗi khi tìm server: `' + ip + '`\n ```' + error + '```\nCách khác phục:\n> Kiểm tra lại IP.\n> Kiểm tra lại Port')
            })
        message.reply({ embeds: [embed] })
    }
}