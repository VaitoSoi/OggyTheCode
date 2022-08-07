const { CommandInteraction } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const { PermissionFlagsBits } = require('discord-api-types/v9')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('start')
        .setDescription('Bắt đầu mọi thứ')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    /**
    * 
    * @param {CommandInteraction} interaction 
    */ 
    run: async(interaction) => {
        const client = interaction.client
        interaction.editReply('👋 OggyTheBot xin chào bạn.')
        interaction.channel.send('🔢 Đây là các bước setup cơ bản của bot')
        interaction.channel.send('1️⃣ Kiểm tra quyền và cài đặt (tự động)')
        return require('./start_module/permission')(interaction)
    }
} 