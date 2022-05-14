const { readdirSync } = require('fs')
    , ascii = require('ascii-table')
    , { Client, MessageEmbed } = require('discord.js')
    , { REST } = require('@discordjs/rest')
    , { Routes } = require('discord-api-types/v9')

// let table = new ascii('Slash Command');
// table.setHeading("Name", "Status", "Loaded");

/**
 * 
 * @param {Client} client 
 * @param {String} str
 */
module.exports = async (client, str) => {
    console.log(str)
    let guild = client.guilds.cache.get(process.env.GUILD_ID)
        , num = 0
        , command
        , rcommand = []
        , token = ''
        , err = 0
    if (str === 'client2') token = process.env.TOKEN_2
    else token = process.env.TOKEN_1

    if (guild) {
        command = guild.commands
    } else {
        command = client.application.commands
    }
    const commands = readdirSync(`./commands-interaction/`).filter(file => file.endsWith(".js"));
    for (let file of commands) {
        let pull = require(`../commands-interaction/${file}`);

        if (pull.data) {
            num++
            client.interactions.set(pull.data.name, pull);
            rcommand.push(pull.data.toJSON())
            //table.addRow(file, '✔ Ready');
        } else {
            err++
            //table.addRow(file, '✖ Not ready');
            continue;
        }
    }

    console.log(`[${str/*.toUpperCase()*/}] ${num} SLASH_COMMANDS LOAD.\n[${str/*.toUpperCase()*/}] ${err} SLASH_COMMAND CAN'T LOAD.`/* + table.toString()*/);

    const rest = new REST({
        version: '9'
    }).setToken(token)

    try {
        await rest.put(Routes.applicationCommands(client.user.id), {
            body: rcommand
        })
        console.log(`[${str.toUpperCase()}] SLASH_COMMAND REGISTER`)
    } catch (e) {
        console.log(`[${str.toUpperCase()}] REGISTER ERROR: ${e}`)
    }
}