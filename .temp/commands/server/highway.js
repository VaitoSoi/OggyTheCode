const { MessageEmbed, Message } = require('discord.js')
const highway = require('../../models/highway')

module.exports = {
    name: 'highway',
    aliases: ['process', '2w', '2way'],
    description: 'Thông tin tiến độ của đường cao tốc',
    /** 
     * @param { Message } message 
     */
    run: async (client, message, args) => {

        highway.findOne({ which: 'straight' }, async (err, data) => {
            if (err) throw err;
            if (!data) {
                message.channel.send('Đang khởi tạo dữ liệu Highway')
                data = new highway({
                    what: 'straight',
                    xplus: '0',
                    xminus: '0',
                    zplus: '0',
                    zminus: '0',
                })
                data.save()
                message.channel.send('Đã khởi tạo dữ liệu Highway');
                message.channel.send('Vui lòng thử lại lệnh. Nếu vẫn xuất hiện thông báo khởi tạo dữ liệu. Vui lòng báo cho VaitoSoi#2220')
            } else {
                const xplus = data.xplus
                const processxplus = xplus / 3750 * 100
                const xminus = data.xminus
                const processxminus = xminus / 250 * 100
                const zplus = data.zplus
                const processzplus = zplus / 250 * 100
                const zminus = data.zminus
                const processzminus = zminus / 250 * 100
                const all = xplus + xminus + zplus + zminus
                const allprocesspercent = (processxminus + processzplus + processzminus + processxplus) / 4
                const allprocesspercent2 = allprocesspercent.toFixed(2)

                var processbarxplus = ''
                if (processxplus <= 0) { processbarxplus = ' [□□□□□□□□□□□] Dự án chưa được khởi công.' }
                if (processxplus >= 1 && processxplus < 10) { processbarxplus = ' [■□□□□□□□□□□]' }
                if (processxplus >= 10 && processxplus < 20) { processbarxplus = ' [■■□□□□□□□□□]' }
                if (processxplus >= 20 && processxplus < 30) { processbarxplus = ' [■■■□□□□□□□□]' }
                if (processxplus >= 30 && processxplus < 40) { processbarxplus = ' [■■■■□□□□□□□]' }
                if (processxplus >= 50 && processxplus < 60) { processbarxplus = ' [■■■■■□□□□□□]' }
                if (processxplus >= 60 && processxplus < 70) { processbarxplus = ' [■■■■■■□□□□□]' }
                if (processxplus >= 70 && processxplus < 80) { processbarxplus = ' [■■■■■■■□□□□]' }
                if (processxplus >= 80 && processxplus < 90) { processbarxplus = ' [■■■■■■■■■□□]' }
                if (processxplus >= 90 && processxplus < 100) { processbarxplus = ' [■■■■■■■■■■□]' }
                if (processxplus >= 100) { processbarxplus = '[■■■■■■■■■■■] Dự án đã hoàng thành.' }
                var processbarxminus = ''
                if (processxminus <= 0) { processbarxminus = ' [□□□□□□□□□□□] Dự án chưa được khởi công.' }
                if (processxminus >= 1 && processxminus < 10) { processbarxminus = ' [■□□□□□□□□□□]' }
                if (processxminus >= 1 && processxminus < 10) { processbarxminus = ' [■□□□□□□□□□□]' }
                if (processxminus >= 10 && processxminus < 20) { processbarxminus = ' [■■□□□□□□□□□]' }
                if (processxminus >= 20 && processxminus < 30) { processbarxminus = ' [■■■□□□□□□□□]' }
                if (processxminus >= 30 && processxminus < 40) { processbarxminus = ' [■■■■□□□□□□□]' }
                if (processxminus >= 50 && processxminus < 60) { processbarxminus = ' [■■■■■□□□□□□]' }
                if (processxminus >= 60 && processxminus < 70) { processbarxminus = ' [■■■■■■□□□□□]' }
                if (processxminus >= 70 && processxminus < 80) { processbarxminus = ' [■■■■■■■□□□□]' }
                if (processxminus >= 80 && processxminus < 90) { processbarxminus = ' [■■■■■■■■■□□]' }
                if (processxminus >= 90 && processxminus < 100) { processbarxminus = ' [■■■■■■■■■■□]' }
                if (processxminus >= 100) { processbarxminus = '[■■■■■■■■■■■] Dự án đã hoàng thành.' }
                var processbarzplus = ''
                if (processzplus <= 0) { processbarzplus = ' [□□□□□□□□□□□] Dự án chưa được khởi công.' }
                if (processzplus >= 1 && processzplus < 10) { processbarzplus = ' [■□□□□□□□□□□]' }
                if (processzplus >= 10 && processzplus < 20) { processbarzplus = ' [■■□□□□□□□□□]' }
                if (processzplus >= 20 && processzplus < 30) { processbarzplus = ' [■■■□□□□□□□□]' }
                if (processzplus >= 30 && processzplus < 40) { processbarzplus = ' [■■■■□□□□□□□]' }
                if (processzplus >= 50 && processzplus < 60) { processbarzplus = ' [■■■■■□□□□□□]' }
                if (processzplus >= 60 && processzplus < 70) { processbarzplus = ' [■■■■■■□□□□□]' }
                if (processzplus >= 70 && processzplus < 80) { processbarzplus = ' [■■■■■■■□□□□]' }
                if (processzplus >= 80 && processzplus < 90) { processbarzplus = ' [■■■■■■■■■□□]' }
                if (processzplus >= 90 && processzplus < 100) { processbarzplus = ' [■■■■■■■■■■□]' }
                if (processzplus >= 100) { processbarzplus = '[■■■■■■■■■■■] Dự án đã hoàng thành.' }
                var processbarzminus = ''
                if (processzminus <= 0) { processbarzminus = ' [□□□□□□□□□□□] Dự án chưa được khởi công.' }
                if (processzminus >= 1 && processzminus < 10) { processbarzminus = ' [■□□□□□□□□□□]' }
                if (processzminus >= 10 && processzminus < 20) { processbarzminus = ' [■■□□□□□□□□□]' }
                if (processzminus >= 20 && processzminus < 30) { processbarzminus = ' [■■■□□□□□□□□]' }
                if (processzminus >= 30 && processzminus < 40) { processbarzminus = ' [■■■■□□□□□□□]' }
                if (processzminus >= 50 && processzminus < 60) { processbarzminus = ' [■■■■■□□□□□□]' }
                if (processzminus >= 60 && processzminus < 70) { processbarzminus = ' [■■■■■■□□□□□]' }
                if (processzminus >= 70 && processzminus < 80) { processbarzminus = ' [■■■■■■■□□□□]' }
                if (processzminus >= 80 && processzminus < 90) { processbarzminus = ' [■■■■■■■■■□□]' }
                if (processzminus >= 90 && processzminus < 100) { processbarzminus = ' [■■■■■■■■■■□]' }
                if (processzminus >= 100) { processbarzminus = '[■■■■■■■■■■■] Dự án đã hoàng thành.' }
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
                    .setDescription(`Hôm nay là: ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`)
                    .setThumbnail('https://cdn.discordapp.com/attachments/862724367276179486/880370583043461120/My_Video.gif')
                    .setAuthor({ name: `${client.user.tag}`, iconURL: client.user.displayAvatarURL() })
                    .addFields({
                        name: 'Reach to World Border',
                        value: 'Dự án được thực hiện trong nether\nXây cao tốc X+ kéo dài tới 30 triệu blocks overworld (3.75m nether)\nVà các cao tốc còn lại thì đến 250k',
                        inline: false
                    },
                        {
                            name: 'Đường cao tốc hướng X+',
                            value: `${data.xplus}k/3750k ~ ${processxplus.toFixed(2)}%\n${processbarxplus}`,
                            inline: false
                        },
                        {
                            name: 'Đường cao tốc hướng X-',
                            value: `${data.xminus}k/3750k ~ ${processxminus.toFixed(2)}%\n${processbarxminus}`,
                            inline: false
                        },
                        {
                            name: 'Đường cao tốc hướng Z+',
                            value: `${data.zplus}k/3750k ~ ${processzplus.toFixed(2)}%\n${processbarzplus}`,
                            inline: false
                        },
                        {
                            name: 'Đường cao tốc hướng Z-',
                            value: `${data.zminus}k/3750k ~ ${processzminus.toFixed(2)}%\n${processbarzminus}`,
                            inline: true
                        },
                        {
                            name: 'Tổng tiến độ của dự án Highway',
                            value: `${allprocesspercent2}%\n${sumbarprogress}`
                        })
                    .setColor('#029202')
                    .setFooter({ text: `${message.author.tag} • ${message.guild.name}`, iconURL: `${message.author.displayAvatarURL()}` })
                    .setTimestamp()
                message.reply({ embeds: [embed] })

            }
        })
    }
}