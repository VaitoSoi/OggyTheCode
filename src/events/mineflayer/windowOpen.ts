import { EventBuilder, MineflayerEvents } from '../../index'
import * as Window from 'prismarine-windows'
import { consoleEmbed, sendMessage } from '../../modules/message'

export default new EventBuilder()
    .setName(MineflayerEvents.WindowOpen)
    .setOnce(false)
    .setRun(async function (client, window: Window.Window) {
        switch (window.slots.length) {
            case 46:
                const pins = client.config.minecraft.ingame.pin.split(' ').map(Number)
                client.bot?.simpleClick.leftMouse(pins[0])
                client.bot?.simpleClick.leftMouse(pins[1])
                client.bot?.simpleClick.leftMouse(pins[2])
                client.bot?.simpleClick.leftMouse(pins[3])
                sendMessage(client, new consoleEmbed()
                    .setTitle('Đã nhập PIN')
                    .setColor('Green')
                )
                break;
            case 63:
                client.bot?.simpleClick.leftMouse(13)
                sendMessage(client, new consoleEmbed()
                    .setTitle('Đã nhập vào ô chuyển cụm')
                    .setColor('Green')
                )
        }
    })