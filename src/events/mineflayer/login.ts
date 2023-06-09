import { Cluster, EventBuilder, MineflayerEvents } from "../../index";
import { consoleEmbed, sendMessage } from "../../modules/message";

export default new EventBuilder()
    .setName(MineflayerEvents.Login)
    .setOnce(false)
    .setRun(function (client) {
        /*
        client.data.currentCluster++
        console.log(client.data.currentCluster)
        sendMessage(client, new consoleEmbed()
            .setTitle(`Đã chuyển qua cụm ${Cluster[client.data.currentCluster]}`)
            .setColor('Green')
        )
        */
    })