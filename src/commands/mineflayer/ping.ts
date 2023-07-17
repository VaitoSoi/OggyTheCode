import { MineflayerCommandBuilder } from "../../index";

export default new MineflayerCommandBuilder()
    .setName('ping')
    .setRun(function (args, bot) {
        bot.chat(`Ping: ${bot.player.ping}`)
    })