const { CommandInteraction, MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Ping của bot và của WS'),
    /**
    * 
    * @param {CommandInteraction} interaction 
    */
    run: async (interaction) => {
        const client = interaction.client
        interaction.channel.send('Checking').then(m => {
            const ping = m.createdTimestamp - interaction.createdTimestamp;
            const wsping = client.ws.ping
            var pingbar = ' '
            if (ping <= 25) { pingbar = '[■□□□□□] Dảk quá pepsi ơi' }
            else if (ping > 25 && ping <= 50) { pingbar = '[■■□□□□] Hơi lác xíu làm j căng' }
            else if (ping > 50 && ping <= 100) { pingbar = '[■■■□□□] Lag vl, mạng nhà thg host sao thế ??' }
            else if (ping > 100 && ping <= 250) { pingbar = '[■■■■□□ Anh host à, anh đang xem sếch à' }
            else if (ping > 250 && ping <= 500) { pingbar = '[■■■■■□] Ờ, giảm tiền lương thg host.' }
            else if (ping > 500 && ping <= 1000) { pingbar = '[■■■■■■] Chậm đếy, nhưng có chậm như cách cờ rút rep tin nhắn mày ko' }
            else if (ping > 1000) { pingbar = '[❗❗❗] Ối giồi ôi! LAG QUÁ' }

            var wspingbar = ' '
            if (wsping <= 25) { wspingbar = '[■□□□□□] Dảk quá pepsi ơi' }
            else if (wsping > 25 && wsping <= 50) { wspingbar = '[■■□□□□] Hơi lác xíu làm j căng' }
            else if (wsping > 50 && wsping <= 100) { wspingbar = '[■■■□□□] Lag vl, anh api ơi, sao thế ??' }
            else if (wsping > 100 && wsping <= 250) { wspingbar = '[■■■■□□] Anh API à, bớt xem sếch đi' }
            else if (wsping > 250 && wsping <= 500) { wspingbar = '[■■■■■□] Ờ, giảm tiền lương anh API đêy.' }
            else if (wsping > 500 && wsping <= 1000) { pingbar = '[■■■■■■] Chậm đếy, nhưng có chậm như cách cờ rút rep tin nhắn mày ko' }
            else if (wsping > 1000) { wspingbar = '[❗❗❗] Ối giồi ôi! LAG QUÁ' }
            
            m.delete()

            const embed = new MessageEmbed()
                .setTitle(`Bot's Ping`)
                .setAuthor({ name: `${client.user.tag}`, iconURL: client.user.displayAvatarURL() })
                .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                .addFields({
                    name: `> Ping của ${client.user.tag}: ${ping}ms`,
                    value: `${pingbar}`,
                },
                    {
                        name: `> Ping của WS: ${client.ws.ping}ms`,
                        value: `${wspingbar}`,
                    })
                .setColor('#029202')
                .setFooter({ text: `${interaction.user.tag} • ${interaction.guild.name}`, iconURL: `${interaction.user.displayAvatarURL()}` })
                .setTimestamp()
            interaction.reply({ embeds: [embed] })
        })
    }
} 