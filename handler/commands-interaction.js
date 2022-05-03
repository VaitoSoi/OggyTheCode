const { readdirSync } = require('fs')
    , ascii = require('ascii-table')
    , { Client, MessageEmbed } = require('discord.js')
    , { REST } = require('@discordjs/rest')
    , { Routes } = require('discord-api-types/v9')

let table = new ascii('Slash Command');
table.setHeading("Name", "Status", "Loaded");

/**
 * 
 * @param {Client} client 
 */
module.exports = async(client) => {
    let guild = client.guilds.cache.get(process.env.GUILD_ID)
        , num = 0
        , command
        , rcommand = []

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
            table.addRow(file, '✔ Ready');
        } else {
            table.addRow(file, '✖ Not ready');
            continue;
        }
    }

    console.log(`Đã load ${num} SLASH_COMMANDS!\n` + table.toString());

    const rest = new REST({
        version: '9'
    }).setToken(process.env.TOKEN)

    const register = async () => {
        try {
            await rest.put(Routes.applicationCommands(client.user.id), {
                body: rcommand
            })
            console.log('Đã load slash command!')
        } catch (e) {
            console.log(e)
        }
    }

    register()

}