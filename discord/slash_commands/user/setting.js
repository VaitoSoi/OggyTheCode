const { CommandInteraction, MessageEmbed, Channel } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setting')
        .setDescription('Cài đặt của bot'),
    /**
    * @param {CommandInteraction} interaction
    */
    run: async (interaction) => {
        const client = interaction.client
        const db = require('../../../models/option')
        let data = await db.findOne({
            guildid: interaction.guildId
        })
        //console.log(data)
        if (!data) data = new db({
            guildid: interaction.guildId,
            guildname: interaction.guild.name,
            config: {
                channels: {
                    livechat: '',
                    status: '',
                    restart: '',
                },
                messages: {
                    status: '',
                    restart: '',
                },
                role: {
                    restart: ''
                },
                feature: {
                    chatType: 'embed',
                    timestamp: 'on',
                    join_leave: 'off'
                }
            }
        })
        /**
         * @param {String} id
         */
        const get_channel = (id) => interaction.guild.channels.cache.get(id)
        /**
         * @param {String} id
         */
        const message_channel = (id) => {
            const channel = get_channel(id)
            return channel && channel.isText() ? `<#${channel.id}>` : 'Không có dữ liệu'
        }
        /**
         * @param {String} channel_id
         * @param {String} message_id
         */
        const message_link = async (channel_id, message_id) => {
            const channel = get_channel(channel_id)
            //console.log(channel)
            if (!channel || !channel.isText()) return 'Không có dữ liệu'
            const message = await (await channel.messages.fetch()).get(message_id).fetch()
            return message ? `[Link](${message.url})` : 'Không có dữ liệu'
        }
        /**
         * @param {String} id
         */
        const role_message = (id) => {
            const role = interaction.guild.roles.cache.get(id)
            return role ? `<@&${role.id}>` : 'Không có dữ liệu'
        }
        const setting_embed = new MessageEmbed()
            .setTitle(`${interaction.guild.name}'s settings`)
            .setAuthor({
                name: `${client.user.tag} Setting Pannel`,
                iconURL: client.user.displayAvatarURL()
            })
            .setFooter({
                text: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL()
            })
            .setTimestamp()
            .setThumbnail(interaction.guild.iconURL())
            .addFields({
                name: 'CHANNELS',
                value: 'Các kênh chức năng',
                inline: false
            },
                {
                    name: 'Types:',
                    value:
                        'Livechat: \n' +
                        'Restart: \n' +
                        'Status: ',
                    inline: true
                },
                {
                    name: 'Channels',
                    value:
                        message_channel(data.config.channels.livechat) + '\n' +
                        message_channel(data.config.channels.restart) + '\n' +
                        message_channel(data.config.channels.status),
                    inline: true
                },
                {
                    name: 'MESSAGES',
                    value: 'Các tin nhắn chức năng',
                    inline: false
                },
                {
                    name: 'Types:',
                    value:
                        'Restart: \n' +
                        'Status: ',
                    inline: true
                },
                {
                    name: 'Messages',
                    value:
                        await message_link(data.config.channels.restart, data.config.messages.restart) + '\n' +
                        await message_link(data.config.channels.status, data.config.messages.status),
                    inline: true
                },
                {
                    name: 'ROLES',
                    value: 'Các role chức năng',
                    inline: false
                },
                {
                    name: 'Types:',
                    value: 'Restart: ',
                    inline: true
                },
                {
                    name: 'Roles',
                    value: role_message(data.config.roles.restart),
                    inline: true
                },
                {
                    name: 'FEATURES',
                    value: 'Các tính năng hiện có',
                    inline: false
                },
                {
                    name: 'Types:',
                    value:
                        'Kiểu tin nhắn: \n' +
                        'Hiện thời gian gửi tin nhắn: \n' +
                        'Hiện thông tin người vào ra server: ',
                    inline: true,
                },
                {
                    name: 'Values:',
                    value:
                        data.config.feature.chatType != undefined
                            ? `${data.config.feature.chatType}\n${data.config.feature.timestamp}\n${data.config.feature.join_leave}`
                            : `${data.config.chatType}\n${data.config.timestamp}\n${data.config.join_leave}`,
                    inline: true
                })
        interaction.editReply({
            embeds: [setting_embed]
        })
    }
}