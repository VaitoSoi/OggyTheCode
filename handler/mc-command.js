const { readdirSync } = require('fs');
const ascii = require('ascii-table');
const { Client } = require('discord.js')

let table = new ascii('Minecraft Command');
table.setHeading("Name", "Status");

/**
 * 
 * @param {Client} client 
 */
module.exports = async (client) => {
    let num = 0
    , err = 0
    const commands = readdirSync(`./mc-commands/`).filter(file => file.endsWith(".js"));
    for (let file of commands) {
        let pull = require(`../mc-commands/${file}`);

        if (pull.name) {
            client.mccommands.set(pull.name, pull);
            table.addRow(file, '✔ Ready');
            num++
        } else {
            table.addRow(file, '✖ Not ready');
            continue;
        }
    }

    console.log(`[MINECRAFT] ${num} MINECRAFT_COMMANDS LOADED!\n[MINECRAFT] ${err} MINECRAFT_COMMANDS CAN'T LOAD!`/* + table.toString() */);
}