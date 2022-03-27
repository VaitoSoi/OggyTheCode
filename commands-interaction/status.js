const { CommandInteraction, MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Hiện status của 1 server minecraft')
        .addStringOption(option => option
            .setName('server')
            .setDescription('Server muốn kiểm tra status.')
            .setRequired(true)
        )
        .addNumberOption(option => option
            .setName('port')
            .setDescription('Port (cổng) server muốn kiểm tra')
        ),
    /**
    * 
    * @param {CommandInteraction} interaction 
    */
    run: async (interaction) => {
        const client = interaction.client
        const minecraft = require('minecraft-server-util')
        const ip = interaction.options.getString('server')
        let port = Number(interaction.options.getNumber('port'))
        if (!port) port = 25565

        const embed = new MessageEmbed()
            .setTitle('Minecraft Sever Info')
            .setFooter({ text: `${interaction.user.tag} • ${interaction.guild.name}`, iconURL: `${interaction.user.displayAvatarURL()}` })
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
                .setThumbnail(interaction.guild.iconURL())
        })
            .catch((error) => {
                embed
                    .setColor('RED')
                    .setThumbnail('https://cdn.discordapp.com/attachments/936994104884224020/956369715192795246/2Q.png')
                    .setDescription('🛑 | Phát hiện lỗi khi tìm server: `' + ip + '`\n ```' + error + '```\nCách khác phục:\n> Kiểm tra lại IP.\n> Kiểm tra lại Port')
            })
        interaction.reply({ embeds: [embed] })
    }
} 