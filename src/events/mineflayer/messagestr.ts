import { EmbedBuilder } from 'discord.js'
import { EventBuilder, MineflayerEvents } from '../../index'
import { consoleEmbed, sendMessage } from '../../modules/message'
import { setTimeout as wait } from 'node:timers/promises'

export default new EventBuilder()
    .setName(MineflayerEvents.MessageStr)
    .setOnce(false)
    .setRun(async function (client, message: string) {
        // console.log(message)
        const normalChat = /^<(.+)>$/
        const whisperSendVi = /^nhắn cho (.+): (.+)$/
        const whisperSendEN = /^You whisper to (.+): (.+)$/
        const whisperReceiveVi = /^(.+) nhắn: $(.+)$/
        const whisperReceiveEN = /^(.+) whispers to you: $(.+)$/
        const embed = new EmbedBuilder()
            .setFooter({
                text: `OggyTheCode ${client.package.version}`,
                iconURL: `https://github.com/${client.package.github}.png`
            })
            .setTimestamp()
        if (normalChat.test(message.split(' ')[0] ?? '')) {
            const name = (normalChat.exec(message.split(' ')[0] ?? '') ?? ['', 'Oggy'])[1]
            // console.dir({ name, player: client.bot?.players[name] }, { depth: null })
            const content = message.slice(name.length + 3)
            embed
                .setAuthor({
                    name,
                    iconURL: `https://crafatar.com/avatars/${client.bot?.players[name]?.uuid ?? ''}`
                })
                .setDescription(content.startsWith('>') ? `\\${content}` : content)
                .setColor('Blue')
        } else if (whisperSendVi.test(message) || whisperSendEN.test(message))
            embed
                .setAuthor({
                    name: client.bot?.username ?? 'Oggy',
                    iconURL: `https://crafatar.com/avatars/${client.bot?.player.uuid ?? ''}`
                })
                .setDescription(message)
                .setColor('LuminousVividPink')
        else if (whisperReceiveVi.test(message) || whisperReceiveVi.test(message)) {
            const name = ((whisperReceiveVi.test(message) ? whisperReceiveVi.exec(message) : whisperReceiveEN.exec(message)) ?? ['', 'Oggy'])[1]
            embed
                .setAuthor({
                    name,
                    iconURL: `https://crafatar.com/avatars/${client.bot?.players[name].uuid ?? ''}`
                })
                .setDescription(message)
                .setColor('LuminousVividPink')
        } else {
            embed
                .setAuthor({
                    name: 'Server Console',
                    iconURL: `https://api.mcstatus.io/v2/icon/${client.config.minecraft.server.ip}`
                })
                .setDescription(message || 'Nothing....')
                .setColor('Blue')
            switch (message) {
                case 'đang vào AnarchyVN...':
                case 'Connecting to the server...':
                case 'Đang kết nối tới server...':
                    embed.setColor('Yellow'); break
                case 'Please log-in in order to use the chat or any commands!':
                case 'Oops something went wrong... Putting you back in queue.':
                case 'Already connecting to this server!':
                case 'Oops có một số trục trặc... Bạn đã được quay trở lại hàng chờ.':
                case 'AnarchyVN đã full':
                    embed.setColor('Red'); break
            }
        }
        sendMessage(client, embed)
        if (message.trim().toLowerCase() == 'dùng lệnh/anarchyvn  để vào server.') {
            await wait(1000).catch(e => { })
            client.bot?.chat('/anarchyvn');
            sendMessage(client, new consoleEmbed()
                .setTitle(`Đã nhập chat \`/anarchyvn\``)
                .setColor('Green')
            )
        }
    })