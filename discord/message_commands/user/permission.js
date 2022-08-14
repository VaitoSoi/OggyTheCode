const { Client, Message } = require('discord.js')

module.exports = { 
    name: 'permission',
    description: 'Kiểm tra các quyền của bot',
    usage: '',
    /**
    * 
    * @param {Client} client 
    * @param {Message} message 
    * @param {String[]} args 
    */ 
    run: async(client, message, args) => {
        /**
         * @param {Boolean} perm 
         */
        const rate = (perm) => perm == false || perm == null || !perm ? '❌' : '✅'
        const embedPerm = message.guild.me.permissions.has('EMBED_LINKS')
        const sendPerm = message.guild.me.permissions.has('SEND_MESSAGES')
        const reactionAddPerm = message.guild.me.permissions.has('ADD_REACTIONS')
        const manangeRolePerm = message.guild.me.permissions.has('MANAGE_ROLES')
        const manangeChannelPerm = message.guild.me.permissions.has('MANAGE_CHANNELS')
        message.channel.send(''
            + 'Các quyền bot cần:\n'
            + '❕ Các quyền quan trọng:\n'
            + `> EMBED_LINKS (Nhúng liên kết): ${rate(embedPerm)}\n`
            + `> SEND_MESSAGES (Gửi tin nhắn): ${rate(sendPerm)}\n`
            + `🔀 Các quyền khác (liên quan tới các tính năng khác của bot):\n`
            + `> ADD_REACTIONS (Thêm biểu cảm): ${rate(reactionAddPerm)}\n`
            + `> MANAGE_ROLES (Quản lý vai trò): ${rate(manangeRolePerm)}\n`
            + `> MANAGE_CHANNELS (Quản lý kênh): ${rate(manangeChannelPerm)}\n`
            + '** *Lưu ý: Nếu một trong các quyền quan trọng (❕) bị thiếu sẽ dẫn đến việc bot gặp lỗi trong quá trình hoặc động! **'
        )
    }
}