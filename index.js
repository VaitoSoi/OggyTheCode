console.log('\n' +
    '*****************************************************\n' +
    '*                    OggyTheCode                    *\n' +
    '*         Official code of OggyTheBot#8216          *\n' +
    '*              Create by VaitoSoi#2220              *\n' +
    '*  GitHub: https://github.com/VaitoSoi/OggyTheCode  *\n' +
    '*****************************************************\n' +
    '\n')

const { Client, Collection } = require('discord.js')
const client1 = new Client({
    intents: 131071,
    partials: ['MESSAGE', 'REACTION', 'USER'],
    allowedMentions: {
        repliedUser: false,
        roles: false,
        users: false
    }
})
const client2 = new Client({
    intents: 131071,
    partials: ['MESSAGE', 'REACTION', 'USER'],
    allowedMentions: {
        repliedUser: false,
        roles: false,
        users: false
    }
})
/**
 * @param {Client} client1
 * @param {Client} client2
 */
const start_mc = (client1, client2) => {
    const MessageEmbed = require('discord.js').MessageEmbed
    const util = require('minecraft-server-util')
    const send = require('./minecraft/modules/chat').chat
    const color = require('./minecraft/modules/chat').colors
    const sendErr = (e, type) => {
        client1.executed = false
        send(client1, client2, new MessageEmbed()
            .setDescription(`Gặp lỗi ${type == 1 ? 'khi lấy thông tin của' : 'kết nối đến'} \`${process.env.MC_HOST}\`\n` +
                `Lỗi: \`${e}\`\n` +
                `Kết nối lại sau 5m`)
            .setColor(color.red), true)
        client1.mc_timeout = setTimeout(() => client1.start_mc(client1, client2), 5 * 60 * 1000)
    }
    const execute = () => {
        send(client1, client2, new MessageEmbed()
            .setDescription(`Đang kết nối với server....`)
            .setColor(color.yellow), true
        )
        client1.executed = true
        clearInterval(i)
        require('./minecraft/main')(client1, client2).catch(e => {
            console.log(e)
            sendErr(e, 2)
        })
    }
    const status = process.env.MC_HOST != 'localhost' ? util.status : util.statusLegacy
    let m = '.'
    let i = setInterval(() => {
        if (m.length < 5) m += '.'
        else m = '.'
        client1.user.setPresence({
            activities: [{ name: `Connecting${m}`, type: 'LISTENING' }],
            status: 'idle'
        })
        client2.user.setPresence({
            activities: [{ name: `Connecting${m}`, type: 'LISTENING' }],
            status: 'idle'
        })
    }, 5 * 1000)
    clearTimeout(client1.mc_timeout == 0 ? undefined : client1.mc_timeout)
    status(process.env.MC_HOST, Number(process.env.MC_PORT))
        .then(res => execute())
        .catch(e => sendErr(e, 1))
}


client1.slash = {
    commands: new Collection(),
    categories: {}
}
client1.message = {
    commands: new Collection(),
    categories: {},
    aliases: new Collection(),
}
client1.type = 'client_1'
client1.client2 = client2
client1.num = '1'
client1.setMaxListeners(15)
client1.executed = false
client1.mc_timeout = 0
client1.start_mc = start_mc

client2.slash = {
    commands: new Collection(),
    categories: {}
}
client2.message = {
    commands: new Collection(),
    categories: {},
    aliases: new Collection(),
}
client2.type = 'client_2'
client2.client1 = client1
client2.num = '2'
client2.setMaxListeners(15)


require('dotenv').config('./.env')
process.env.TZ = 'Asia/Bangkok'


require('./discord/handler/event')(client1)
require('./discord/handler/message')(client1)

require('./discord/handler/event')(client2)
require('./discord/handler/message')(client2)


require('mongoose').connect(
    process.env.MONGOOSE,
    {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    }
).then(() => console.log('[MONGOOSE] CONNECTED'))

client1.login(process.env.DISCORD_TOKEN_1)
    .catch((e) => { console.log(`[CLIENT_1] LOGIN ERROR: ${e}`); process.exit(0) })
client2.login(process.env.DISCORD_TOKEN_2)
    .catch((e) => { console.log(`[CLIENT_2] LOGIN ERROR: ${e}`); process.exit(0) })
/*
const express = require('express')
const app = express()
app.get('/status', (req, res) => res.send({ status: 'Online' }))
app.listen(process.env.EXPRESS_PORT ? Number(process.env.EXPRESS_PORT) : 8000)
console.log(`[EXPRESS] Listen on port ${process.env.EXPRESS_PORT ? Number(process.env.EXPRESS_PORT) : 8000}`)
*/