const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'ping',
    category: 'user',
    aliases: ['lag', 'lags'],
    description: 'Xem mạng nhà thg dev hoặc thg host có mượt hay ko',
    usage: ',ping đơn giản dễ hiểu',
    run: (client, message, args) => {
        message.reply('Checking...').then(m => {
            const ping = m.createdTimestamp - message.createdTimestamp;
            const wsping = client.ws.ping
            var pingbar = ''
            if (ping <= 25) { pingbar = '[■□□□□□] Dảk quá pepsi ơi' }
            if (ping > 25 && ping <= 50) { pingbar = '[■■□□□□] Hơi lác xíu làm j căng' }
            if (ping > 50 && ping <= 100) { pingbar = '[■■■□□□] Lag vl, mạng nhà thg host sao thế ??' }
            if (ping > 100 && ping <= 250) { pingbar = '[■■■■□□ Anh host à, anh đang xem sếch à' }
            if (ping > 250 && ping <= 500) { pingbar = '[■■■■■□] Ờ, giảm tiền lương thg host.' }
            if (ping >= 500) { pingbar = '[■■■■■■] Chậm đếy, nhưng có chậm như cách cờ rút rep tin nhắn mày ko' }
            var wspingbar = ''
            if (wsping <= 25) { wspingbar = '[■□□□□□] Dảk quá pepsi ơi' }
            if (wsping > 25 && wsping <= 50) { wspingbar = '[■■□□□□] Hơi lác xíu làm j căng' }
            if (wsping > 50 && wsping <= 100) { wspingbar = '[■■■□□□] Lag vl, anh api ơi, sao thế ??' }
            if (wsping > 100 && wsping <= 250) { wspingbar = '[■■■■□□] Anh API à, bớt xem sếch đi' }
            if (wsping > 250 && wsping <= 500) { wspingbar = '[■■■■■□] Ờ, giảm tiền lương anh API đêy.' }
            if (wsping >= 500) { wspingbar = '[■■■■■■] Chậm đếy, nhưng có chậm như cách cờ rút rep tin nhắn mày ko' }
            m.delete()
            const embed = new MessageEmbed()
                .setTitle(`Bot's Ping`)
                .setAuthor({ name: `${client.user.tag}`, iconURL: client.user.displayAvatarURL() })
                .setThumbnail(message.guild.iconURL({ dynamic: true }))
                .addFields({
                    name: `> Thời gian rep tin nhắn của t là: ${ping}ms`,
                    value: `${pingbar}`,
                },
                    {
                        name: `> Thời gian rep tin nhắn của WS là: ${client.ws.ping}ms`,
                        value: `${wspingbar}`,
                    })
                .setColor('#029202')
                .setFooter({ text: `${message.author.tag} • ${message.guild.name}`, iconURL: `${message.author.displayAvatarURL()}` })
                .setTimestamp()
            message.reply({ embeds: [embed] })
        })
    }
}