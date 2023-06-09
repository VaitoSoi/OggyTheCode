import { EventBuilder, MineflayerEvents } from "../..";
import { consoleEmbed, sendMessage } from "../../modules/message";

export default new EventBuilder()
    .setName(MineflayerEvents.Kicked)
    .setOnce(true)
    .setRun((client, reason: string, logined: boolean): void =>  
        void sendMessage(client, new consoleEmbed()
            .setTitle(`Bị kick khi khi ${logined ? 'đang trong server' : 'đăng nhập vào server'}`)
            .setDescription(
                '**Thông tin chi tiết:**\n' +
                `> Lý do: ${reason.toString()}`
            )
            .setColor('Red')
        )
    )