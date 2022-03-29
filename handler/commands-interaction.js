const { readdirSync } = require('fs');
const ascii = require('ascii-table');
const { Client } = require('discord.js')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')

let table = new ascii('Slash Command');
table.setHeading("Name", "Status", "Loaded");

/**
 * 
 * @param {Client} client 
 */
module.exports = (client) => {
    const guild = client.guilds.cache.get(process.env.GUILD_ID)

    let command
    let rcommand = []

    if (guild) {
        command = guild.commands
    } else {
        command = client.application.commands
    }
    const commands = readdirSync(`./commands-interaction/`).filter(file => file.endsWith(".js"));

    for (let file of commands) {
        let pull = require(`../commands-interaction/${file}`);

        if (pull.data) {
            client.interactions.set(pull.data.name, pull);
            rcommand.push(pull.data.toJSON())
            table.addRow(file, '✔ Ready', '✔ Loaded');
        } else {
            table.addRow(file, '✖ Not ready', '✖ Not loaded');
            continue;
        }
    }

    console.log(table.toString());

    const rest = new REST({
        version: '9'
    }).setToken(process.env.TOKEN)

    const register = async () => {
        try {
            await rest.put(Routes.applicationGuildCommands(client.user.id, process.env.GUILD_ID), {
                body: rcommand
            })
            console.log('Đã load slash command!')
        } catch (e) {
            console.log(e)
        }
    }

    register()
}