const mineflayer = require('mineflayer')
    , { Client } = require('discord.js')
    , ms = require('ms')

module.exports = {
    name: 'botinfo',
    aliases: [],
    /**
    * 
    * @param {Client} client 
    * @param {mineflayer.Bot} minecraftbot 
    * @param {String[]} args 
    */ 
    run: async(client, minecraftbot, args) => {
        minecraftbot.chat(`Name: ${minecraftbot.player.displayName} | Uptime: ${ms(client.uptime)}`)
    }
} 