const { CommandInteraction, MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('channel')
        .setDescription('Xem / Tạo data về channel cho guild'),
    /**
    * 
    * @param {CommandInteraction} interaction 
    */ 
    run: async(interaction) => {
        const client = interaction.client
        const setchannel = require('../models/setchannel');
        setchannel.findOne({ guildid: interaction.guild.id }, async (err, data) => {
            if (err) throw err;
            if (!data) {
                data = new setchannel({
                    guildid: interaction.guild.id,
                    guildname: interaction.guild.name,
                    mute: 'No data',
                    ban: 'No data',
                    kick: 'No data',
                    warn: 'No data',
                    welcome: 'No data',
                    goodbye: 'No data',
                    livechat: 'No data',
                    status: 'No data',
                })
                data.save()
                interaction.reply({
                    content: '🟢 | Đã tạo dữ liệu!',
                    embeds: [
                        new MessageEmbed()
                        .setAuthor({ name: `${client.user.tag}`, iconURL: client.user.displayAvatarURL() })
                        .setTitle(`Các channel đã đc set tại ${data.guildname}`)
                        .setDescription('**LƯU Ý!**\n> Nếu thấy tên zchannel hoặc ID là `No data` có nghĩa là channel chưa được cài.\n-Dùng "*setchannel*" để cài channel đó.')
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
                        .setFooter({ text: `${interaction.user.tag} • ${interaction.guild.name}`, iconURL: `${interaction.user.displayAvatarURL()}` })
                        .setTimestamp()
                    ]
                })
            } else {
                interaction.reply({
                    embeds: [
                        new MessageEmbed()
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
                        .setFooter({ text: `${interaction.user.tag} • ${interaction.guild.name}`, iconURL: `${interaction.user.displayAvatarURL()}` })
                        .setTimestamp()
                    ]
                })
            }
        })

    }
} 