/**
 * 
 * Discord Bot
 * OggyTheBot#8210 Code
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

const { Client, Collection, MessageEmbed } = require("discord.js")
    , client = new Client({
        intents: 32767,
        partials: ["MESSAGE", "CHANNEL", "REACTION"],
        allowedMentions: {
            parse: ['users'],
            repliedUser: false
        },
        disableEveryone: true,
        disableMentions: 'everyone'
    })
    , client2 = new Client({
        intents: 32767,
        partials: ["MESSAGE", "CHANNEL", "REACTION"],
        allowedMentions: {
            parse: ['users'],
            repliedUser: false
        },
        disableEveryone: true,
        disableMentions: 'everyone'
    })
    , env = process.env
    , { readdirSync } = require('fs')
    , ms = require('ms')

module.exports.client = client
module.exports.client2 = client2

// const { Player } = require('discord-player')
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
// Mongoose
require('./util/mongooseConnect')(require('mongoose'))

// Client 1
client.commands = new Collection();
client.aliases = new Collection();
client.categories = readdirSync("./commands/");
client.interactions = new Collection();
client.mccommands = new Collection();

async function reg() {
    console.log('\n--------------------------------\n')
    await require('./handler/event')(client, 'client1')
    await require('./handler/command')(client, 'client1')
    console.log('\n--------------------------------\n')
}

// Client 2
client2.commands = new Collection();
client2.aliases = new Collection();
client2.categories = readdirSync("./commands/");
client2.interactions = new Collection();
// client2.mccommands = new Collection();
async function reg2() {
    await require('./handler/event')(client2, 'client2')
    await require('./handler/command')(client2, 'client2')
    // require('./handler/mc-command')(client2)
    console.log('\n--------------------------------\n')
}
// Register
reg().then(() => reg2().then(async () => {
    await require('./handler/mc-command')(client, 'client1')
    console.log('\n--------------------------------\n')
}))
/**
 * 
 * ^ Handler / Kết nối vối Mongoose
 * 
 * v Login vào tài khoản
 * 
 */

// Client 1
client.login(env.TOKEN_1).catch(err => console.log(err));

// Client 2
client2.login(env.TOKEN_2).catch(err => console.log(err))

/**
 * 
 * ^ Login vào tài khoản
 * 
 * v Event rateLimit và error
 * 
 */
// Client 1

client.on('rateLimit', async (rateLimit) => {
    const channel = await client.channels.fetch(env.RATELIMIT_CHANNEL)
    if (!channel || !channel.isText() || !channel.guild) return
    channel.send({
        embeds: [
            new MessageEmbed()
                .setAuthor({
                    name: '🛑 RateLimit Error!!',
                    iconURL: client.user.displayAvatarURL()
                })
                .setDescription(`**Path:** \`${rateLimit.path}\`\n**Method:** \`${rateLimit.method}\`\n**Limit:** \`${rateLimit.limit}\`\n**Timeout:** \`${rateLimit.timeout}\`\n**Route:** \`${rateLimit.route}\`\n**Global:** \`${rateLimit.global}\``)
                .setTimestamp().setFooter({
                    text: `${client.user.tag}`
                })
                .setColor('RED')
        ]
    })
})

client.on('error', async (error) => {
    const channel = await client.channels.fetch(env.ERROR_CHANNEL)
    if (!channel || !channel.isText() || !channel.guild) return
    channel.send({
        embeds: [
            new MessageEmbed()
                .setAuthor({
                    name: '🛑 Error!!',
                    iconURL: client.user.displayAvatarURL()
                })
                .setDescription('**Error:** ```' + error + '```')
                .setTimestamp()
                .setFooter({
                    text: `${client.user.tag}`
                })
                .setColor('DARK_RED')
        ]
    })
})

client.on('ready', async () => {
    const reg = require('./handler/commands-interaction')
    await reg(client, 'client1').then(() => timeout())
    console.log(`[CLIENT1] ${client.user.tag} is ready!`)
    console.log('\n--------------------------------\n')
    let index = 0
        , arraystatus = require('./info/statusArray')
        , arraystatus2 = require('./info/statusArray_2')
    setInterval(() => {
        if (index === arraystatus.length) index = 0;
        const status = arraystatus[index];
        client.user.setActivity(status);
        index++;
    }, ms('5sec'))
    /**
    * 
    * Minecraft Bot
    * 
    */

    async function timeout() {
        setTimeout(async () => {
            if (client2.isReady()) {
                await reg(client2, 'client2')
                console.log(`[CLIENT2] ${client2.user.tag} is ready!`)
                setInterval(() => {
                    if (index === arraystatus2.length) index = 0;
                    const status = arraystatus2[index];
                    client2.user.setActivity(status);
                    index++;
                }, ms('5sec'))
                console.log('\n--------------------------------\n')
                require('./minecraft/minecraftbot').createBot(client, client2)
                console.log('[MINECRAFT] BOT LOADED')
            } else timeout()
        }, 500);
    }
})

// Client 2


client2.on('rateLimit', async (rateLimit) => {
    const channel = await client.channels.cache.get(env.RATELIMIT_CHANNEL)
    if (!channel || !channel.isText() || !channel.guild) return
    channel.send({
        embeds: [
            new MessageEmbed()
                .setAuthor({
                    name: '🛑 RateLimit Error!!',
                    iconURL: client.user.displayAvatarURL()
                })
                .setDescription(`**Path:** \`${rateLimit.path}\`\n**Method:** \`${rateLimit.method}\`\n**Limit:** \`${rateLimit.limit}\`\n**Timeout:** \`${rateLimit.timeout}\`\n**Route:** \`${rateLimit.route}\`\n**Global:** \`${rateLimit.global}\``)
                .setTimestamp()
                .setFooter({
                    text: `${client2.user.tag}`
                })
                .setColor('RED')
        ]
    })
})

client2.on('error', async (error) => {
    const channel = await client.channels.fetch(env.ERROR_CHANNEL)
    if (!channel || !channel.isText() || !channel.guild) return
    channel.send({
        embeds: [
            new MessageEmbed()
                .setAuthor({
                    name: '🛑 Error!!',
                    iconURL: client.user.displayAvatarURL()
                })
                .setDescription('**Error:** ```' + error + '```')
                .setTimestamp().setFooter({
                    text: `${client2.user.tag}`
                })
                .setColor('DARK_RED')
        ]
    })
})