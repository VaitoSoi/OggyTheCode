import { SlashCommandBuilder } from '../../lib/index'

export default new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Kiểm tra độ trễ của bot')
    .setRun(async function (interaction) {
        const client = interaction.client
        const message = await interaction.channel?.send('⏳ Checking delay...')
        if (!message?.inGuild()) return
        const msgPing = (await message?.delete()).createdTimestamp - interaction.createdTimestamp
        const wsPing = client.ws.ping
        function delay(delay: number) {
            if (delay <= 100) return `🟢 ${delay}ms`
            else if (delay <= 500) return `🟡 ${delay}ms`
            else if (delay <= 1000) return `🟠 ${delay}ms`
            else return `🔴 ${delay}ms`
        }
        interaction.editReply({
            content:
                `**----- ${client.user.tag} Ping -----**\n` +
                `> Command response: ${delay(msgPing)}\n` +
                `> WS delay: ${delay(wsPing)}\n`
        })
    })