const fs = require('fs')
    , ascii = require('ascii-table')
    , { Client, MessageEmbed } = require('discord.js')

//let table = new ascii('Event');
//table.setHeading("Name", "Status");

/**
 * 
 * @param {Client} client 
 * @param {String} str
 */
module.exports = async (client, str) => {
    let eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'))
        , num = 0
        , err = 0
    for (const file of eventFiles) {
        const event = require(`../events/${file}`);
        if (!event.name) {
            err++
            //table.addRow(file, '✖ Not Ready');
        } else {
            num++
            //table.addRow(file, '✔ Ready');
            if (event.once) {
                client.once(event.name, (...args) => event.run(...args));
            } else {
                client.on(event.name, (...args) => event.run(...args));
            }
        }
    }
    console.log(`[${str.toUpperCase()}] ${num} EVENTS LOADED\n[${str.toUpperCase()}] EVENT CAN'T LOAD`/* + table.toString()*/ )
}