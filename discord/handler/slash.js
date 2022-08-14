const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('node:fs');
const { Client } = require('discord.js')

/**
 * Slash handler
 * @param {Client} client 
 */
module.exports = (client) => {
    console.log(`[${client.type.toUpperCase()}] LOADING SLASH_COMMANDS`);
    const commands = [];
    const token = process.env[`DISCORD_TOKEN_${client.num}`]

    fs.readdirSync('./discord/slash_commands/').forEach((dir) => {
        client.slash.categories[dir] = []
        fs.readdirSync(`./discord/slash_commands/${dir}/`).filter(f => f.endsWith('.js')).forEach((file) => {
            const command = require(`../slash_commands/${dir}/${file}`);
            if (!command || !command.data) return
            if (command.admin == true && client.type == 'client_2') return
            command.data.setDMPermission(false)
            commands.push(command.data.toJSON())
            client.slash.commands.set(command.data.name, command)
            client.slash.categories[dir].push(command.data.name)
        })
    })

    const rest = new REST({ version: '9' }).setToken(token);

    (async () => {
        try {

            await rest.put(
                Routes.applicationCommands(client.user.id),
                { body: commands },
            );

            console.log(`[${client.type.toUpperCase()}] LOADED SLASH_COMMANDS`);
        } catch (error) {
            console.error(error)
            console.log(`[${client.type.toUpperCase()}] LOAD ERROR: ${error}`);
        }
    })();
}