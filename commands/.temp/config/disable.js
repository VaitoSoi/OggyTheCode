const { Message, Client } = require('discord.js')
const dcommand = require('../../models/commands')

module.exports = {
    name: 'disable',
    aliases: ['tat'],
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
        const cmd =
            client.commands.get(args[0].toLowerCase()) ||
            client.commands.find(
                (c) => c.aliases && c.aliases.includes(args[0].toLowerCase())
            );
        if (!cmd) return message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setTitle(`❌ | Không tìm thấy lệnh \`${cmd}\``)
                    .setColor('#f00c0c')
            ]
        })
        const dcommand = require('../../models/commands')
        dcommand.findOne({ guildid: message.guildId }, async (err, data) => {
            if (err) throw err;
            if (data) {
                if (data.commands.includes(cmd.name)) return message.channel.send(`Lệnh \`${cmd.name}\` đã bị tắt!`)
                data.commands.push(`${cmd.name.toLowerCase()}`)
                data.save()
                message.channel.send(`Đã tắt lệnh\`${cmd.name}\``)
            } else if (!data) {
                message.channel.send('Không thấy data.').then(msg => {
                    setTimeout(() => {
                        msg.edit('Đang tạo data')
                    }, 1000)
                    setTimeout(() => {
                        data = new dcommand({
                            guildid: message.guildId,
                            guildname: message.guild.name,
                            commands: [cmd.name.toLowerCase()]
                        })
                        data.save()
                        msg.edit('Đã tạo data')
                    }, 1500)
                })
            }
        })
    }
}