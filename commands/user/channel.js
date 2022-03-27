const { MessageEmbed, Message } = require('discord.js');
const setchannel = require('../../models/setchannel');

module.exports = {
    name: 'channel',
    aliases: ['channels'],
    category: 'user',
    description: 'Xem các channel đã đc set',
    /** 
     * @param { Message } message 
     */
    run: async (client, message, args) => {
        setchannel.findOne({ guildid: message.guild.id }, async (err, data) => {
            if (err) throw err;
            if (!data) {
                message.channel.send('Không tìm thấy data.\nKhởi động quá trình khởi tạo data.')
                data = new setchannel({
                    guildid: message.guild.id,
                    guildname: message.guild.name,
                    mute: 'No data',
                    ban: 'No data',
                    kick: 'No data',
                    warn: 'No data',
                    welcome: 'No data',
                    goodbye: 'No data',
                    ticketnoti: 'No data',
                    ticketdatasave: 'No data',
                    livechat: 'No data',
                    status: 'No data',
                })
                data.save()
                message.channel.send('Đã khởi tạo data')
                message.channel.send({
                    embeds: [new MessageEmbed()
                        .setAuthor({ name: `${client.user.tag}`, iconURL: client.user.displayAvatarURL() })
                        .setTitle(`Các channel đã đc set tại ${data.guildname}`)
                        .setDescription('**LƯU Ý!**\n> Nếu thấy tên channel hoặc ID là no data có nghĩa là channel chưa được cài.\n-Dùng "*setchannel*" để cài channel đó.')
                        .setColor('RANDOM')
                        .addFields({
                            name: '> **CHANNEL LOẠI 1**',
                            value: 'Là các channel nếu không được cài thì sẽ nhắn trong channel của người nhắn.',
                            inline: false,
                        },
                            {
                                name: 'Mute',
                                value: `Name: <#${data.mute}>\nID: ${data.mute}`,
                                inline: true
                            },
                            {
                                name: 'Ban',
                                value: `Name: <#${data.ban}>\nID: ${data.ban}`,
                                inline: true
                            },
                            {
                                name: 'Kick',
                                value: `Name: <#${data.kick}>\nID: ${data.kick}`,
                                inline: true
                            },
                            {
                                name: 'Warn',
                                value: `Name: <#${data.warn}>\nID: ${data.warn}`,
                                inline: true
                            },
                            {
                                name: '> **CHANNEL LOẠI 2**',
                                value: 'Là các channel nếu không được cài thì sẽ không hoạt động.',
                                inline: false,
                            },
                            {
                                name: 'Welcome',
                                value: `Name: <#${data.welcome}>\nID: ${data.welcome}`,
                                inline: true
                            },
                            {
                                name: 'Goodbye',
                                value: `Name: <#${data.goodbye}>\nID: ${data.goodbye}`,
                                inline: true
                            },
                            {
                                name: 'Livechat',
                                value: `Name: <#${data.livechat}>\nID: ${data.livechat}`,
                                inline: true
                            })
                        .setFooter({ text: `${message.author.tag} • ${message.guild.name}`, iconURL: `${message.author.displayAvatarURL()}`})
                    .setTimestamp()
                    ]
                })
    } else {
        message.channel.send({
            embeds: [new MessageEmbed()
                .setAuthor({ name: `${client.user.tag}`, iconURL: client.user.displayAvatarURL() })
                .setTitle(`Các channel đã đc set tại ${data.guildname}`)
                .setDescription('**LƯU Ý!**\n> Nếu thấy tên channel hoặc ID là no data có nghĩa là channel chưa được cài.\n-Dùng "*setchannel*" để cài channel đó.')
                .setColor('RANDOM')
                .addFields({
                    name: '> **CHANNEL LOẠI 1**',
                    value: 'Là các channel nếu không được cài thì sẽ nhắn trong channel của người nhắn.',
                    inline: false,
                },
                    {
                        name: 'Mute',
                        value: `Name: <#${data.mute}>\nID: ${data.mute}`,
                        inline: true
                    },
                    {
                        name: 'Ban',
                        value: `Name: <#${data.ban}>\nID: ${data.ban}`,
                        inline: true
                    },
                    {
                        name: 'Kick',
                        value: `Name: <#${data.kick}>\nID: ${data.kick}`,
                        inline: true
                    },
                    {
                        name: 'Warn',
                        value: `Name: <#${data.warn}>\nID: ${data.warn}`,
                        inline: true
                    },
                    {
                        name: '> **CHANNEL LOẠI 2**',
                        value: 'Là các channel nếu không được cài thì sẽ không hoạt động.',
                        inline: false,
                    },
                    {
                        name: 'Welcome',
                        value: `Name: <#${data.welcome}>\nID: ${data.welcome}`,
                        inline: true
                    },
                    {
                        name: 'Goodbye',
                        value: `Name: <#${data.goodbye}>\nID: ${data.goodbye}`,
                        inline: true
                    },
                    {
                        name: 'Livechat',
                        value: `Name: <#${data.livechat}>\nID: ${data.livechat}`,
                        inline: true
                    })
                .setFooter({ text: `${message.author.tag} • ${message.guild.name}`, iconURL: `${message.author.displayAvatarURL()}` })
                .setTimestamp()
            ]
        })
    }
})

    }
}