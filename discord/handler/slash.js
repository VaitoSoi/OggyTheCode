const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('node:fs');
const { Client } = require('discord.js')

/**
 * Slash handler
 * @param {Client} client 
 */
module.exports = (client) => {
    const commands = [];
    const token = process.env[`DISCORD_TOKEN_${client.num}`]

    fs.readdirSync('./discord/slash_commands/').forEach((dir) => {
        fs.readdirSync(`./discord/slash_commands/${dir}/`).filter(f => f.endsWith('.js')).forEach((file) => {
            const command = require(`../slash_commands/${dir}/${file}`);
            if (!command || !command.data) return
            if (dir == 'server') command.server = true
            if (command.data.name == 'admin' || command.admin == true) command.admin = true
            if (command.admin == true && client.type == 'client_2') return
            command.data.setDMPermission(false)
            commands.push(command.data.toJSON())
            client.slash.set(command.data.name, command)
        })
    })

    const rest = new REST({ version: '9' }).setToken(token);

    (async () => {
        try {
            console.log(`[${client.type.toUpperCase()}]\x1b[33m LOADING SLASH_COMMANDS\x1b[0m`);

            await rest.put(
                Routes.applicationCommands(client.user.id),
                { body: commands },
            );

            console.log(`[${client.type.toUpperCase()}]\x1b[32m LOADED SLASH_COMMANDS\x1b[0m`);
        } catch (error) {
            console.error(error)
            console.log(`[${client.type.toUpperCase()}]\x1b[31m LOAD ERROR: ${error}\x1b[0m`);
        }
    })();
}