const { CommandInteraction, MessageEmbed } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const heroku_client = require('heroku-client')
const heroku = new heroku_client({
    token: process.env.HEROKU_TOKEN
})
const ms = require('ms')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('admin_user')
        .setDescription('!ADMIN ONLY!')
        /*.addSubcommand(sub => sub
            .setName('heroku')
            .setDescription('!ADMIN ONLY! | Các lệnh liên quan đến heroku')
            .addStringOption(o => o
                .setName('action')
                .setDescription('Hàng động')
                .setRequired(true)
                .addChoices({ name: 'restart_dyno', value: 'restart_dyno' })
            )
        )*/
        .addSubcommand(sub => sub
            .setName('eval')
            .setDescription('!ADMIN ONLY! | Chạy 1 câu lệnh')
            .addStringOption(o => o
                .setName('action')
                .setDescription('Hàng động')
                .setRequired(true)
            )
        )
        .addSubcommand(sub => sub
            .setName('execute')
            .setDescription('!ADMIN ONLY! | Kích hoạt BOT')
        )
        .addSubcommand(sub => sub
            .setName('blacklist')
            .setDescription('!ADMIN_ONLY! | Chặn ai đó')
            .addStringOption(o => o
                .setName('action')
                .setDescription('Hành động')
                .setRequired(true)
                .addChoices(
                    { name: 'add', value: 'add' },
                    { name: 'edit', value: 'edit' },
                    { name: 'delete', value: 'delete' },
                    { name: 'show', value: 'show' }
                )
            )
            .addStringOption(o => o
                .setName('user_id')
                .setDescription('ID của ai đó')
                .setRequired(true)
            )
            .addStringOption(o => o
                .setName('reason')
                .setDescription('Lý do bị chặn / bỏ chặn')
            )
            .addStringOption(o => o
                .setName('time')
                .setDescription('Thời gian thời gian bị chặn')
            )
            .addStringOption(o => o
                .setName('type')
                .setDescription('Loại chặn')
                .addChoices(
                    { name: 'all', value: 'all' },
                    { name: 'command', value: 'command' },
                    { name: 'livechat', value: 'livechat' }
                )
            )
        ),
    admin: true,
    /**
    * 
    * @param {CommandInteraction} interaction 
    */
    run: async (interaction) => {
        const client = interaction.client
        const a = [
            'Mer đki kưng 😏',
            'Mài nghĩ mài là ai 😉',
            'Ủa ai dạ :)???',
            'Cưng nghĩ cưng là ai mà dùng 😒'
        ]
        if (interaction.user.id != client.application.owner.id)
            return interaction.editReply(a[Math.floor(Math.random() * a.length)])
        const id = interaction.options.getSubcommand()
        /*const action = interaction.options.get('action') ? interaction.options.get('action').value : null
        if (id == 'heroku') {
            if (action == 'restart_dyno') {
                const env = process.env
                const app = env.HEROKU_APP
                const dyno = env.HEROKU_DYNO
                interaction.editReply('⏳ | Restarting...')
                return heroku.delete('/apps/' + app + '/dynos/' + dyno)
                    .catch(e => interaction.editReply('Phát hiện lỗi: \n```' + e + '```'))
            }
        } else*/ if (id == 'eval') {
            try {
                await eval(action)
                interaction.editReply('✅ | Eval done')
            } catch (error) {
                interaction.editReply('Lỗi: ```' + error + '```')
            }
        } else if (id == 'execute') {
            if (client.executed == true) return interaction.editReply('✅ | Bot đã được kích hoạt từ trước!')
            else {
                interaction.editReply('⏳ | Đang kích hoạt bot...\n👍 | Vui lòng kiểm tra kênh livechat!')
                if (client.num == '2')
                    client.client1.start_mc(client.client1, client)
                else if (client.num == '1')
                    client.start_mc(client, client.client2)
            }
        } else if (id == 'blacklist') {
            const db = require('../../../models/blacklist')
            const user = client.users.cache.get(interaction.options.getString('user_id'))
            if (!user && action != 'show') return interaction.editReply('🛑 | User không hợp lệ!')
            let data = user ? await db.findOne({ id: user.id }) : undefined
            if (action == 'add') {
                if (data) return interaction.editReply({
                    content:
                        `🛑 | ${user} đã bị chặn trước đó\n` +
                        '👍 | Dùng lệnh show để biết thông tin'
                })
                const reason = interaction.options.getString('reason')
                const time = interaction.options.getString('time')
                const type = interaction.options.getString('type')
                data = new db({
                    id: user.id,
                    tag: user.tag,
                    reason: reason ? reason : 'Không có lý do',
                    by: interaction.user.tag,
                    type: type || 'all',
                    at: Math.floor(Date.now() / 1000),
                    end: time && time.toLowerCase() != 'vĩnh viễn' ? Math.floor((ms(time) + Date.now()) / 1000) : 'Vĩnh viễn'
                })
                await data.save()
                interaction.editReply(`✅ | Đã chặn ${user}`)
            } else if (action == 'edit') {
                if (!data) return interaction.editReply({ content: `🛑 | ${user} chưa bị chặn.` })
                const reason = interaction.options.getString('reason')
                const time = interaction.options.getString('time')
                const type = interaction.options.getString('type')
                data.id = user.id
                data.tag = user.tag
                data.reason = reason ? reason : 'Không có lý do'
                data.by = interaction.user.tag
                data.end = time ? Math.floor((ms(time) + Date.now()) / 1000) : 'Vĩnh viễn'
                data.type = type || 'all'
                await data.save()
                interaction.editReply(`✅ | Đã chỉnh sửa lệnh chặn ${user}`)
            } else if (action == 'delete') {
                if (!data) return interaction.editReply({ content: `🛑 | ${user} chưa bị chặn.` })
                await db.findOneAndDelete({ id: user.id })
                interaction.editReply(`✅ | Đã bỏ chặn ${user}`)
            } else if (action == 'show') {
                console.log({ data, user: interaction.options.getString('user_id') })
                if (!data
                    && interaction.options.getString('user_id').toLowerCase() != 'all')
                    return interaction.editReply({ content: `🛑 | ${user} chưa bị chặn.` })
                let embed = interaction.options.getString('user_id').toLowerCase() !== 'all' ?
                    new MessageEmbed()
                        .setTitle('User Blacklist')
                        .setThumbnail(user.displayAvatarURL())
                        .setFooter({
                            text: `${interaction.user.tag}`,
                            iconURL: interaction.user.displayAvatarURL()
                        })
                        .setAuthor({
                            name: client.user.tag,
                            iconURL: client.user.displayAvatarURL()
                        })
                        .setColor('RANDOM')
                        .setDescription(
                            'Thông tin về User bị blacklist\n' +
                            `Tag: \`${user.tag}\`\n` +
                            `UserID: \`${user.id}\`\n` +
                            `Lý do: \`${data.reason}\`\n` +
                            `Bởi: \`${data.by}\`\n` +
                            `Loại: \`${data.type ? data.type : 'all'}\`\n` +
                            `Lúc: ${data.at
                                ? `<t:${data.at}:f> (<t:${data.at}:R>)` : `\`¯\\_(ツ)_/¯\``}\n` +
                            `Hết hạn: ${data.end.toLowerCase() != 'vĩnh viễn'
                                ? `<t:${data.end}:f> (<t:${data.end}:R>)` : `\`${data.end}\``}`
                        )
                        .setTimestamp()
                    : new MessageEmbed()
                        .setTitle('Users Blacklist')
                        .setFooter({
                            text: `${interaction.user.tag}`,
                            iconURL: interaction.user.displayAvatarURL()
                        })
                        .setAuthor({
                            name: client.user.tag,
                            iconURL: client.user.displayAvatarURL()
                        })
                        .setColor('RANDOM')
                        .setDescription((await db.find({}))
                            .map(blacklist => `${client.users.cache.get(blacklist.id) ? `<@!${blacklist.id}>` : blacklist.tag} - ${blacklist.reason}`)
                            .join('\n'))
                        .setTimestamp()
                interaction.editReply({
                    embeds: [embed]
                })
            }
        }
    }
}