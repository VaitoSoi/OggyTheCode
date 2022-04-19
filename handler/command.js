const { readdirSync } = require('fs');
const ascii = require('ascii-table');
const  { Client } = require('discord.js')

let table = new ascii('Message Command');
table.setHeading("Name", "Status");

/**
 * 
 * @param {Client} client 
 */
module.exports = async(client) => {
    let  num = 0
    readdirSync("./commands/").forEach(dir => {
        const commands = readdirSync(`./commands/${dir}/`).filter(file => file.endsWith(".js"));
        for (let file of commands) {
            let pull = require(`../commands/${dir}/${file}`);

            if (pull.name) {
                client.commands.set(pull.name, pull);
                table.addRow(file, '✔ Ready');
                num++
            } else {
                table.addRow(file, '✖ Not ready');
                continue;
            }

            if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach(alias => client.aliases.set(alias, pull.name));
        }
    });

    console.log(`Đã load ${num} MESSAGE_COMMANDS!\n` + table.toString());
}