const { MessageReaction, User, MessageEmbed } = require('discord.js')
    , minecraft = require('minecraft-server-util')
    , db = require('../models/option')

module.exports = {
    name: 'messageReactionAdd',
    /**
     * 
     * @param {MessageReaction} reaction 
     * @param {User} user 
     */
    async run(reaction, user) {
        let data = await db.findOne({ guildid: reaction.message.guildId })
        if (!data) return
        if (!data.config.message.status || data.config.message.status !== reaction.message.id) return
        reaction.users.remove(user.id)
        const embed = new MessageEmbed()
            .setTitle('Minecraft Sever Info')
            .setFooter({ text: `Cập nhật lần cuối vào cuối`, iconURL: `${reaction.message.guild.iconURL()}` })
            .setTimestamp()
            , now = Date.now()
        await minecraft.status('2y2c.org', 25565).then((response) => {
            let sample
            if (!response.players.sample || response.players.sample.length == 0) sample = 'null'
            else if (response.players.sample && response.players.sample.length != 0) sample = response.players.sample
            embed
                .setColor('RANDOM')
                .addFields({
                    name: 'Status',
                    value: '🟢 Online',
                    inline: true
                },
                    {
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
                        inline: true
                    },
                    {
                        name: 'Sample player',
                        value: `${sample}`,
                        inline: true
                    },
                    {
                        name: 'Ping',
                        value: `${Date.now() - now}ms`,
                        inline: true
                    },
                    {
                        name: 'Online Player',
                        value: `${response.players.online}/${response.players.max}`,
                        inline: true
                    },
                    {
                        name: 'Version',
                        value: `${response.version.name.replace("§1", "")}`,
                        inline: true
                    })
                .setThumbnail(`https://eu.mc-api.net/v3/server/favicon/${response.srvRecord.host}`)
                .setColor('GREEN')
        })
            .catch((error) => {
                embed
                    .setColor('RED')
                    .setThumbnail('https://cdn.discordapp.com/attachments/936994104884224020/956369715192795246/2Q.png')
                    .addFields({
                        name: 'Status',
                        value: '🔴 Offline',
                        inline: false
                    },
                        {
                            name: 'Error',
                            value: '```' + error + '```',
                            inline: false
                        })
            })
        reaction.message.edit({
            embeds: [embed]
        })
    }
}