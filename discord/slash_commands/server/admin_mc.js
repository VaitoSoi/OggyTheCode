const { CommandInteraction } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const { Bot } = require('mineflayer')
const ms = require('ms')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('admin_mc')
        .setDescription('!ADMIN ONLY | Các lệnh về MC')
        .addSubcommand(sub => sub
            .setName('mc')
            .setDescription('!ADMIN ONLY | Các lệnh về MC')
            .addStringOption(o => o
                .setName('action')
                .setDescription('Hành động')
                .addChoices(
                    { name: 'reconnect', value: 'reconnect' },
                    { name: 'restart', value: 'restart' },
                    { name: 'disconnect', value: 'disconnect' }
                )
                .setRequired(true)
            )
            .addStringOption(o => o
                .setName('time')
                .setDescription('Thời gian kết nối lại')
                .setRequired(true)
            )
        ).addSubcommand(sub => sub
            .setName('eval')
            .setDescription('!ADMIN ONLY | Lệnh chạy BOT')
            .addStringOption(o => o
                .setName('action')
                .setDescription('Hành động')
                .setRequired(true)
            )
        ),
    admin: true,
    /**
    * 
    * @param {Bot} bot
    * @param {CommandInteraction} interaction 
    */
    run: async (interaction, bot) => {
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
        const action = interaction.options.getString('action')
        const time = interaction.options.getString('time')
        if (id == 'mc') {
            if (action == 'reconnect') {
                if (bot.login != 0) interaction.editReply('🛑 | Bot đã kết nối trước đó')
                else {
                    clearTimeout(bot.reconnect)
                    interaction.editReply('✅ | Reconnected')
                    require('../../../minecraft/main')(client, client.client2)
                }
            } else if (action == 'restart') {
                if (bot.login == 0) clearTimeout(bot.reconnect)
                else bot.end(`Admin reason:restart time:${time} auto-reconnect:false`)
                interaction.editReply('✅ | Restarted')
                setTimeout(() => require('../../../minecraft/main')(client, client.client2), ms(time));
            } else if (action == 'disconnect') {
                //if (bot.login == 0) return interaction.editReply('🛑 | Bot đã mất kết nối trước đó')
                interaction.editReply('✅ | Disconnected')
                bot.end(`Admin reason:disconnect time:${time} auto-reconnect:true`)
            }
        } else if (id == 'eval') {
            try {
                eval(action)
                interaction.replied
                    ? interaction.channel.send('✅ | Eval done')
                    : interaction.editReply('✅ | Eval done')
            } catch (error) {
                interaction.editReply('Lỗi: ```' + error + '```')
            }
        }
    }
}