const { Client, Message, MessageEmbed, version } = require('discord.js')
const os = require('os')

module.exports = {
    name: 'botinfo',
    description: 'Hiện thông tin về bot',
    usage: '',
    /**
    * 
    * @param {Client} client 
    * @param {Message} message 
    * @param {String[]} args 
    */
    run: async (client, message, args) => {
        const package = require('../../../package.json')
        const msg = await message.reply({
            embeds: [
                new MessageEmbed()
                    .setDescription('Checking...')
                    .setColor('YELLOW')
            ]
        })
        let now = Date.now()
        await require('../../../models/ping').find()
        let dbping = Date.now() - now
        async function rate(num) {
            let str = ''
            if (num >= 0 && num <= 250) str = '🟢'
            else if (num > 250 && num <= 500) str = '🟡'
            else if (num > 500 && num <= 1000) str = '🟠'
            else if (num > 1000) str = '🔴'
            return str + ' ' + num + 'ms'
        }
        const cpus = os.cpus()
        const cpu = cpus[0]
        const clientembed = new MessageEmbed()
            .setAuthor({
                name: `${client.user.tag} Info`,
                iconURL: client.user.displayAvatarURL()
            })
            .setColor('RANDOM')
            .setFooter({
                text: `${message.author.tag} • ${message.guild.name}`,
                iconURL: message.author.displayAvatarURL()
            })
            .setTimestamp()
            .addFields({
                name: '> BOT CLIENT',
                value: 'Thông tin về bot',
                inline: false
            },
                {
                    name: '**Bot\'s Tag**',
                    value: `${client.user.tag}`,
                    inline: true,
                },
                {
                    name: '**Bot\'s ID**',
                    value: `${client.user.id}`,
                    inline: true,
                },
                {
                    name: '**Bot\'s Invite Link**',
                    value: `[Invite Link](https://discord.com/oauth2/authorize?client_id=${client.user.id}1&permissions=93264&scope=bot+applications.commands&utm_source=https://discord.com)`,
                    inline: true
                },
                {
                    name: '**Bot\'s Birthday**',
                    value: `<t:${Math.floor(client.user.createdTimestamp / 1000)}:F>`,
                    inline: false
                },
                {
                    name: '> BOT PING',
                    value: 'Ping của bot, api và database',
                    inline: false
                },
                {
                    name: '**Bot Ping**',
                    value: `${await rate(msg.createdTimestamp - message.createdTimestamp)}`,
                    inline: true
                },
                {
                    name: '**WS Ping**',
                    value: `${await rate(client.ws.ping)}`,
                    inline: true
                },
                {
                    name: '**Mongoose Ping**',
                    value: `${await rate(dbping)}`,
                    inline: true
                },
                {
                    name: '> BOT SIZE',
                    value: 'Số guilds, channels, users mà bot có',
                    inline: false
                },
                {
                    name: '**Guilds**',
                    value: `${client.guilds.cache.size} guilds`,
                    inline: true
                },
                {
                    name: '**Channels**',
                    value: `${client.channels.cache.size} channels`,
                    inline: true
                },
                {
                    name: '**Users**',
                    value: `${client.users.cache.size} users`,
                    inline: true
                },
                {
                    name: '> HOST INFO',
                    value: 'Các thông tin về máy chủ của bot',
                    inline: false
                },
                {
                    name: '**CPU Model**',
                    value: `${cpu.model}`,
                    inline: false
                },
                {
                    name: '**CPU Speed**',
                    value: `${cpu.speed} MHz`,
                    inline: true
                },
                {
                    name: '**Number of CPU Core**',
                    value: `${cpus.length} cores`,
                    inline: true
                },
                {
                    name: '**Memory**',
                    value: `${((os.totalmem / 1024 / 1024) - (os.freemem() / 1024 / 1024)).toFixed(0)}/${(os.totalmem / 1024 / 1024).toFixed(0)}MB`,
                    inline: true
                },
                {
                    name: '**Operating System**',
                    value: `${os.version()} ${os.arch()}`,
                    inline: false
                },
                {
                    name: '> MAIN LIBRARY',
                    value: 'Tên và phiên bản của các thư viện chính',
                    inline: false
                },
                {
                    name: '**Mineflayer**',
                    value: `${package.dependencies.mineflayer.replace('^', 'v')}`,
                    inline: true
                },
                {
                    name: '**Discord.JS**',
                    value: `v${version}`,
                    inline: true
                },
                {
                    name: '**NodeJS**',
                    value: `${process.version}`,
                    inline: true
                })
        msg.edit({
            embeds: [clientembed]
        })
    }
} 