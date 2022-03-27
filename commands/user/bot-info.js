const { MessageEmbed, version, Message, Client, MessageActionRow, MessageButton } = require('discord.js');
const os = require('os');
const ms = require('ms');
const botversion = require('../../package.json').version

module.exports = {
    name: 'bot-info',
    category: 'user',
    aliases: ['info', 'botinfo', 'bi'],
    description: 'Xem thông tin về bot',
    category: 'bot-info',
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {*} args 
     */
    run: async (client, message, args) => {
        const mrow = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('')
            )
        message.reply('Checking...').then(async m => {
            const ping = m.createdTimestamp - message.createdTimestamp;
            const wsping = client.ws.ping
            var pingbar = ''
            if (ping <= 25) { pingbar = '[■□□□□□] Nhanh' }
            if (ping > 25 && ping <= 50) { pingbar = '[■■□□□□] Ổn định' }
            if (ping > 50 && ping <= 100) { pingbar = '[■■■□□□] Trung bình' }
            if (ping > 100 && ping <= 250) { pingbar = '[■■■■□□ Lag nhẹ' }
            if (ping > 250 && ping <= 500) { pingbar = '[■■■■■□] Lag nặng' }
            if (ping > 500 && ping < 1000) { pingbar = '[■■■■■■] Lag báo động' }
            if (ping >= 1000) { pingbar = '[❗❗❗❗❗] Mất ổn định' }
            var wspingbar = ''
            if (wsping <= 25) { wspingbar = '[■□□□□□] Nhanh' }
            if (wsping > 25 && wsping <= 50) { wspingbar = '[■■□□□□] Ổn định' }
            if (wsping > 50 && wsping <= 100) { wspingbar = '[■■■□□□] Trung bình' }
            if (wsping > 100 && wsping <= 250) { wspingbar = '[■■■■□□] Lag nhẹ' }
            if (wsping > 250 && wsping <= 500) { wspingbar = '[■■■■■□] Lag nặng' }
            if (wsping > 500 && wsping < 1000) { wspingbar = '[■■■■■■] Lag báo động' }
            if (wsping >= 1000) { wspingbar = '[❗❗❗❗❗] Mất ổn định' }
            var mbtotalmem = (os.totalmem / 1024 / 1024).toFixed(0)
            var mbfreemem = (os.freemem / 1024 / 1024).toFixed(0)
            var cpus = os.cpus()
            var cpu = cpus[1]
            m.delete()
            const embed = new MessageEmbed()
                .setColor('RANDOM')
                .setAuthor({ name: `Thông tin về ${client.user.username}`, iconURL: client.user.displayAvatarURL() })
                .addFields({
                    name: '> **BOT CLIENT INFO**',
                    value: 'Thông tin về Bot',
                    inline: false
                },
                    {
                        name: "Bot's Tag",
                        value: `${client.user.tag}`,
                        inline: true
                    },
                    {
                        name: "Bot's ID",
                        value: `${client.user.id}`,
                        inline: true
                    },
                    {
                        name: "Bot's Birthday",
                        value: `${client.user.createdAt}`,
                        inline: false
                    },
                    {
                        name: '> **HOST INFO**',
                        value: 'Thông tin về host của bot',
                        inline: false,
                    },
                    {
                        name: 'Operating System',
                        value: `${os.version()} ${os.arch()}`,
                        inline: false
                    },
                    {
                        name: 'CPU Model',
                        value: `${cpu.model}`,
                        inline: false
                    },
                    {
                        name: 'Speed',
                        value: `${cpu.speed} MHz`,
                        inline: true
                    },
                    {
                        name: 'Memory',
                        value: `${(mbtotalmem - mbfreemem).toFixed(0)}/${(os.totalmem / 1024 / 1024).toFixed(0)}MB`,
                        inline: true
                    },
                    {
                        name: '> **BOT & API PING**',
                        value: 'Ping của bot và API.',
                        inline: false
                    },
                    {
                        name: "Bot's Ping",
                        value: `${ping}ms | ${pingbar}`,
                        inline: true,
                    },
                    {
                        name: "WS's Ping",
                        value: `${wsping}ms | ${wspingbar}`,
                        inline: true
                    },
                    {
                        name: '> **BOT SIZE**',
                        value: 'Thông tin về số sever, member, channel',
                        inline: false
                    },
                    {
                        name: 'Severs',
                        value: `${client.guilds.cache.size} sever(s)`,
                        inline: true
                    },
                    {
                        name: 'Channels',
                        value: `${client.channels.cache.size} channel(s)`,
                        inline: true
                    },
                    {
                        name: 'Members',
                        value: `${client.users.cache.size} member(s)`,
                        inline: true
                    },
                    {
                        name: '> **MAIN LIBRARIES**',
                        value: 'Các thư viện chính và phiên bản',
                        inline: false,
                    },
                    {
                        name: "Bot's Version",
                        value: `${botversion}`,
                        inline: true
                    },
                    {
                        name: 'Node.JS',
                        value: `${process.version}`,
                        inline: true
                    },
                    {
                        name: 'Discord.JS',
                        value: `${version}`,
                        inline: true
                    })
                .setFooter({ text: `${message.author.tag} • ${message.guild.name}`, iconURL: `${message.author.displayAvatarURL()}` })
                .setTimestamp()
            await message.reply({ embeds: [embed] })

            const clientembed = new MessageEmbed()
                .setAuthor({
                    name: `Thông tin về Client của ${client.user.username}`,
                    iconURL: client.user.displayAvatarURL()
                })
                .setFooter({
                    text: `${message.author.tag} • ${message.guild.name}`,
                    iconURL: message.author.displayAvatarURL()
                })
                .setColor('RANDOM')
                .addFields({
                    name: '> **CLIENT INFO**',
                    value: 'Thông tin về Bot',
                    inline: false
                },
                    {
                        name: 'Bot Tag',
                        value: `${client.user.tag}`,
                        inline: true
                    },
                    {
                        name: 'Bot ID',
                        value: `${client.user.id}`,
                        inline: true
                    },
                    {
                        name: '\u200b',
                        value: '\u200b',
                        inline: true
                    },
                    {
                        name: 'Bot Avatar',
                        value: `[URL](${client.user.avatarURL()})`,
                        inline: true
                    },
                    {
                        name: 'Bot Uptime',
                        value: `${ms(client.uptime)}`,
                        inline: true
                    },
                    {
                        name: 'Bot Ready',
                        value: `Vào lúc: <t:${Math.floor(client.readyTimestamp/1000)}:F>`,
                        inline: false
                    },
                    {
                        name: 'Bot Birthday',
                        value: `<t:${Math.floor(client.user.createdTimestamp/1000)}:F>`,
                        inline: false
                    },
                    {
                        name: '> **BOT SIZE**',
                        value: 'Thông tin về số guilds, channels, users, emojis,...',
                        inline: false
                    },
                    {
                        name: 'Guilds',
                        value: `${client.guilds.cache.size}`,
                        inline: true
                    },
                    {
                        name: 'Channels',
                        value: `${client.channels.cache.size}`,
                        inline: true
                    },
                    {
                        name: 'Users',
                        value: `${client.users.cache.size}`,
                        inline: true
                    },
                    {
                        name: '> **BOT PING**',
                        value: 'Ping của bot và WS',
                        inline: false
                    },
                    {
                        name: 'Bot Ping',
                        value: `${ping}ms | ${pingbar}`,
                        inline: true
                    },
                    {
                        name: 'WS Ping',
                        value: `${wsping}ms | ${wspingbar}`,
                        inline: true
                    })
            if(args[0] === 'client') return message.channel.send({
                embeds: [clientembed]
            })
            const hostembed = new MessageEmbed()
                .setAuthor({
                    name: ``
                })
        })
    },
}