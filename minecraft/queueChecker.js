const mineflayer = require('mineflayer')
const ms = require('ms')
const { Client, MessageEmbed } = require('discord.js')
let connect = 0
let click = false
let logout = false
let distime = 30
let queueData = {}
let collect = false
const { env } = require('process')
const info = {
	name: env.CHECKER_NAME,
	pass: env.CHECKER_PASS,
	ip: env.CHECKER_IP,
	version: env.CHECKER_VERSION,
    channel: env.CHECKER_CHANNEL
}

/**
 * 
 * @param {Client} client 
 */

function checker(client) {

    const channel = client.channels.cache.get(info.channel)

    const disconnectEmbed = new MessageEmbed()
        .setTitle('Đang ngắt kết nối đến server `' + info.ip + '`.....')
        .setColor('#f00c0c')// Đỏ

    const bot = mineflayer.createBot({
        username: info.name,
        host: info.ip,
        version: info.version
    })
    let move = 0

    bot.on('login', () => {
        move++
        logout = false
        let server = ''
        if (move == 1) server = 'Pin'
        else if (move == 2) server = 'Queue'
        else if (move == 3) {
            server = 'Main';
            move = 0;
        }
        channel.send({
            embeds: [
                new MessageEmbed()
                    .setTitle('Đã kết nối với server ' + server)
                    .setColor('#07fc03') // Xanh lá
            ]
        })
        if (server.toLowerCase() === 'main') {
            const current = 0
            channel.send({
                embeds: [
                    new MessageEmbed()
                        .setTitle('Ngắt kết nối sau: ' + distime + 's' + '\n' + 'Với queue là: ' + current)
                        .setColor('#ffe021') // Vàng
                ]
            })
            queueData = {
                queue: current,
                timecode: Math.floor(Date.now() / 1000),
                restart: true,
            }
            setTimeout(() => {
                channel.send({
                    embeds: [
                        disconnectEmbed
                    ]
                })
                bot.end('Bot ngắt kết nối với queue là: ' + current)
            }, ms(`${distime}s`))
        }
    })

    bot.on('windowOpen', async (window) => {
        if (Number(window.slots.length) == 63 || Number(window.slots.length) == 62) {
            channel.send({
                embeds: [
                    new MessageEmbed()
                        .setTitle('Cửa sổ `Chuyển Server` mở')
                        .setColor('#07fc03') // Xanh lá
                ]
            })
            bot.simpleClick.leftMouse(10);
            channel.send({
                embeds: [
                    new MessageEmbed()
                        .setTitle('Đã click vào cửa sổ `Chuyển Server`')
                        .setColor('#07fc03') // Xanh lá
                ]
            })
        } else {
            channel.send({
                embeds: [
                    new MessageEmbed()
                        .setTitle('Cửa sổ `Nhập PIN` mở')
                        .setColor('#07fc03') // Xanh lá
                ]
            })
            click = true;

            window.requiresConfirmation = false;

            const pass = info.pass.split(' ')

            const p1 = pass[0];
            const p2 = pass[1];
            const p3 = pass[2];
            const p4 = pass[3];

            bot.simpleClick.leftMouse(Number(p1));
            bot.simpleClick.leftMouse(Number(p2));
            bot.simpleClick.leftMouse(Number(p3));
            bot.simpleClick.leftMouse(Number(p4));

            channel.send({
                embeds: [
                    new MessageEmbed()
                        .setTitle('Đã nhập mật khẩu')
                        .setColor('#07fc03') // Xanh lá
                ]
            })
        }
    });

    bot.on('end', (reason) => {
        collect = false
        logout = true
        let reconnect = 5
        channel.send({
            embeds: [
                new MessageEmbed()
                    .setTitle('Bot đã bị ngắt kết nối tại: ' + info.ip + '\n' + 'Lý do: `' + reason.toString() + '`\n' + 'Kết nối lại sau: ' + reconnect + 'm')
                    .setColor('#f00c0c')
            ]
        })
        setTimeout(() => {
            checker(client);
            channel.send({
                embeds: [
                    new MessageEmbed()
                        .setTitle('Đang kết nối lại với ' + info.ip + '....')
                        .setColor('#ffe021')
                ]
            })
        }, ms(`${reconnect}m`))
    })
    bot.on('messagestr', (msg) => {
        channel.send({
            embeds: [
                new MessageEmbed()
                    .setDescription(msg)
                    .setColor('#09bced') // Tím
            ]
        })
    })
    bot.on('message', async (msg) => {
        const str = msg.getText().trim()
        const normalChat = /<(.+)>(.+)/
        const errChat = /Could not connect to a default or fallback server, please try again later: (.+)/
        const errChat2 = /Exception Connecting:ReadTimeoutException : (.+)/
        if (str.split(' ').slice(-1).join(' ') === 'Vị trí hàng chờ: ') {
            console.log(queueChat.exec(str))
            const current = Number(str.split(' ')[5])
            console.log(current)
            if (isNaN(current)) return
            const distimeEmbed = new MessageEmbed()
                .setTitle('Ngắt kết nối sau: ' + distime + 's' + '\n' + 'Với queue là: ' + current)
                .setColor('#ffe021') // Vàng

            channel.send({
                embeds: [
                    distimeEmbed
                ]
            })
            setTimeout(() => {
                channel.send({
                    embeds: [
                        disconnectEmbed
                    ]
                })
                bot.end('Bot ngắt kết nối với queue là: ' + current)
            }, ms(`${distime}s`))
            if (collect === true) return
            collect = true
            queueData = {
                queue: current,
                timecode: Math.floor(Date.now() / 1000),
                restart: false,
            }

        } else if (normalChat.test(msg.toString())) {
            if (collect === true) return
            const current = 0
            const distimeEmbed = new MessageEmbed()
                .setTitle('Ngắt kết nối sau: ' + distime + 's' + '\n' + 'Với queue là: ' + current)
                .setColor('#ffe021') // Vàng

            channel.send({
                embeds: [
                    distimeEmbed
                ]
            })
            setTimeout(() => {
                channel.send({
                    embeds: [
                        disconnectEmbed
                    ]
                })
                bot.end('Bot ngắt kết nối với queue là: ' + current)
            }, ms(`${distime}s`))
            collect = true
            queueData = {
                queue: current,
                timecode: Math.floor(Date.now() / 1000),
                restart: false,
            }
        } else if (msg.getText().toLowerCase().trim() === 'dùng lệnh/2y2c  để vào server.') {
            connect++;

            function connectServer(click, logout, bot) {
                if (click === true && logout === false) {
                    bot.chat('/2y2c');
                    channel.send({
                        embeds: [
                            new MessageEmbed()
                                .setTitle('Đã nhập `/2y2c`')
                                .setColor('#07fc03') // Xanh lá
                        ]
                    })
                }
            }

            if (connect == 2) {
                connectServer(click, logout, bot);
            }
            else if (connect < 2 && connect > 2 && connect < 8) {
                return;
            }
            else if (connect = 8) {
                connectServer(click, logout, bot);
            }
            else if (connect > 8) {
                bot.end('Không thể kết nối với server `Hàng chờ`');
            }
        } else if (str === 'The main server is down. We will be back soon!' || errChat.test(str) || errChat2.test(str)) {
            channel.send({
                embeds: [
                    disconnectEmbed
                ]
            })
            const current = 0
            bot.end('Server Restart')

            if (collect === true) return
            collect = true
            queueData = {
                queue: current,
                timecode: Math.floor(Date.now() / 1000),
                restart: false,
            }
        }
    })

    const prefixSchema = require('../models/prefix');
    const p = process.env.PREFIX
    client.on('messageCreate', async (message) => {
        if (!message.guild) return;
        const data = await prefixSchema.findOne({
            GuildId: message.guild.id,
        });
        const blacklist = require('../models/blacklist');
        let prefix;
        if (data) {
            prefix = data.Prefix;
        }
        else {
            prefix = p;
        }
        const data2 = await blacklist.findOne({ id: message.author.id })
        if (data2) return
        if (!message.content.startsWith(prefix)) return;
        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const cmd = args.shift().toLocaleLowerCase();
        if (cmd.length === 0) return;
        if (cmd === '2y2c' || cmd === '2y2c-queue' || cmd === 'queue-2y2c' || cmd === 'hangcho-2y2c') {
            const queueEmbed = new MessageEmbed()
                .setAuthor({
                    name: 'Hàng chờ tính theo QueueChecker',
                    iconURL: client.user.displayAvatarURL()
                })
            if (!queueData || !queueData.queue) {
                queueEmbed
                    .setColor('#f00c0c')
                    .setTitle('Không tìm thấy data !')
            } else {
                queueEmbed
                    .setColor('RANDOM')
                    .addFields({
                        name: 'Hàng chờ: ' + queueData.queue,
                        value: 'Restart: ' + queueData.restart + '\n' + 'Dữ liệu ghi vào lúc: \n<t:' + queueData.timecode + ':T> | <t:' + queueData.timecode + ':d> (<t:' + queueData.timecode + ':R>)'
                    })
            }

            let send = false
            let sendtime = 0
            message.channel.createMessageCollector().on('collect', (msg) => {
                sendtime++
                if (send === true || sendtime != 1) return
                if (msg.author.id !== client.user.id) return
                message.channel.send({
                    embeds: [queueEmbed]
                })
                send = true
            })
        }
    })
    client.on('interactionCreate', async (interaction) => {
        if (interaction.isCommand()) {
            if (!interaction.commandName) return
            if (interaction.commandName === '2y2c') {
                const data = await require('../models/blacklist').findOne({ id: interaction.user.id })
                let ava = Boolean;
                const command = client.interactions.get(interaction.commandName)
                if (!data) {

                    const data2 = await require('../models/commands').findOne({ guildid: interaction.guildId })
                    if (data2) {
                        const ar = data2.commands
                        if (ar.includes(command.name)) { ava = false } else { ava = true }
                    } else {
                        ava = true
                    }


                    if (ava === false) {
                        interaction.reply({
                            embeds: [
                                new MessageEmbed()
                                    .setTitle(`❌ | Lệnh \`${cmd}\` đã bị tắt bởi Admin`)
                                    .setColor('#f00c0c')
                            ]
                        })

                    } else if (ava === true || !ava) {
                        const queueEmbed = new MessageEmbed()
                            .setAuthor({
                                name: 'Hàng chờ tính theo QueueChecker',
                                iconURL: client.user.displayAvatarURL()
                            })
                        if (!queueData || !queueData.queue) {
                            queueEmbed
                                .setColor('#f00c0c')
                                .setTitle('Không tìm thấy data !')
                        } else {
                            queueEmbed
                                .setColor('RANDOM')
                                .addFields({
                                    name: 'Hàng chờ: ' + queueData.queue,
                                    value: 'Restart: ' + queueData.restart + '\n' + 'Dữ liệu ghi vào lúc: \n<t:' + queueData.timecode + ':T> | <t:' + queueData.timecode + ':d> (<t:' + queueData.timecode + ':R>)'
                                })
                        }
                        setTimeout(() => {
                            interaction.channel.send({
                                embeds: [queueEmbed]
                            })
                        }, 1000)
                    }
                }
            }
        }
    })
}

module.exports.checker = checker;