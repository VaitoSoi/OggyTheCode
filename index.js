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

client1.slash = new Collection()
client1.message = new Collection()
client1.aliases = new Collection()
client1.type = 'client_1'
client1.client2 = client2
client1.num = '1'
client1.setMaxListeners(10)

client2.slash = new Collection()
client2.message = new Collection()
client2.aliases = new Collection()
client2.type = 'client_2'
client2.client1 = client1
client2.num = '2'
client2.setMaxListeners(10)

client1.executed = false
client1.mc_timeout = 0
/**
 * @param {Client} client1
 * @param {Client} client2
 */
client1.start_mc = (client1, client2) => {
    const MessageEmbed = require('discord.js').MessageEmbed
    const util = require('minecraft-server-util')
    const send = require('./minecraft/modules/sendChat')
    const color = require('./minecraft/modules/color.json')
    const sendErr = (e) => {
        send(client1, client2, new MessageEmbed()
            .setDescription(`Gặp lỗi khi lấy thông tin của \`${process.env.MC_HOST}\`\n` +
                `Lỗi: \`${e}\`\n` +
                `Kết nối lại sau 5m`)
            .setColor(color.red), true)
        client1.mc_timeout = setTimeout(() => client1.start_mc(client1, client2), 5 * 60 * 1000)
    }
    const execute = () => {
        client1.executed = true
        require('./minecraft/main')(client1, client2)
    }

    clearTimeout(client1.mc_timeout == 0 ? undefined : client1.mc_timeout)
    if (process.env.MC_HOST == 'localhost')
        util.statusLegacy(process.env.MC_HOST, Number(process.env.MC_PORT))
            .then(res => execute())
            .catch(e => sendErr(e))
    else
        util.status(process.env.MC_HOST, Number(process.env.MC_PORT))
        .then(res => execute())
        .catch(e => sendErr(e))
}


require('dotenv').config('./.env')


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
).then(() => console.log('[MONGOOSE]\x1b[32m CONNECTED\x1b[0m'))

client1.login(process.env.DISCORD_TOKEN_1)
    .catch((e) => { console.log(`[CLIENT_1] LOGIN ERROR: ${e}\x1b[0m`); process.exit(0) })
client2.login(process.env.DISCORD_TOKEN_2)
    .catch((e) => { console.log(`[CLIENT_2] LOGIN ERROR: ${e}\x1b[0m`); process.exit(0) })