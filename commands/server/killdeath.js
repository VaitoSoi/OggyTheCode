const kd = require('../../models/kd')
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'killdeath',
    aliases: ['kd', 'kda'],
    description: 'Dùng để xem điểm KD trong server anarchyvn.net',
    usage: '<Tên ingame, Vd: VaitoSoi>',
    run: async(client, message, args) => {
        const user = args[0]
        kd.findOne({ username: user }, async(err, data) => {
            if(err) throw err;
            if(data) {
                var kd = data.kill / data.death
                if (!data.death && !data.kill) kd = `No data`
                if (data.death === '0' && data.kill === '0') kd = '0'
                if (data.death === '0' || !data.death) kd = `Kill: ${data.kill}`
                if (data.kill === '0' || !data.kill) kd = ` Death: ${data.death}`
                message.channel.send({embeds:[new MessageEmbed()
                    .setTitle(`Số kill/death của ${user}`)
                    .addFields({
                        name: 'Kill',
                        value: `${data.kill}`,
                        inline: true
                    }, 
                    {
                        name: 'Death',
                        value: `${data.death}`,
                        inline: true
                    },
                    {
                        name: 'K/D',
                        value: `${kd}`,
                        inline: true
                    })
                    .setColor('RANDOM')]}
                )
            } else {
                message.channel.send('Không thấy data.\nHãy bóp bird tự tử để tạo data')
            }
        })
    }
}