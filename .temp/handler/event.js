const fs = require('fs')
const ascii = require('ascii-table');

let table = new ascii('Event');
table.setHeading("Name", "Status", "Player");

module.exports = (client, player) => {
    const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const event = require(`../events/${file}`);
        if (!event.name) {
            if (event.player && event.player === true) {
                table.addRow(file, '✖ Not Ready', '✔');
            } else if (event.player || event.player === false) {
                table.addRow(file, '✖ Not Ready', '');
            }
        } else {
            if (event.player && event.player === true) {
                table.addRow(file, '✔ Ready', '✔');
                if (event.once) {
                    player.once(event.name, (...args) => event.run(...args));
                } else {
                    player.on(event.name, (...args) => event.run(...args));
                }
            } else if (!event.player || event.player === false) {
                table.addRow(file, '✔ Ready', '');
                if (event.once) {
                    client.once(event.name, (...args) => event.run(...args));
                } else {
                    client.on(event.name, (...args) => event.run(...args));
                }
            }
        }
    }
    console.log(table.toString())
}