const mineflayer = require('mineflayer')
    , { Client } = require('discord.js')
    , { readdirSync } = require('fs')

module.exports = {
    name: 'help',
    aliases: [],
    /**
    * 
    * @param {Client} client 
    * @param {mineflayer.Bot} minecraftbot 
    * @param {String[]} args 
    */
    run: async (client, minecraftbot, args) => {
        const commands = readdirSync(`./mc-commands/`).filter((file) =>
            file.endsWith(".js")
        );
        const cmds = commands.map((command) => {
            let file = require(`../mc-commands/${command}`);
            if (!file.name) return "Không tìm thấy lệnh.";
            let name = file.name.replace(".js", "");
            return `${name}`;
        });
        let str = ''
        for (let i = 0; i < cmds.length; i++) {
            str = str + ', ' + cmds[i]
        }
        minecraftbot.chat(`Tổng số lệnh: ${cmds.length} | Tất cả lệnh: ${str}.`)
    }
} 