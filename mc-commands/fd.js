const mineflayer = require('mineflayer')
    , { Client } = require('discord.js')

module.exports = {
    name: 'fd',
    aliases: [],
    /**
    * 
    * @param {Client} client 
    * @param {mineflayer.Bot} minecraftbot 
    * @param {String[]} args 
    */ 
    run: async(client, minecraftbot, args, username) => {
        const db = require('../models/kd')
        , data = await db.findOne({ username: username })
        if (!data) return minecraftbot.chat(`/msg ${username} Không tìm thấy data!!`) 
        else minecraftbot.chat(`/msg ${username} ${data.firstdeath}`)
    }
} 