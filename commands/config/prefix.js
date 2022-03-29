const { Message } = require('discord.js')
const prefixSchema = require('../../models/prefix')
const oprefix = process.env.PREFIX


module.exports = {
    name: 'prefix',
    category: 'moderation',
    description: 'Đổi prefix của bot',
    aliases: ['changeprefix'],
    permissions: ['MANAGE_MESSAGES'],
    /** 
     * @param { Message } message 
     */
    run: async (client, message, args) => {
        const res = await args.join(" ")
        if(!res) return message.channel.send('Nhập cái prefix vào')
        if(res === oprefix) return message.channel.send('Vui lòng dùng lệnh `reset-prefix`')
        
        prefixSchema.findOne({ GuildId : message.guild.id }, async (err, data) => {
            if(err) throw err;
            if(data) {
                await prefixSchema.findOneAndDelete({ GuilId : message.guild.id })
                data = new prefixSchema({
                    GuildId : message.guild.id,
                    Prefix : res,
                    GuildName : message.guild.name,
                    UserId : message.author.id,
                    UserName : message.author.username
                })
                data.save()
                message.reply(`Prefix đã đc đổi thành "**${res}**"`)
            } else {
                data = new prefixSchema({
                    GuildId : message.guild.id,
                    Prefix : res,
                    GuildName : message.guild.name,
                    UserId : message.author.id,
                    UserName : message.author.username
                })
                data.save()
                message.reply(`Prefix đã đc đổi thành "**${res}**"`)
            }
        })
    }
}