const { CommandInteraction, MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('highway')
        .setDescription('Kiểm tra tiến độ làm Highway trong server 2y2c.org'),
    /**
    * 
    * @param {CommandInteraction} interaction 
    */
    run: async (interaction) => {
        if (interaction.deferred === false) await interaction.deferReply()
        const client = interaction.client

        const highway = require('../models/highway')
        highway.findOne({ which: 'straight' }, async (err, data) => {
            if (err) throw err;
            if (!data) {
                interaction.editReply('Đang khởi tạo dữ liệu Highway')
                data = new highway({
                    what: 'straight',
                    xplus: '0',
                    xminus: '0',
                    zplus: '0',
                    zminus: '0',
                })
                data.save()
                interaction.channel.send('Đã khởi tạo dữ liệu Highway');
                interaction.channel.send('Vui lòng thử lại lệnh. Nếu vẫn xuất hiện thông báo khởi tạo dữ liệu. Vui lòng báo cho VaitoSoi#2220')
            } else {
                const xplus = data.xplus
                    , processxplus = xplus / 3750 * 100
                    , xminus = data.xminus
                    , processxminus = xminus / 250 * 100
                    , zplus = data.zplus
                    , processzplus = zplus / 250 * 100
                    , zminus = data.zminus
                    , processzminus = zminus / 250 * 100
                    , allprocesspercent = (processxminus + processzplus + processzminus + processxplus) / 4
                    , allprocesspercent2 = allprocesspercent.toFixed(2)
                var processbarxplus = ''
                /**/ if (processxplus <= 0) { processbarxplus = ' [□□□□□□□□□□□]\n> Dự án chưa được khởi công.' }
                else if (processxplus >= 1 && processxplus < 10) { processbarxplus = ' [■□□□□□□□□□□]' }
                else if (processxplus >= 10 && processxplus < 20) { processbarxplus = ' [■■□□□□□□□□□]' }
                else if (processxplus >= 20 && processxplus < 30) { processbarxplus = ' [■■■□□□□□□□□]' }
                else if (processxplus >= 30 && processxplus < 40) { processbarxplus = ' [■■■■□□□□□□□]' }
                else if (processxplus >= 40 && processxplus < 50) { processbarxplus = ' [■■■■■□□□□□□]' }
                else if (processxplus >= 50 && processxplus < 60) { processbarxplus = ' [■■■■■■□□□□□]' }
                else if (processxplus >= 60 && processxplus < 70) { processbarxplus = ' [■■■■■■■□□□□]' }
                else if (processxplus >= 70 && processxplus < 80) { processbarxplus = ' [■■■■■■■■□□□]' }
                else if (processxplus >= 80 && processxplus < 90) { processbarxplus = ' [■■■■■■■■■□□]' }
                else if (processxplus >= 90 && processxplus < 100) { processbarxplus = ' [■■■■■■■■■■□]' }
                else if (processxplus >= 100) { processbarxplus = '[■■■■■■■■■■■]\n> Dự án đã hoàn thành.' }
                var processbarxminus = ''
                /**/ if (processxminus <= 0) { processbarxminus = ' [□□□□□□□□□□□]\n> Dự án chưa được khởi công.' }
                else if (processxminus >= 1 && processxminus < 10) { processbarxminus = ' [■□□□□□□□□□□]' }
                else if (processxminus >= 10 && processxminus < 20) { processbarxminus = ' [■■□□□□□□□□□]' }
                else if (processxminus >= 20 && processxminus < 30) { processbarxminus = ' [■■■□□□□□□□□]' }
                else if (processxminus >= 30 && processxminus < 40) { processbarxminus = ' [■■■■□□□□□□□]' }
                else if (processxminus >= 40 && processxminus < 50) { processbarxminus = ' [■■■■■□□□□□□]' }
                else if (processxminus >= 50 && processxminus < 60) { processbarxminus = ' [■■■■■■□□□□□]' }
                else if (processxminus >= 60 && processxminus < 70) { processbarxminus = ' [■■■■■■■□□□□]' }
                else if (processxminus >= 70 && processxminus < 80) { processbarxminus = ' [■■■■■■■■□□□]' }
                else if (processxminus >= 80 && processxminus < 90) { processbarxminus = ' [■■■■■■■■■□□]' }
                else if (processxminus >= 90 && processxminus < 100) { processbarxminus = ' [■■■■■■■■■■□]' }
                else if (processxminus >= 100) { processbarxminus = '[■■■■■■■■■■■]\n> Dự án đã hoàn thành.' }
                var processbarzplus = ''
                /**/ if (processzplus <= 0) { processbarzplus = ' [□□□□□□□□□□□]\n> Dự án chưa được khởi công.' }
                else if (processzplus >= 1 && processzminus < 10) { processbarzplus = ' [■□□□□□□□□□□]' }
                else if (processzplus >= 10 && processzplus < 20) { processbarzplus = ' [■■□□□□□□□□□]' }
                else if (processzplus >= 20 && processzplus < 30) { processbarzplus = ' [■■■□□□□□□□□]' }
                else if (processzplus >= 30 && processzplus < 40) { processbarzplus = ' [■■■■□□□□□□□]' }
                else if (processzplus >= 40 && processzplus < 50) { processbarzplus = ' [■■■■■□□□□□□]' }
                else if (processzplus >= 50 && processzplus < 60) { processbarzplus = ' [■■■■■■□□□□□]' }
                else if (processzplus >= 60 && processzplus < 70) { processbarzplus = ' [■■■■■■■□□□□]' }
                else if (processzplus >= 70 && processzplus < 80) { processbarzplus = ' [■■■■■■■■□□□]' }
                else if (processzplus >= 80 && processzplus < 90) { processbarzplus = ' [■■■■■■■■■□□]' }
                else if (processzplus >= 90 && processzplus < 100) { processbarzplus = ' [■■■■■■■■■■□]' }
                else if (processzplus >= 100) { processbarzplus = '[■■■■■■■■■■■]\n> Dự án đã hoàn thành.' }
                var processbarzminus = ''
                /**/ if (processzminus <= 0) { processbarzminus = ' [□□□□□□□□□□□]\n> Dự án chưa được khởi công.' }
                else if (processzminus >= 1 && processzminus < 10) { processbarzminus = ' [■□□□□□□□□□□]' }
                else if (processzminus >= 10 && processzminus < 20) { processbarzminus = ' [■■□□□□□□□□□]' }
                else if (processzminus >= 20 && processzminus < 30) { processbarzminus = ' [■■■□□□□□□□□]' }
                else if (processzminus >= 30 && processzminus < 40) { processbarzminus = ' [■■■■□□□□□□□]' }
                else if (processzminus >= 40 && processzminus < 50) { processbarzminus = ' [■■■■■□□□□□□]' }
                else if (processzminus >= 50 && processzminus < 60) { processbarzminus = ' [■■■■■■□□□□□]' }
                else if (processzminus >= 60 && processzminus < 70) { processbarzminus = ' [■■■■■■■□□□□]' }
                else if (processzminus >= 70 && processzminus < 80) { processbarzminus = ' [■■■■■■■■□□□]' }
                else if (processzminus >= 80 && processzminus < 90) { processbarzminus = ' [■■■■■■■■■□□]' }
                else if (processzminus >= 90 && processzminus < 100) { processbarzminus = ' [■■■■■■■■■■□]' }
                else if (processzminus >= 100) { processbarzminus = '[■■■■■■■■■■■]\n> Dự án đã hoàn thành.' }
                var sumbarprogress = ''
                switch (true) {
                    case allprocesspercent < 3.225:
                        sumbarprogress = '[□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□]'
                        break;
                    case allprocesspercent >= 3.225 && allprocesspercent < 6.45:
                        sumbarprogress = '[■□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□]'
                        break;
                    case allprocesspercent >= 6.45 && allprocesspercent < 9.67:
                        sumbarprogress = '[■■□□□□□□□□□□□□□□□□□□□□□□□□□□□□□]'
                        break;
                    case allprocesspercent >= 9.67 && allprocesspercent < 12.89:
                        sumbarprogress = '[■■■□□□□□□□□□□□□□□□□□□□□□□□□□□□□]'
                        break;
                    case allprocesspercent >= 12.89 && allprocesspercent < 16.11:
                        sumbarprogress = '[■■■■□□□□□□□□□□□□□□□□□□□□□□□□□□□]'
                        break;
                    case allprocesspercent >= 16.11 && allprocesspercent < 19.33:
                        sumbarprogress = '[■■■■■□□□□□□□□□□□□□□□□□□□□□□□□□□]'
                        break;
                    case allprocesspercent >= 19.33 && allprocesspercent < 22.55:
                        sumbarprogress = '[■■■■■■□□□□□□□□□□□□□□□□□□□□□□□□□]'
                        break;
                    case allprocesspercent >= 22.55 && allprocesspercent < 25.77:
                        sumbarprogress = '[■■■■■■■□□□□□□□□□□□□□□□□□□□□□□□□]'
                        break;
                    case allprocesspercent >= 25.77 && allprocesspercent < 28.99:
                        sumbarprogress = '[■■■■■■■■□□□□□□□□□□□□□□□□□□□□□□□]'
                        break;
                    case allprocesspercent >= 28.99 && allprocesspercent < 32.21:
                        sumbarprogress = '[■■■■■■■■■□□□□□□□□□□□□□□□□□□□□□□]'
                        break;
                    case allprocesspercent >= 32.21 && allprocesspercent < 35.43:
                        sumbarprogress = '[■■■■■■■■■■□□□□□□□□□□□□□□□□□□□□□]'
                        break;
                    case allprocesspercent >= 35.43 && allprocesspercent < 38.65:
                        sumbarprogress = '[■■■■■■■■■■■□□□□□□□□□□□□□□□□□□□□]'
                        break;
                    case allprocesspercent >= 38.65 && allprocesspercent < 41.87:
                        sumbarprogress = '[■■■■■■■■■■■■□□□□□□□□□□□□□□□□□□□]'
                        break;
                    case allprocesspercent >= 41.87 && allprocesspercent < 45.09:
                        sumbarprogress = '[■■■■■■■■■■■■■□□□□□□□□□□□□□□□□□□]'
                        break;
                    case allprocesspercent >= 45.09 && allprocesspercent < 48.31:
                        sumbarprogress = '[■■■■■■■■■■■■■■□□□□□□□□□□□□□□□□□]'
                        break;
                    case allprocesspercent >= 48.31 && allprocesspercent < 51.53:
                        sumbarprogress = '[■■■■■■■■■■■■■■■□□□□□□□□□□□□□□□□]'
                        break;
                    case allprocesspercent >= 51.53 && allprocesspercent < 54.75:
                        sumbarprogress = '[■■■■■■■■■■■■■■■■□□□□□□□□□□□□□□□]'
                        break;
                    case allprocesspercent >= 54.75 && allprocesspercent < 57.97:
                        sumbarprogress = '[■■■■■■■■■■■■■■■■■□□□□□□□□□□□□□□]'
                        break;
                    case allprocesspercent >= 57.97 && allprocesspercent < 61.19:
                        sumbarprogress = '[■■■■■■■■■■■■■■■■■■□□□□□□□□□□□□□]'
                        break;
                    case allprocesspercent >= 61.19 && allprocesspercent < 64.41:
                        sumbarprogress = '[■■■■■■■■■■■■■■■■■■■□□□□□□□□□□□□□]'
                        break;
                    case allprocesspercent >= 64.41 && allprocesspercent < 67.63:
                        sumbarprogress = '[■■■■■■■■■■■■■■■■■■■■□□□□□□□□□□□]'
                        break;
                    case allprocesspercent >= 67.63 && allprocesspercent < 70.85:
                        sumbarprogress = '[■■■■■■■■■■■■■■■■■■■■■□□□□□□□□□□]'
                        break;
                    case allprocesspercent >= 70.85 && allprocesspercent < 74.07:
                        sumbarprogress = '[■■■■■■■■■■■■■■■■■■■■■■□□□□□□□□□]'
                        break;
                    case allprocesspercent >= 74.07 && allprocesspercent < 77.29:
                        sumbarprogress = '[■■■■■■■■■■■■■■■■■■■■■■■□□□□□□□□]'
                        break;
                    case allprocesspercent >= 77.29 && allprocesspercent < 80.51:
                        sumbarprogress = '[■■■■■■■■■■■■■■■■■■■■■■■■□□□□□□□]'
                        break;
                    case allprocesspercent >= 80.51 && allprocesspercent < 83.73:
                        sumbarprogress = '[■■■■■■■■■■■■■■■■■■■■■■■■■□□□□□□]'
                        break;
                    case allprocesspercent >= 83.73 && allprocesspercent < 86.95:
                        sumbarprogress = '[■■■■■■■■■■■■■■■■■■■■■■■■■■□□□□□]'
                        break;
                    case allprocesspercent >= 86.95 && allprocesspercent < 90.17:
                        sumbarprogress = '[■■■■■■■■■■■■■■■■■■■■■■■■■■■□□□□]'
                        break;
                    case allprocesspercent >= 90.17 && allprocesspercent < 93.39:
                        sumbarprogress = '[■■■■■■■■■■■■■■■■■■■■■■■■■■■■□□□]'
                        break;
                    case allprocesspercent >= 93.39 && allprocesspercent < 96.61:
                        sumbarprogress = '[■■■■■■■■■■■■■■■■■■■■■■■■■■■■■□□]'
                        break;
                    case allprocesspercent >= 96.61 && allprocesspercent < 100:
                        sumbarprogress = '[■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■□]'
                        break;
                    case allprocesspercent >= 100:
                        sumbarprogress = '[■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■]'
                        break;
                }

                const date = new Date()
                const embed = new MessageEmbed()
                    .setTitle('**Tiến trình của đường cao tốc tại Nether**')
                    .setThumbnail('https://cdn.discordapp.com/attachments/862724367276179486/880370583043461120/My_Video.gif')
                    .setAuthor({ name: `${client.user.tag}`, iconURL: client.user.displayAvatarURL() })
                    .addFields({
                        name: 'Reach to World Border',
                        value: 'Dự án được thực hiện trong nether\nXây cao tốc X+ kéo dài tới 30 triệu blocks overworld (3.75m nether)\nVà các cao tốc còn lại thì đến 250k',
                        inline: false
                    },
                        {
                            name: 'Đường cao tốc hướng X+',
                            value: `> ${data.xplus}k/3750k ~ ${processxplus.toFixed(2)}%\n> ${processbarxplus}`,
                            inline: true
                        },
                        {
                            name: 'Đường cao tốc hướng X-',
                            value: `> ${data.xminus}k/250k ~ ${processxminus.toFixed(2)}%\n> ${processbarxminus}`,
                            inline: true
                        },
                        {
                            name: 'Tổng tiến độ của dự án Highway',
                            value: `${allprocesspercent2}%\n${sumbarprogress}`,
                            inline: false
                        },
                        {
                            name: 'Đường cao tốc hướng Z+',
                            value: `> ${data.zplus}k/250k ~ ${processzplus.toFixed(2)}%\n> ${processbarzplus}`,
                            inline: true
                        },
                        {
                            name: 'Đường cao tốc hướng Z-',
                            value: `> ${data.zminus}k/250k ~ ${processzminus.toFixed(2)}%\n> ${processbarzminus}`,
                            inline: true
                        })
                    .setColor('#029202')
                    .setFooter({ text: `${interaction.user.tag} • ${interaction.guild.name}`, iconURL: `${interaction.user.displayAvatarURL()}` })
                    .setTimestamp()
                interaction.editReply({ embeds: [embed] })
            }
        })
    }
} 