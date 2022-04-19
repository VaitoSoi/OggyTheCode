/**
 * 
 * Discord Bot
 * OggyTheBot Code
 * Chủ nhân: VaitoSoi#2220
 * Bản quyền thuộc về VaitoSoi#2220
 * 
 */

/**
 * 
 * ^ Thông tin
 * 
 * v Khai báo
 * 
 */

const { Client, Collection } = require("discord.js");
const client = new Client({
    intents: 32767,
    partials: ["MESSAGE", "CHANNEL", "REACTION"],
    allowedMentions: {
        parse: ['users'],
        repliedUser: false
    },
    disableEveryone: true,
    disableMentions: 'everyone'
});

module.exports.client = client

// const { Player } = require('discord-player')
const { readdirSync } = require('fs')
/*
const player = new Player(client, {
    ytdlDownloadOptions: { filter: "audioonly" }
});

client.player = player;
module.exports.player = player
*/
require('dotenv').config('./.env')

/**
 * 
 * ^ Khai báo
 * 
 * v Handler / Kết nối với Mongoose
 * 
 */

client.commands = new Collection();
client.aliases = new Collection();
client.categories = readdirSync("./commands/");
client.interactions = new Collection();

require('./util/mongooseConnect')(require('mongoose'))
require('./handler/event')(client)
require('./handler/command')(client)

/**
 * 
 * ^ Handler / Kết nối vối Mongoose
 * 
 * v Login vào tài khoản
 * 
 */

client.login(process.env.TOKEN).catch(err => console.log(err));

