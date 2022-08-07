const { CommandInteraction } = require('discord.js')
const { Bot } = require('mineflayer')

module.exports = {
    name: 'interactionCreate',
    discord: true,
    /**
     * 
     * @param {Bot} bot
     * @param {CommandInteraction} interaction 
     */
    async run(bot, interaction) {
        if (!interaction.isCommand()) return
        const client = interaction.client
        let cmd = await client.slash.get(interaction.commandName)
        if (!cmd || cmd.server == null || cmd.server == false) return
        await interaction.deferReply()
        const a = [
            'Mer đki kưng 😏',
            'Mài nghĩ mài là ai 😉',
            'Ủa ai dạ :)???',
            'Cưng nghĩ cưng là ai mà dùng 😒'
        ]
        await interaction.client.application.fetch()
        if ((cmd.admin || cmd.admin == true) && interaction.user.id != client.application.owner.id)
            return interaction.editReply(a[Math.floor(Math.random() * a.length)])
        cmd.run(interaction, bot)
    }
}