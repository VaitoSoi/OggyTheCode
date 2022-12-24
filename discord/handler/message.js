const fs = require('fs');
const { Client } = require('discord.js')

/**
 * Message handler
 * @param {Client} client 
 */

module.exports = (client) => {
    console.log(`[${client.type.toUpperCase()}] LOADING MESSAGE_COMMANDS`)

    fs.readdirSync('./discord/message_commands/').forEach((dir) => {
        client.message.categories[dir] = []
        fs.readdirSync(`./discord/message_commands/${dir}/`).filter(f => f.endsWith('.js')).forEach((file) => {
            const command = require(`../message_commands/${dir}/${file}`);
            if (!command.name) return
            if (command.name == 'setting') return
            client.message.commands.set(command.name, command)
            client.message.categories[dir].push(command.name)
            if (command.aliases
                && Array.isArray(command.aliases))
                command.aliases.forEach(
                    a => client.message.aliases.set(a, command.name)
                )
        })
    })

    console.log(`[${client.type.toUpperCase()}] LOADED MESSAGE_COMMANDS`)
}