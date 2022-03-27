const { CommandInteraction, MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setchannel')
        .setDescription('Setup 1 channel')
        .addStringOption(option => option
            .setName('type')
            .setDescription('Loại channel muốn setup')
            .setRequired(true)
            .addChoice('Mute', 'mute')
            .addChoice('Ban', 'ban')
            .addChoice('Kick', 'Kick')
            .addChoice('Warn', 'warn')
            .addChoice('Welcome', 'welcome')
            .addChoice('Goodbye', 'goodbye')
            .addChoice('Livechat', 'livechat')
        )
        .addChannelOption(option => option
            .setName('channel')
            .setDescription('Channel muốn setup')
            .setRequired(true)
        ),
    /**
    * 
    * @param {CommandInteraction} interaction 
    */
    run: async (interaction) => {
        const client = interaction.client
        const type = interaction.options.getString('type')
        const channel = interaction.options.getChannel('channel')
        if (!channel.isText()) return interaction.reply('🛑 | Vui lòng chọn 1 channel hợp lệ')
        let type1 = ''
        if (type === 'mute') type1 = 'Mute'
        else if (type === 'ban') type1 = 'Ban'
        else if (type === 'kick') type1 = 'Kick'
        else if (type === 'warn') type1 = 'Warn'
        else if (type === 'welcome') type1 = 'Welcome'
        else if (type === 'goodbye') type1 = 'Goodbye'
        else if (type === 'livechat') type1 = 'Livechat'

        require('../models/setchannel').findOne({ 'guildid': interaction.guild.id }, async (err, data) => {
            if (err) throw err;
            if (!data) {
                message.channel.send(`Không tìm thấy data.\nVui lòng dùng lệnh \`channel\` để tạo data.`)
            }
            if (data) {
                if (type === 'mute') data.mute = channel.id
                else if (type === 'ban') data.ban = channel.id
                else if (type === 'kick') data.kick = channel.id
                else if (type === 'warn') data.warn = channel.id
                else if (type === 'welcome') data.welcome = channel.id
                else if (type === 'goodbye') data.goodbye = channel.id
                else if (type === 'livechat') data.livechat = channel.id
                await data.save()
                const embed = new MessageEmbed()
                    .setAuthor({ name: `${client.user.tag}`, iconURL: client.user.displayAvatarURL() })
                    .setTitle('Đã set channel thành công')
                    .setColor('RANDOM')
                    .addFields({
                        name: 'Tên channel',
                        value: `${channel}`
                    },
                        {
                            name: 'ID của channel',
                            value: `${channel.id}`
                        },
                        {
                            name: 'Thể loại',
                            value: `${type1}`
                        })
                interaction.reply({ embeds: [embed] })
                channel.send(`Channel đã được set thành **"${type1}"**`)
            }
        })
    }
} 