const { Message, Client } = require('discord.js')
const dcommand = require('../../models/commands')

module.exports = {
    name: 'enable',
    aliases: ['bat'],
    description: 'Lệnh đã bị khai tử',
    usage: '<lệnh>',
    permissions: ['MANAGE_GUILD'],
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {*} args 
     */
    run: async (client, message, args) => {
        return message.reply('🛑 | Lệnh đã bị khai tử!\n▶ | Vui lòng dùng lệnh `config`!')
        const c =
            client.commands.get(args[0].toLowerCase()) ||
            client.commands.find(
                (c) => c.aliases && c.aliases.includes(args[0].toLowerCase())
            );
        if (!c) return message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setTitle(`❌ | Không tìm thấy lệnh **\`${args[1]}\`**`)
                    .setColor('#f00c0c')
            ]
        })
        const cmd = c.name
        dcommand.findOne({ guildid: message.guildId }, async (err, data) => {
            if (err) throw err;
            if (data) {
                if (!data.commands.includes(cmd)) {
                    message.channel.send(`Lệnh \`${cmd}\` không bị tắt!`)
                } else {
                    const cmds = data.commands
                    for (let i = 0; i < cmds.length; i++) {
                        if (data.commands[i] === cmd) {
                            dcommand.findOneAndUpdate({ guildid: message.guildId }, { $set: { commands: data.commands.slice(0, i).concat(data.commands.slice(i + 1, data.commands.length)) } }, async (err, data) => {
                                if (err) throw err;
                                if (data) {
                                    message.channel.send(`Đã bật lệnh ${cmd}`)
                                    data.save()
                                }
                            })
                        }
                    }
                }
            } else {
                message.channel.send('Không thấy data.').then(msg => {
                    setTimeout(() => {
                        msg.edit('Đang tạo data')
                    }, 1000)
                    setTimeout(() => {
                        data = new dcommand({
                            guildid: message.guildId,
                            guildname: message.guild.name,
                            commands: []
                        })
                        data.save()
                        msg.edit('Đã tạo data')
                    }, 1500)
                })
            }
        })
    }
}