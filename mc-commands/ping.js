const mineflayer = require('mineflayer')
    , { Client } = require('discord.js')

module.exports = {
    name: 'ping',
    aliases: [],
    /**
    * 
    * @param {Client} client 
    * @param {mineflayer.Bot} minecraftbot 
    * @param {String[]} args 
    */ 
    run: async(client, minecraftbot, args) => {
        minecraftbot.chat(`WS-Ping: ${client.ws.ping} | Bot-Ping: ${minecraftbot.player.ping}`)
    }
} 