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
        try {
            const client = reaction.message.guild.members.cache.get(process.env.ID_1)
                , client2 = reaction.message.guild.me.user.id
            if (client && client2 === process.env.ID_2) return
        } catch (e) {

        }
        let data = await db.findOne({ guildid: reaction.message.guildId })
        if (!data) return
        if (!data.config.message.status || data.config.message.status !== reaction.message.id || user.id === reaction.client.user.id) return
        reaction.users.remove(user.id)
        reaction.message.edit({
            embeds: [
                new MessageEmbed()
                    .setTitle('⏳ | Đang tải...')
                    .setColor('NOT_QUITE_BLACK')
            ]
        })
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
        if ((await reaction.message.fetch()).author.id === reaction.client.user.id) reaction.message.edit({
            embeds: [embed]
        })
        else {
            if (reaction.message.deletable) {
                reaction.message.delete()
                reaction.message.channel.send({
                    embeds: [embed]
                }).then(async (m) => {
                    m.react('🔁')
                    try {
                        await db.findOneAndUpdate({
                            guildid: reaction.message.guildId
                        }, {
                            $set: {
                                'data.config.message.status': m.id
                            }
                        })
                    } catch (error) {
                        console.log(error)
                    }
                })
            } else reaction.message.reply({
                embeds: [embed]
            }).then((m) => setTimeout(() => {
                m.delete()
            }, 5000))
        }
    }
}