const mineflayer = require('mineflayer')
    , { Client } = require('discord.js')

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
        minecraftbot.chat(`Tag: ${client.user.tag} | Author: ${client.application.owner.tag} | Guild(s): ${client.guilds.cache.size} | User: ${client.users.cache.size}`)
    }
} 