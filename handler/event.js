const fs = require('fs')
    , ascii = require('ascii-table')
    , { Client, MessageEmbed } = require('discord.js')

let table = new ascii('Event');
table.setHeading("Name", "Status");

/**
 * 
 * @param {Client} client 
 */
module.exports = async (client) => {
    let eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'))
        , num = 0

    for (const file of eventFiles) {
        const event = require(`../events/${file}`);
        if (!event.name) {
            table.addRow(file, '✖ Not Ready');
        } else {
            num++
            table.addRow(file, '✔ Ready');
            if (event.once) {
                client.once(event.name, (...args) => event.run(...args));
            } else {
                client.on(event.name, (...args) => event.run(...args));
            }
        }
    }
    console.log(`Đã load ${num} EVENTS!\n` + table.toString())
}