const { CommandInteraction, MessageEmbed, version } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const os = require('os')
const botversion = require('../package.json').version

module.exports = {
    data: new SlashCommandBuilder()
        .setName('botinfo')
        .setDescription('Info về bot'),
    /**
    * 
    * @param {CommandInteraction} interaction 
    */
    run: async (interaction) => {
        const client = interaction.client
        const ping = Date.now() - interaction.createdTimestamp;
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
                    value: `<t:${Math.floor(client.user.createdTimestamp / 1000)}:F>`,
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
            .setFooter({ text: `${interaction.user.tag} • ${interaction.guild.name}`, iconURL: `${interaction.user.displayAvatarURL()}` })
            .setTimestamp()
        await interaction.editReply({ embeds: [embed] })
    }
} 