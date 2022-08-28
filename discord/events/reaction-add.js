const Discord = require('discord.js')

module.exports = {
    name: 'messageReactionAdd',
    /**
     * 
     * @param {Discord.MessageReaction} reaction 
     * @param {Discord.User} user 
     */
    async run(reaction, user) {
        const client = reaction.client
        if (client.type == 'client_2' && reaction.message.guild.members.cache.get(client.client1.user.id)) return
        if (user.bot) return
        const db = require('../../models/option')
        const data = await db.findOne({
            guildid: reaction.message.guildId
        })
        if (!data) return
        await reaction.message.fetch().catch(e => { })
        if (reaction.emoji.name == '🔁'
            && reaction.message.id == data.config.messages.status) {
            if (reaction.message.author.id == client.user.id) reaction.message.edit({
                embeds: [
                    new Discord.MessageEmbed()
                        .setTitle('⏳ Đang tải...')
                ]
            })
            const util = require('minecraft-server-util')
            const embed = new Discord.MessageEmbed()
                .setAuthor({
                    name: `${client.user.tag} Server Utils`,
                    iconURL: client.user.displayAvatarURL()
                })
                .setTitle(`\`${process.env.MC_HOST.toUpperCase()}\` Status`)
                .setFooter({
                    text: `${reaction.message.author.tag}`,
                    iconURL: reaction.message.author.displayAvatarURL()
                })
                .setTimestamp()
                .setThumbnail(`https://eu.mc-api.net/v3/server/favicon/${process.env.MC_HOST}`)
            const now = Date.now()
            await util.status(process.env.MC_HOST, Number(process.env.MC_PORT))
                .then((response) => {
                    embed
                        .setColor('GREEN')
                        .setDescription(
                            `**Status:** 🟢 Online\n` +
                            `**Player:** ${response.players.online}/${response.players.max}\n` +
                            `**Version:** ${response.version.name}\n` +
                            `**Ping:** ${Date.now() - now}\n` +
                            `**MOTD:** \n>>> ${response.motd.clean}\n`
                        )
                })
                .catch(e => {
                    embed
                        .setColor('RED')
                        .setDescription(
                            '**Status:** 🔴 Offline\n' +
                            'Phát hiện lỗi khi lấy dữ liệu từ server:' +
                            '```' + `${e}` + '```'
                        )
                })
            if (reaction.message.author.id == client.user.id) reaction.message.edit({
                embeds: [embed]
            })
            else {
                if (reaction.message.deletable) reaction.message.delete()
                let m = await reaction.message.channel.send({
                    embeds: [embed]
                })
                m.react('🔁')
                data.config.messages.status = m.id
                await data.save()
            }
            reaction.users.remove(user)
        } else if (reaction.emoji.name == '📢'
            && reaction.message.id == data.config.messages.restart) {
            const role = reaction.message.guild.roles.cache.get(data.config.roles.restart)
            if (!role) return
            reaction.message.guild.members.cache.get(user.id).roles.add(
                role, 'Oggy Reaction-Role'
            )
                .then((mem) =>
                    reaction.message.reply({
                        content: `Đã thêm role ${role} cho ${mem.user}`,
                        allowedMentions: {
                            parse: ['users']
                        }
                    })
                        .then(m => setTimeout(() => m.delete().catch(e => { }), 5 * 1000)))
                .catch((e) => reaction.message.reply(`Lỗi: \`\`\`${e}\`\`\``)
                    .then(m => setTimeout(() => m.delete().catch(e => { }), 15 * 1000)))
        } else return
    }
}