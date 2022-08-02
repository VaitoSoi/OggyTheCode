const util = require('minecraft-server-util')
    , mineflayer = require('mineflayer')
    , { Client } = require('discord.js')

module.exports = {
    name: 'server',
    aliases: [],
    /**
    * 
    * @param {Client} client 
    * @param {mineflayer.Bot} minecraftbot 
    * @param {String[]} args 
    */
    run: async (client, minecraftbot, args) => {
        util.status(process.env.MC_IP).then(async (response) => {
            minecraftbot.chat(`Total Players: ${response.players.online}/${response.players.max} | TPS: ${minecraftbot.getTps()}`);
        });
    }
}