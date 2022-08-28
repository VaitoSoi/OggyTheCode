const { CommandInteraction, MessageEmbed } = require('discord.js')

module.exports = {
    name: 'interactionCreate',
    /**
     * Interaction event
     * @param {CommandInteraction} interaction 
     */
    async run(interaction) {
        if (interaction.isCommand()) {
            const client = interaction.client
            let cmd = await client.slash.commands.get(interaction.commandName)
            if (!cmd || !client.slash.categories.user.includes(cmd.data.name)) return
            const db = require('../../models/blacklist')
            const data = await db.findOne({ id: interaction.user.id })
            if (data
                && data.end.toLowerCase() != 'vĩnh viễn'
                && Math.floor(Date.now() / 1000) >= Number(data.end))
                await db.findOneAndDelete({ id: interaction.user.id })
            else if (data
                && (!data.type || data.type == 'all' || data.type == 'command')
                && (data.end.toLowerCase() == 'vĩnh viễn'
                    || Math.floor(Date.now() / 1000) < Number(data.end)))
                return interaction.reply(
                    'Bạn đã bị Blacklist' +
                    `Lý do: \`${data.reason}\`\n` +
                    `Bởi: \`${data.by}\`\n` +
                    `Loại: \`${data.type ? data.type : 'tất cả'}\`\n` +
                    `Lúc: ${data.at
                        ? `<t:${data.at}:f> (<t:${data.at}:R>)` : `\`¯\\_(ツ)_/¯\``}\n` +
                    `Hết hạn: ${data.end.toLowerCase() != 'vĩnh viễn'
                        ? `<t:${data.end}:f> (<t:${data.end}:R>)` : `\`${data.end}\``}`
                )
            await interaction.deferReply().catch(e => interaction.channel.send(`Lỗi: \n \`\`\`${e}\`\`\``))
            const a = [
                'Mer đki kưng 😉',
                'Mài nghĩ mài là ai 😏',
                'Ủa ai dạ :)???',
                'Cưng nghĩ cưng là ai mà dùng 😒'
            ]
            await interaction.client.application.fetch()
            if ((cmd.admin || cmd.admin == true) && interaction.user.id !== client.application.owner.id)
                return interaction.editReply(a[Math.floor(Math.random() * a.length)])
            cmd.run(interaction)
        }
    }
}