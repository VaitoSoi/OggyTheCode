const { CommandInteraction } = require('discord.js')

/**
 * 
 * @param {CommandInteraction} interaction 
 */
module.exports = async (interaction) => {
    /**
     * @param {Boolean} perm 
     */
    const rate = (perm) => perm == false || perm == null || !perm ? '❌' : '✅'
    const embedPerm = interaction.guild.me.permissions.has('EMBED_LINKS')
    const sendPerm = interaction.guild.me.permissions.has('SEND_MESSAGES')
    const reactionAddPerm = interaction.guild.me.permissions.has('ADD_REACTIONS')
    const manangeRolePerm = interaction.guild.me.permissions.has('MANAGE_ROLES')
    const manangeChannelPerm = interaction.guild.me.permissions.has('MANAGE_CHANNELS')
    let m = await interaction.channel.send(''
        + 'Các quyền bot cần:\n'
        + '❕ Các quyền quan trọng:\n'
        + `> EMBED_LINKS (Nhúng liên kết): ${rate(embedPerm)}\n`
        + `> SEND_MESSAGES (Gửi tin nhắn): ${rate(sendPerm)}\n`
        + `🔀 Các quyền khác (liên quan tới các tính năng khác của bot):\n`
        + `> ADD_REACTIONS (Thêm biểu cảm): ${rate(reactionAddPerm)}\n`
        + `> MANAGE_ROLES (Quản lý vai trò): ${rate(manangeRolePerm)}\n`
        + `> MANAGE_CHANNELS (Quản lý kênh): ${rate(manangeChannelPerm)}\n`
        + '* *Lưu ý: Nếu một trong các quyền quan trọng (❕) bị thiếu sẽ dẫn đến việc bot gặp lỗi trong quá trình hoặc động! *'
    )
    setTimeout(() => {
        m.delete()
    }, 5 * 1000);
    if (embedPerm == false || sendPerm == false)
        return interaction.channel.send('‼Bot thiếu 1 trong 2 quyền quan trọng‼')
    else return require('./data_create')(interaction)
}