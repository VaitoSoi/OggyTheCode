import { MinecraftCommandBuilder } from "../../index";

export default new MinecraftCommandBuilder()
    .setName('ping')
    .setRun(function (args, bot) {
        bot.chat(`Ping: ${bot.player.ping}`)
    })