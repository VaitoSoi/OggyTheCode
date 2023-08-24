import { EventBuilder, MineflayerEvents } from '../../lib/index'
import { sendMessage, consoleEmbed } from '../../modules/message'

export default new EventBuilder()
    .setName(MineflayerEvents.Spawn)
    .setOnce(true)
    .setRun(function (client) {
        sendMessage(client, new consoleEmbed()
            .setTitle('Đã đăng nhập vào máy chủ')
            .setColor('Green'))
    })