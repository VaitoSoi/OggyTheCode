const { CommandInteraction } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const heroku_client = require('heroku-client')
const heroku = new heroku_client({
    token: process.env.HEROKU_TOKEN
})

module.exports = {
    data: new SlashCommandBuilder()
        .setName('admin_user')
        .setDescription('!ADMIN ONLY!')
        .addSubcommand(sub => sub
            .setName('heroku')
            .setDescription('!ADMIN ONLY | Khởi động lại bot')
            .addStringOption(o => o
                .setName('action')
                .setDescription('Hàng động')
                .setRequired(true)
                .addChoices({ name: 'restart_dyno', value: 'restart_dyno' })
            )
        )
        .addSubcommand(sub => sub
            .setName('eval')
            .setDescription('!ADMIN ONLY | Chạy 1 câu lệnh')
            .addStringOption(o => o
                .setName('action')
                .setDescription('Hàng động')
                .setRequired(true)
            )
        )
        .addSubcommand(sub => sub
            .setName('execute')
            .setDescription('!ADMIN ONLY | Kích hoạt BOT')
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
        const action = interaction.options.get('action') ? interaction.options.get('action').value : null
        if (id == 'heroku') {
            const env = process.env
            const app = env.HEROKU_APP
            const dyno = env.HEROKU_DYNO
            interaction.editReply('⏳ | Restarting...')
            if (action == 'restart_dyno')
                return heroku.delete('/apps/' + app + '/dynos/' + dyno)
                    .catch(e => interaction.editReply('Phát hiện lỗi: \n```' + e + '```'))
        } else if (id == 'eval') {
            try {
                eval(action)
                interaction.replied
                    ? interaction.channel.send('✅ | Eval done')
                    : interaction.editReply('✅ | Eval done')
            } catch (error) {
                interaction.editReply('Lỗi: ```' + error + '```')
            }
        } else if (id == 'execute') {
            if (client.executed == true) return interaction.editReply('✅ | Bot đã được kích hoạt từ trước!')
            else {
                interaction.editReply('⏳ | Đang kích hoạt bot...\n👍 | Vui lòng kiểm tra kênh livechat!')
                if (client.num.toString() == '2')
                    client.start_mc(client.client1, client)
                else if (client.num.toString() == '1')
                    client.start_mc(client, client.client2)
            }
        }
    }
}