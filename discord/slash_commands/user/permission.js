const { CommandInteraction } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('permission')
        .setDescription('Kiểm tra các quyền của bot'),
    /**
    * 
    * @param {CommandInteraction} interaction 
    */
    run: async (interaction) => {
        const client = interaction.client
        /**
         * @param {Boolean} perm 
         */
        const rate = (perm) => perm == false || perm == null || !perm ? '❌' : '✅'
        const embedPerm = interaction.guild.me.permissions.has('EMBED_LINKS')
        const sendPerm = interaction.guild.me.permissions.has('SEND_MESSAGES')
        const reactionAddPerm = interaction.guild.me.permissions.has('ADD_REACTIONS')
        const manangeRolePerm = interaction.guild.me.permissions.has('MANAGE_ROLES')
        const manangeChannelPerm = interaction.guild.me.permissions.has('MANAGE_CHANNELS')
        interaction.editReply(''
            + '‼ Các quyền quan trọng:\n'
            + `> EMBED_LINKS (Nhúng liên kết): ${rate(embedPerm)}\n`
            + `> SEND_MESSAGES (Gửi tin nhắn): ${rate(sendPerm)}\n`
            + `🔀 Các quyền khác (liên quan tới các tính năng khác của bot):\n`
            + `> ADD_REACTIONS (Thêm biểu cảm): ${rate(reactionAddPerm)}\n`
            + `> MANAGE_ROLES (Quản lý vai trò): ${rate(manangeRolePerm)}\n`
            + `> MANAGE_CHANNELS (Quản lý kênh): ${rate(manangeChannelPerm)}\n`
            + '* *Lưu ý: Nếu một trong các quyền quan trọng (‼) bị thiếu sẽ dẫn đến việc bot gặp lỗi trong quá trình hoặc động! *'
        )
    }
}