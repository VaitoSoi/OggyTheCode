const { CommandInteraction, version, MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const os = require('os')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('botinfo')
        .setDescription('Thông tin về bot'),
    /**
    * 
    * @param {CommandInteraction} interaction 
    */
    run: async (interaction) => {
        const client = interaction.client
        const package = require('../../../package.json')
        const message = await interaction.followUp({
            embeds: [
                new MessageEmbed()
                    .setDescription('Checking...')
                    .setColor('YELLOW')
            ]
        })
        let now = Date.now()
        let dbping = 0
        const data = require('../../../models/ping').find()
        await data;
        dbping = Date.now() - now
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
                text: `${interaction.user.tag} • ${interaction.guild.name}`,
                iconURL: interaction.user.displayAvatarURL()
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
                    value: `[Invite Link](https://oggy-bot-1.onrender.com/invite?id${client.user.id})`,
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
                    value: `${await rate(message.createdTimestamp - interaction.createdTimestamp)}`,
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
                    value: `${package.dependencies.mineflayer.replace('^', '')}`,
                    inline: true
                },
                {
                    name: '**Discord.JS**',
                    value: `${version}`,
                    inline: true
                },
                {
                    name: '**NodeJS**',
                    value: `${process.version}`,
                    inline: true
                })
        message.edit({
            embeds: [clientembed]
        })
    }
}