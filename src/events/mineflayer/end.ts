import { EventBuilder, MineflayerEvents } from "../../lib/index";
import { sendMessage, consoleEmbed } from "../../modules/message";
import ms from "ms";

export default new EventBuilder()
    .setName(MineflayerEvents.End)
    .setOnce(true)
    .setRun(function (client, reason: String) {
        client.data.currentCluster = 0
        sendMessage(client, new consoleEmbed()
            .setTitle('Mất kết nối với máy chủ')
            .setDescription(
                `**Thông tin chi tiết:**\n` +
                `> Máy chủ: ${client.config.minecraft.server.ip}\n` +
                `> Lý do mất kết nối: ${reason}\n` +
                `> Tổng thời gian online: ${ms(Date.now() - (client.data.loginAt || Date.now()))}\n` +
                `> Kết nối lại sau: ${ms(client.config.minecraft.server.reconnectTimeout)}`
            )
            .setColor('Red')
        )
    })