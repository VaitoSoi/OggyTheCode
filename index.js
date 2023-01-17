console.log(
    ".---------------------------------------------------.\n" +
    "|                    OggyTheCode                    |\n" +
    "|         Official code of OggyTheBot#8210          |\n" +
    "|              Create by VaitoSoi#2220              |\n" +
    "|            Supporter: toquyen8928#9463            |\n" +
    "|  GitHub: https://github.com/VaitoSoi/OggyTheCode  |\n" +
    "'---------------------------------------------------'\n"
)
const { Client, Collection } = require('discord.js')
const ms = require('ms')
const client1 = new Client({
    intents: 131071,
    partials: ['MESSAGE', 'REACTION', 'USER'],
    allowedMentions: {
        repliedUser: false,
        roles: [],
        users: []
    }
})
const client2 = new Client({
    intents: 131071,
    partials: ['MESSAGE', 'REACTION', 'USER'],
    allowedMentions: {
        repliedUser: false,
        roles: [],
        users: []
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
    let retry = 0
    /**
     * @param {String} e 
     * @param {Number} type 
     */
    const sendErr = (e, type, reconnect) => {
        client1.executed = false;
        let time = retry < 10 ? (reconnect ?? '5m') : '15m', err = '';
        switch (type) {
            case 1: err = `Gặp lỗi khi lấy thông tin của \`${process.env.MC_HOST}\``; break;
            case 2: err = `Gặp lỗi kết nối đến \`${process.env.MC_HOST}\``; break;
            case 3: err = `Các client chưa sẵn sàng`; break;
            default: err = `Lỗi bất định`; break;
        }
        if (retry <= 10) send(client1, client2, new MessageEmbed()
            .setDescription(`${err}\n` +
                `Lỗi: \`${e}\`\n` +
                `Kết nối lại sau ${time}`)
            .setColor(color.red), true);
        client1.mc_timeout = setTimeout(() => { retry++; execute() }, ms(time));
    }
    const execute = () => {
        if (!client1.isReady() || !client2.isReady()) return sendErr('clients are not ready', 3, '30s');
        send(client1, client2, new MessageEmbed()
            .setDescription(`Đang kết nối với server....`)
            .setColor(color.yellow), true
        );
        client1.executed = true;
        retry = 0;
        clearInterval(status_interval);
        try { require('./minecraft/main')(client1, client2, true) } catch (e) { console.log(e); sendErr(e, 2) }
    }
    const status = process.env.MC_HOST != 'localhost' ? util.status : util.statusLegacy;
    let m = '.';
    const status_interval = setInterval(() => {
        if (m.length < 5) m += '.'
        else m = '.';
        client1.user?.setPresence({
            activities: [{ name: `Connecting${m}`, type: 'LISTENING' }],
            status: 'idle'
        });
        client2.user?.setPresence({
            activities: [{ name: `Connecting${m}`, type: 'LISTENING' }],
            status: 'idle'
        });
    }, 5 * 1000);
    clearTimeout(client1.mc_timeout == 0 ? undefined : client1.mc_timeout);
    status(process.env.MC_HOST, Number(process.env.MC_PORT))
        .then(() => execute())
        .catch(e => sendErr(e, 1));
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

module.exports = { client1, client2 }

require('dotenv').config('./.env')
process.env.TZ = 'Asia/Bangkok'
process.env.started = false

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
require('./express/main')()

client1.login(process.env.DISCORD_TOKEN_1)
    .catch((e) => { console.log(`[CLIENT_1] LOGIN ERROR: ${e}`); process.exit(0) })
client2.login(process.env.DISCORD_TOKEN_2)
    .catch((e) => { console.log(`[CLIENT_2] LOGIN ERROR: ${e}`); process.exit(0) })