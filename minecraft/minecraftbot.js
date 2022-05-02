const mineflayer = require('mineflayer')
	, tpsPlugin = require('mineflayer-tps')(mineflayer)
	, util = require('minecraft-server-util')
	, { Client } = require('discord.js')
	, ms = require('ms')
	, setchannel = require('../models/setchannel')
	, config = require('../models/option')
	, { MessageEmbed, Message } = require('discord.js')
	, { env } = require('process')
	, info = {
		name: env.MC_NAME,
		pass: env.MC_PASS,
		version: env.MC_VERSION,
		ip: env.MC_IP,
		port: env.MC_PORT
	}

/**
 *
 * @param {Client} client
 */
function createBot(client) {

	// Create bot

	const minecraftbot = mineflayer.createBot({
		host: info.ip,
		// port: info.port,
		username: info.name,
		version: info.version,
		plugins: {
			afk: require('./afk'),
		},
	});

	minecraftbot.loadPlugin(tpsPlugin);

	// Log when login

	let click = false
		, end = false
		, connect = 0
		, move = 0
		, login = false
		, err = 0
		, logintime = 0

	/**
	 * 
	 * @param {MessageEmbed} embed 
	 * @param {Message} msg
	 * @param {String} color
	 */
	async function send(embed, msg, color) {
		// console.log(msg)
		if (embed) {
			client.guilds.cache.map(guild => guild.id).forEach(async (id) => {
				const guild = client.guilds.cache.get(id);
				if (!guild.me.permissions.has('SEND_MESSAGES')) return
				let data = await setchannel.findOne({ guildid: id })
				if (data) {
					if (!data.livechat) return;
					if (data.livechat === '') return;
					const channel = guild.channels.cache.get(data.livechat);
					if (!channel) return;
					if (!guild.me.permissionsIn(channel).has('SEND_MESSAGES')) return
					if (embed && embed !== '') channel.send({ embeds: [embed] })
					else channel.send(await codeblockGenerator(msg, color))
				}
			})
		}
	}
	/**
	 * 
	 * @param {String} msg 
	 * @param {String} color 
	 * @returns 
	 */
	async function codeblockGenerator(msg, color) {
		let c = color.toLowerCase()
		if (c === 'blue' || c === 'xanh dương') {
			return '```md\n# ' + msg.toString() + '```'
		}
		else if (c === 'orange' || c === 'cam') {
			return '```cs\n# ' + msg.toString() + '```'
		}
		else if (c === 'red' || c === 'đỏ') {
			return '```cs\n- ' + msg.toString() + '```'
		}
		else if (c === 'green' || c === 'xanh lá') {
			return '```cs\n+ ' + msg.toString() + '```'
		}
		else if (c === 'gray' || c === 'grey' || c === 'xám') {
			return '```md\n> ' + msg.toString() + '```'
		}
		else {
			return '```' + msg + '```'
		}
	}
	/**
	 * 
	 * @param {String} pass 
	 */

	minecraftbot.on('login', async () => {
		move++
		end = false
		let server = ''
		logintime++
		if (move == 1) { server = 'Pin'; minecraftbot.afk.stop() }
		else if (move == 2) { server = 'Queue'; minecraftbot.afk.stop() }
		else if (move == 3) {
			server = 'Main';
			move = 0;
			err = 0
			setTimeout(() => {
				if (end === 'true') { return; }
				else {
					minecraftbot.afk.start();
				}
				const embed = new MessageEmbed()
					.setTitle('Bắt đầu afk')
					.setColor('GREY') // Xanh lá
				send(embed, 'Bắt đầu AFK', 'gray')
			}, 15000);
		}
		const embed1 = new MessageEmbed()
			.setTitle('Đã kết nối với server ' + server)
			.setColor('#07fc03') // Xanh lá

		send(embed1, embed1.title ? embed1.title : embed1.description, 'green')
	});

	// Login to server
	// From MoonU
	minecraftbot.on('windowOpen', async (window) => {
		if (Number(window.slots.length) == 63 || Number(window.slots.length) == 62) {

			const embed = new MessageEmbed()
				.setTitle('Cửa sổ `Chuyển Server` mở')
				.setColor('#07fc03') // Xanh lá

			send(embed, embed.title ? embed.title : embed.description, 'green')

			minecraftbot.simpleClick.leftMouse(10);

			const embed1 = new MessageEmbed()
				.setTitle('Đã click vào cửa sổ `Chuyển Server`')
				.setColor('#07fc03') // Xanh lá

			send(embed1, embed1.title ? embed1.title : embed1.description, 'green')

		} else {
			const embed = new MessageEmbed()
				.setTitle('Cửa sổ `Nhập PIN` mở')
				.setColor('#07fc03') // Xanh lá
			send(embed, embed.title ? embed.title : embed.description, 'green')

			click = true;

			window.requiresConfirmation = false;

			const pass = info.pass.split(' ')

			const p1 = pass[0];
			const p2 = pass[1];
			const p3 = pass[2];
			const p4 = pass[3];

			minecraftbot.simpleClick.leftMouse(Number(p1));
			minecraftbot.simpleClick.leftMouse(Number(p2));
			minecraftbot.simpleClick.leftMouse(Number(p3));
			minecraftbot.simpleClick.leftMouse(Number(p4));

			const embed1 = new MessageEmbed()
				.setTitle('Đã nhập mật khẩu')
				.setColor('#07fc03') // Xanh lá
			send(embed1, embed1.title ? embed1.title : embed1.description, 'green')
		}
	});

	// Livechat ingame (Mineflayer)
	// Phân loại
	const chat = /$<(.+)> (.+)^/;
	// Whisper
	const chat1 = /^nhắn cho (.+): (.+)$/;
	const chat2 = /^(.+) nhắn: (.+)$/;

	// Error
	const chat3 = /^Unknown command$/;
	const chat4 = /^Kicked whilst connecting to (.+)$/;
	const chat5 = /^Could not connect to a default or fallback server, please try again later:(.+)$/;
	const chat9 = /^Oops something went wrong... Putting you back in queue.$/;
	const chat10 = /^Exception Connecting:ReadTimeoutException : null$/;
	const chat12 = /^CommandWhitelist > No such command.$/;

	// Donater
	const chat6 = /^[Broadcast] (.+) (?:đạt mốc nạp|vừa ủng hộ) (.+)$/;

	// Bot
	const chat7 = /^<OggyTheBot>(.+)$/;
	const chat8 = /^<BotNameIsOggy>(.+)$/;

	minecraftbot.on('message', async (message) => {
		// console.log(message.toString())
		if (chat1.test(message.toString()) || chat2.test(message.toString())) {
			const embed = new MessageEmbed()
				.setDescription(`${message.toString()}`)
				.setColor('#ff17bd') // Hồng cánh sen mộng mer
			send(embed, embed.title ? embed.title : embed.description, 'blue')
		}
		else if (chat3.test(message.toString()) || chat4.test(message.toString()) || chat5.test(message.toString()) || chat9.test(message.toString()) || chat10.test(message.toString()) || chat12.test(message.toString())) {
			const embed = new MessageEmbed()
				.setDescription(`${message.toString()}`)
				.setColor('#f00c0c') // Đỏ

			send(embed, embed.title ? embed.title : embed.description, 'red')
		}
		else if (chat9.test(message.toString())) {
			err++
			if (err >= 5) { minecraftbot.end('Không thể kết nối với server `Chính`'); err = 0 }
		}
		else if (message.getText().toLowerCase().trim() === 'dùng lệnh/2y2c  để vào server.') {
			connect++;
			const embed = new MessageEmbed()
				.setDescription(`${message.toString()}`)
				.setColor('#09bced') // Xanh dương

			send(embed, embed.title ? embed.title : embed.description, 'blue')

			function connectServer(click, end, minecraftbot) {
				if (click === true && end === false) {
					minecraftbot.chat('/2y2c');
					const embed1 = new MessageEmbed()
						.setTitle('Đã nhập `/2y2c`')
						.setColor('#07fc03') // Xanh lá

					send(embed1, embed1.title ? embed1.title : embed1.description, 'green')
				}
			}
			if (connect == 2) {
				connectServer(click, end, minecraftbot);
			}
			else if (connect < 2 && connect > 2 && connect < 8) {
				return;
			}
			else if (connect = 8) {
				connectServer(click, end, minecraftbot);
			}
			else if (connect > 8) {
				minecraftbot.end('Không thể kết nối với server `Hàng chờ`');
			}
		}
		else if (chat6.test(message.toString())) {
			const embed = new MessageEmbed()
				.setDescription(`${message.toString()}`)
				.setColor('#a009e0') // Tím mộng mer
			send(embed, embed.title ? embed.title : embed.description, 'blue')
		}
		else if (message.toString() === 'The main server is down. We will be back soon!') {
			const embed = new MessageEmbed()
				.setDescription(`${message.toString()}`)
				.setColor('#f00c0c');
			send(embed, embed.title ? embed.title : embed.description, 'blue')
			setTimeout(() => { minecraftbot.end('Server Restart'); }, 5000);
		}
		else if (!chat1.test(message.toString()) || !chat2.test(message.toString()) || !chat3.test(message.toString()) || !chat4.test(message.toString()) || !chat6.test(message.toString())) {
			if (login === false && chat.test(message.toString())) {
				login === true;
				minecraftbot.afk.stop()
				setTimeout(() => {
					if (end === 'true') { return; }
					else {
						minecraftbot.afk.start();
						const embed = new MessageEmbed()
							.setTitle('Bắt đầu afk')
							.setColor('GREY') // Xanh lá

						send(embed, 'Bắt đầu AFK', 'gray')
					}
				}, 15000);
			}
			const embed = new MessageEmbed()
				.setDescription(`${message.toString()}`);
			if (chat7.test(message.toString()) || chat8.test(message.toString())) {
				embed.setColor('#094ded');
			}
			else {
				embed.setColor('#09bced');
			}
			send(embed, embed.title ? embed.title : embed.description, 'blue')
		}
	});


	// Chat to game (Discord)

	const prefixSchema = require('../models/prefix');
	const p = process.env.PREFIX

	client.on('messageCreate', async (message) => {
		if (message.author.bot) return;
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
		blacklist.findOne({ id: message.author.id }, async (err, data) => {
			if (err) throw err;
			if (!data) {
				let data2  = await setchannel.findOne({ guildid: message.guildId })
				if (data2) {
					let id = data2.livechat
					let channel = message.guild.channels.cache.get(id)
					if (!channel) return
					if (message.channel.id !== channel.id) return
					if (end === false) {
						minecraftbot.chat(`<${message.author.tag}> ${message.content}`);
						if (!message) return
						message.react('✅');
					} else if (end === true) {
						if (!message) return
						message.react('❌');
					}
				}
				if (!message.content.startsWith(prefix)) return;
				const args = message.content.slice(prefix.length).trim().split(/ +/g);
				const cmd = args.shift().toLocaleLowerCase();
				if (cmd.length === 0) return;
				if (cmd === 'checkonline' || cmd === 'conl') {
					if (end === true) return message.channel.send('🛑 | Bot đang mất kết nối với server `' + info.ip + '`')
					let i = 0;
					const num = Object.values(minecraftbot.players).map(name => name.username).length;
					Object.values(minecraftbot.players).map(name => name.username).forEach((names) => {
						if (names === args[0]) return message.channel.send(`✅ | Player ${names} đang onl!`);
						if (i > num) return message.channel.send('❌ | Player hiện không onl!');
						i++;
					});
				} else if (cmd === 'playeronline' || cmd === 'ponl' || cmd === 'player-online' || cmd === 'players-online') {
					if (end === true) return message.channel.send('🛑 | Bot đang mất kết nối với server `' + info.ip + '`')
					message.channel.send('Hiện có `' + Object.values(minecraftbot.players).map(name => name.username).length + '` player(s) đang onl trong server bot đang ở!')
				} /*else if (cmd === '2y2c' || cmd === '2y2c-queue' || cmd === 'queue-2y2c' || cmd === 'hangcho-2y2c') {
					const time = Math.floor(Date.now() / 1000)
					var queueOnline = Object.values(minecraftbot.players).map(name => name.username).length
					const queueEmbed = new MessageEmbed()
						.setAuthor({
							name: 'Hàng chờ tính theo OggyTheBot',
							iconURL: client.user.displayAvatarURL()
						})
					util.status('2y2c.org').then(async (res) => {
						if (end === true) {
							queueEmbed
								.setTitle('Bot đang mất kết nối với server')
								.setColor('#f00c0c') // Đỏ
						} else {
							queueEmbed
								.addFields({
									name: 'Hàng chờ: ' + Number(res.onlinePlayers - queueOnline),
									value: 'Restart: underfinded \n ' + 'Dữ liệu ghi vào lúc:\n<t:' + time + ':T> | <t:' + time + ':d> (<t:' + time + ':R>)'
								})
								.setColor('RANDOM')
						}
					})
					let send = false
					let sendtime = 0
					message.channel.createMessageCollector().on('collect', (msg) => {
						sendtime++
						if (send === true || sendtime != 2) return
						if (msg.author.id !== client.user.id) return
						message.channel.send({
							embeds: [queueEmbed]
						})
						send = true
					})
				} */
			}
			else { return }
		});
	});
	client.on('interactionCreate', async (interaction) => {
		if (interaction.isCommand()) {
			if (!interaction.commandName) return
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
					/*if (interaction.commandName === '2y2c') {
						const time = Math.floor(Date.now() / 1000)
						var queueOnline = Object.values(minecraftbot.players).map(name => name.username).length
						const queueEmbed = new MessageEmbed()
							.setAuthor({
								name: 'Hàng chờ tính theo OggyTheBot',
								iconURL: client.user.displayAvatarURL()
							})
						await util.status('2y2c.org').then(async (res) => {
							if (end === true) {
								queueEmbed
									.setTitle('Bot đang mất kết nối với server')
									.setColor('#f00c0c') // Đỏ
							} else {
								queueEmbed
									.addFields({
										name: 'Hàng chờ: ' + Number(res.onlinePlayers - queueOnline),
										value: 'Restart: underfinded \n ' + 'Dữ liệu ghi vào lúc:\n<t:' + time + ':T> | <t:' + time + ':d> (<t:' + time + ':R>)'
									})
									.setColor('RANDOM')
							}
						})
						interaction.channel.send({
							embeds: [queueEmbed]
						})
					} else*/if (interaction.commandName === 'check-online') {
						if (end === true) return interaction.reply('🛑 | Bot đang mất kết nối với server `' + info.ip + '`')
						let i = 0;
						const num = Object.values(minecraftbot.players).map(name => name.username).length;
						Object.values(minecraftbot.players).map(name => name.username).forEach((names) => {
							if (names === interaction.options.getString('player')) return interaction.reply(`✅ | Player ${names} đang onl!`);
							if (i > num) return interaction.reply('❌ | Player hiện không onl!');
							i++;
						});
					} else if (interaction.commandName === 'players-online') {
						if (end === true) return interaction.reply('🛑 | Bot đang mất kết nối với server `' + info.ip + '`')

						interaction.reply(`Hiện có ${Object.values(minecraftbot.players).map(name => name.username).length} players đang online trong server bot đang có mặt!`)
					}
				}
			}
		}
	})

	// Login when kicked

	var kickcount = 0;
	let rejoin = 0;
	minecraftbot.on('end', (reason) => {
		end = true;
		if (kickcount < 2) { rejoin = 1; kickcount = Number(kickcount) + 1; }
		else { rejoin = 5; }
		if (reason.toString().toLowerCase == 'server restart') rejoin = 5;
		const embed = new MessageEmbed()
			.setDescription(`**Bot đã mất kết nối đến server!` + info.ip + `\nLý do: \`${reason}\`\nKết nối lại sau ${rejoin} phút**`)
			.setColor('#f00c0c') // Đỏ
		send(embed, embed.title ? embed.title : embed.description, 'blue')

		setTimeout(() => {
			const embed = new MessageEmbed()
				.setTitle('Đang kết nối lại với ' + info.ip + '....')
				.setColor('#ffe021')
			send(embed, embed.title ? embed.title : embed.description, 'orange')
			createBot(client, 'mc');

		}, ms(`${rejoin}m`));
	});

	function random() {
		let random1 = Math.floor(Math.random() * 10)
		let random2 = Math.floor(Math.random() * 10)
		let random3 = Math.floor(Math.random() * 10)
		let random4 = Math.floor(Math.random() * 10)
		let random5 = Math.floor(Math.random() * 10)
		return `${random1}${random2}${random3}${random4}${random5}`
	}

	/**
	*
	* Command của bot ingame
	*
	*/

	// Queue
	// v Bảo trì!
	/*
	minecraftbot.addChatPattern('2y2c', /<(.+)> (?:og.2y2c|og.2Y2C|og.queue|og.checkqueue|!queue|!2y2c|!2Y2C)/, { parse: true })
	minecraftbot.on('chat:2y2c', async () => {
		util.status('2y2c.org').then((response) => {
			var string = `1 2 3 4 5 6 6 7 8 9 0`;
			var words = string.split(' ');
			let random1 = words[Math.floor(Math.random() * words.length)];
			let random2 = words[Math.floor(Math.random() * words.length)];
			let random3 = words[Math.floor(Math.random() * words.length)];
			let random4 = words[Math.floor(Math.random() * words.length)];
			let random5 = words[Math.floor(Math.random() * words.length)];
			let random6 = words[Math.floor(Math.random() * words.length)];
			let random7 = words[Math.floor(Math.random() * words.length)];
			let random8 = words[Math.floor(Math.random() * words.length)];
			let random9 = words[Math.floor(Math.random() * words.length)];
			let random10 = words[Math.floor(Math.random() * words.length)];
			var randomnum = `${random1}${random2}${random3}${random4}${random5}${random6}${random7}${random8}${random9}${random10}`

			let yc = response.onlinePlayers - 100;
			let yct = parseInt(response.samplePlayers[2].name.split("§")[2].replace("l", ""))
			let ycq = parseInt(response.samplePlayers[1].name.split("§")[2].replace("l", ""))
			minecraftbot.chat(`[2Y2C] Queues: ${yct} | ${ycq} || ${randomnum}`)
		})
	})
	*/
	// Server
	minecraftbot.addChatPattern('server', /<(.+)> (?:og.server|!server)/, { parse: true });
	minecraftbot.on('chat:server', async () => {
		const randomnum = await random()
		util.status('2y2c.org').then(async (response) => {
			minecraftbot.chat(`Total Players: ${response.onlinePlayers}/${response.maxPlayers} | TPS: ${minecraftbot.getTps()} | Bot Uptime : ${ms(client.uptime)} | ${randomnum}`);
		});
	});

	// TPS
	minecraftbot.addChatPattern('tps', /<(.+)> (?:og.tps|!tps)/, { parse: true });
	minecraftbot.on('chat:tps', async () => {
		const randomnum = await random()

		minecraftbot.chat(`TPS: ${minecraftbot.getTps()} | ${randomnum}`);
	});

	// Player
	minecraftbot.addChatPattern('player', /<(.+)> (?:og.player|!player)/, { parse: true });
	minecraftbot.on('chat:player', async () => {
		const randomnum = await random()

		util.status('2y2c.org').then(async (response) => {
			minecraftbot.chat(`Total Player: ${response.players.online}/${response.players.max} | ${randomnum}`);
		});
	});

	// Help
	minecraftbot.addChatPattern('botinfo', /<(.+)> (?:og.botinfo|og.bi|!botinfo|!bi)/, { parse: true });
	minecraftbot.on('chat:botinfo', async (message) => {
		const randomnum = await random()
		minecraftbot.chat(`WSPing: ${client.ws.ping} | Uptime: ${ms(client.uptime)} | ${randomnum}`);
	});
	minecraftbot.addChatPattern('help', /<(.+)> (?:og.help|!help)/, { parse: true });
	minecraftbot.on('chat:help', async () => {
		minecraftbot.chat('Lệnh hiện có: " queue, server, tps, player, botinfo, fd, ld, fk, lk, kd, jd "');
	});
	// KD
	// Const regex
	const kill1 = /^(.+) bị giết bởi (.+) sử dụng (.+)$/;
	const kill2 = /^(.+) bị đẩy té xuống vực bởi (.+)$/;
	const kill3 = /^(.+) chết ngạt vì đéo biết bơi$/;
	const kill4 = /^(.+) bị thông đít đến chết$/;
	const kill5 = /^(.+) chết đói$/;
	const kill6 = /^(.+) cứ nghĩ cháy là ngầu$/;
	const kill7 = /^(.+) té đập con mẹ nó mặt$/;
	const kill8 = /^(.+) bú cu tự sát$/;
	const kill9 = /^(.+) Tập bơi trong lava$/;
	const kill10 = /^(.+) đang leo lên thì té khỏi dây leo$/;
	const kill11 = /^(.+) đã bị giết bởi (.+)$/;
	const kill12 = /^(.+) đập mặt vào cột điện$/;
	const kill13 = /^(.+) nghĩ rằng cậu ấy bơi được hoài$/;
	const kill14 = /^(.+) chết cháy$/;
	const kill15 = /^(.+) đang leo lên thì té khỏi Thang$/;
	const kill16 = /^(.+) bị bắt bởi (.+) dùng (.+)$/;
	const kill17 = /^(.+) đã giết (.+) bằng (.+)$/;
	const kill18 = /^(.+) bị giết bởi (.+)$/;
	const kill19 = /^(.+) đã giết hại (.+) bằng (.+)$/;
	const kill20 = /^(.+) chết khi tắm xông hơi$/;
	const kill21 = /^(.+) bóp chim tự tử$/;
	const kill22 = /^(.+) nổ banh xác (.+) với tnt$/;
	const kill23 = /^(.+) was blown up by a Creeper$/;
	const kill24 = /^(.+) (?:nỏ|nổ) banh chim$/;
	const kill25 = /^(.+) bị giết bởi (.+) dùng (.+)$/;
	const kill26 = /^(.+) bị sét đánh$/;
	const kill27 = /^(.+) bị đè chết bởi đe$/;
	const kill28 = /^(.+) ngủ dưới nether :kappa: $/;
	const kill29 = /^(.+) bị hội đồng bởi (.+) Sử dụng (.+)$/;
	const kill30 = /^(.+) bị bốc hơi$/;

	// Nhập vào database
	const kd = require('../models/kd');
	const date = new Date();
	const joinDate = `Ng ${date.getDate()},Thg ${date.getMonth() + 1},Năm ${date.getFullYear()}`;

	async function victimWriter(victim, message, kd) {
		let data = await kd.findOne({ username: victim })
		if (data) {
			const deathcount = Number(data.death) + 1;
			if (data.firstdeath === 'No data') {
				kd.findOneAndUpdate({ username: victim }, { $set: { firstdeath: message, lastdeath: message, death: deathcount } }, async (err, data) => {
					if (err) throw err;
					if (data) {
						data.save();
					}
					else if (!data) {
						data = new kd({
							username: victim,
							kill: '0',
							death: '1',
							firstkill: 'No data',
							lastkill: 'No data',
							firstdeath: `${message}`,
							lastdeath: `${message}`,
							joinDate: joinDate,
						});
						data.save();
					}
				});
			}
			else if (data.firstdeath !== 'No data' && data.lastdeath !== 'No data') {
				kd.findOneAndUpdate({ username: victim }, { $set: { lastdeath: message, death: deathcount } }, async (err, data) => {
					if (err) throw err;
					if (data) {
						data.save();
					}
					else if (!data) {
						data = new kd({
							username: victim,
							kill: '0',
							death: '1',
							firstkill: 'No data',
							lastkill: 'No data',
							firstdeath: `${message}`,
							lastdeath: `${message}`,
							joinDate: joinDate,
						});
						data.save();
					}
				});
			}
		}
		else {
			data = new kd({
				username: victim,
				kill: '0',
				death: '1',
				firstkill: 'No data',
				lastkill: 'No data',
				firstdeath: `${message}`,
				lastdeath: `${message}`,
				joinDate: joinDate,
			});
			data.save();
		}
	}
	async function killerWriter(killer, message, kd) {
		let data = await kd.findOne({ username: killer })
		if (err) throw err;
		if (data) {
			const killcount = Number(data.kill) + 1;
			if (data.firstdeath === 'No data') {
				kd.findOneAndUpdate({ username: killer }, { $set: { firstkill: message, lastkill: message, kill: killcount } }, async (err, data) => {
					if (err) throw err;
					if (data) {
						data.save();
					}
					else if (!data) {
						data = new kd({
							username: killer,
							kill: '1',
							death: '0',
							firstkill: `${message}`,
							lastkill: `${message}`,
							firstdeath: 'No data',
							lastdeath: 'No data',
							joinDate: joinDate,
						});
						data.save();
					}
				});
			}
			else if (data.firstkill !== 'No data' && data.lastkill !== 'No data') {
				kd.findOneAndUpdate({ username: killer }, { $set: { lastkill: message, kill: killcount } }, async (err, data) => {
					if (err) throw err;
					if (data) {
						data.save();
					}
					else if (!data) {
						data = new kd({
							username: killer,
							kill: '1',
							death: '0',
							firstkill: `${message}`,
							lastkill: `${message}`,
							firstdeath: 'No data',
							lastdeath: 'No data',
							joinDate: joinDate,
						});
						data.save();
					}
				});
			}
		}
		else {
			data = new kd({
				username: killer,
				kill: '1',
				death: '0',
				firstkill: `${message}`,
				lastkill: `${message}`,
				firstdeath: 'No data',
				lastdeath: 'No data',
				joinDate: joinDate,
			});
			data.save();
		}
	}

	minecraftbot.on('message', async (message) => {
		const messageregex = /^<(.+)> (.+)$/;
		if (messageregex.test(message.toString())) return;
		const str = message.toString();
		if (kill1.test(str)) {
			const victim = `${kill1.exec(str)[1]}`;
			const killer = `${kill1.exec(str)[2]}`;
			const weapon = `${kill1.exec(str)[3]}`;
			const message = `${victim} bị giết bởi ${killer} dùng ${weapon}`;
			// Victim
			victimWriter(victim, message, kd)
			// Killer
			killerWriter(killer, message, kd)
		}
		else if (kill2.test(str)) {
			const victim = `${kill2.exec(str)[1]}`;
			const killer = `${kill2.exec(str)[2]}`;
			const message = `${victim} bị đẩy xuống vực ${killer}`;
			// Victim
			victimWriter(victim, message, kd)
			// Killer
			killerWriter(killer, message, kd)
		}
		else if (kill3.test(str)) {
			const victim = `${kill3.exec(str)[1]}`;
			const message = `${victim} chết ngạt vì đéo biết bơi`;
			// Victim
			victimWriter(victim, message, kd)
		}
		else if (kill4.test(str)) {
			const victim = `${kill4.exec(str)[1]}`;
			const message = `${victim} bị thông đít đến chết`;
			// Victim
			victimWriter(victim, message, kd)
		}
		else if (kill5.test(str)) {
			const victim = `${kill5.exec(str)[1]}`;
			const message = `${victim} chết đói`;
			// Victim
			victimWriter(victim, message, kd)
		}
		else if (kill6.test(str)) {
			const victim = `${kill6.exec(str)[1]}`;
			const message = `${victim} cứ nghĩ cháy là ngầu`;
			// Victim
			victimWriter(victim, message, kd)
		}
		else if (kill7.test(str)) {
			const victim = `${kill7.exec(str)[1]}`;
			const message = `${victim} té đập con mẹ nó mặt`;
			// Victim
			victimWriter(victim, message, kd)
		}
		else if (kill8.test(str)) {
			const victim = `${kill8.exec(str)[1]}`;
			const message = `${victim} bú cu tự sát`;
			// Victim
			victimWriter(victim, message, kd)
		}
		else if (kill9.test(str)) {
			const victim = `${kill9.exec(str)[1]}`;
			const message = `${victim} Tập bơi trong lava`;
			// Victim
			victimWriter(victim, message, kd)
		}
		else if (kill10.test(str)) {
			const victim = `${kill10.exec(str)[1]}`;
			const message = `${victim} đang leo thì té khỏi dây leo`;
			// Victim
			victimWriter(victim, message, kd)
		}
		else if (kill11.test(str)) {
			const victim = `${kill11.exec(str)[1]}`;
			const killer = `${kill11.exec(str)[2]}`;
			const message = `${victim} bị giết bởi ${killer}`;
			// Victim
			victimWriter(victim, message, kd)
			// Killer
			killerWriter(killer, message, kd)
		}
		else if (kill12.test(str)) {
			const victim = `${kill12.exec(str)[1]}`;
			const message = `${victim} đập mặt vào cột điện`;
			// Victim
			kvictimWriter(victim, message, kd)
		}
		else if (kill13.test(str)) {
			const victim = `${kill13.exec(str)[1]}`;
			const message = `${victim} nghĩ rằng cậu ấy bơi được hoài`;
			// Victim
			victimWriter(victim, message, kd)
		}
		else if (kill14.test(str)) {
			const victim = `${kill14.exec(str)[1]}`;
			const message = `${victim} chết cháy`;
			// Victim
			victimWriter(victim, message, kd)
		}
		else if (kill15.test(str)) {
			const victim = `${kill15.exec(str)[1]}`;
			const message = `${victim} đang leo thì té khỏi thang`;
			// Victim
			victimWriter(victim, message, kd)
		}
		else if (kill16.test(str)) {
			const victim = `${kill16.exec(str)[1]}`;
			const killer = `${kill16.exec(str)[2]}`;
			const weapon = `${kill16.exec(str)[3]}`;
			const message = `${victim} bị bắn bởi ${killer} sử dụng ${weapon}`;
			// Victim
			victimWriter(victim, message, kd)
			// Killer
			killerWriter(killer, message, kd)
		}
		else if (kill17.test(str)) {
			const victim = `${kill17.exec(str)[2]}`;
			const killer = `${kill17.exec(str)[1]}`;
			const weapon = `${kill17.exec(str)[3]}`;
			const message = `${killer} đã giết ${victim} dùng ${weapon}`;
			// Victim
			victimWriter(victim, message, kd)
			// Killer
			killerWriter(killer, message, kd)
		}
		else if (kill18.test(str)) {
			const victim = `${kill18.exec(str)[1]}`;
			const killer = `${kill18.exec(str)[2]}`;
			const message = `${victim} bị giết bởi ${killer}`;
			// Victim
			victimWriter(victim, message, kd)
			// Killer
			killerWriter(killer, message, kd)
		}
		else if (kill19.test(str)) {
			const victim = `${kill19.exec(str)[1]}`;
			const killer = `${kill19.exec(str)[2]}`;
			const weapon = `${kill19.exec(str)[3]}`;
			const message = `${victim} đã giết hại ${killer} bẳng ${weapon}`;
			// Victim
			victimWriter(victim, message, kd)
			// Killer
			killerWriter(killer, message, kd)
		}
		else if (kill20.test(str)) {
			const victim = `${kill13.exec(str)[1]}`;
			const message = `${victim} chết khi tắm xông hơi`;
			// Victim
			victimWriter(victim, message, kd)
		}
		else if (kill21.test(str)) {
			const victim = `${kill21.exec(str)[1]}`;
			const message = `${victim} bóp chim tự tử`;
			// Victim
			victimWriter(victim, message, kd)
		}
		else if (kill22.test(str)) {
			const killer = `${kill22.exec(str)[2]}`;
			const victim = `${kill22.exec(str)[1]}`;
			const message = `${victim} nổ banh xác ${killer} bằng tnt`;
			// Victim
			victimWriter(victim, message, kd)
			// Killer
			killerWriter(killer, message, kd)
		}
		else if (kill23.test(str)) {
			const victim = `${kill23.exec(str)[1]}`;
			const message = `${victim} was blown up by a Creeper`;
			// Victim
			victimWriter(victim, message, kd)
		}
		else if (kill24.test(str)) {
			const victim = `${kill24.exec(str)[1]}`;
			const message = `${victim} nổ banh chim`;
			// Victim
			victimWriter(victim, message, kd)
		}
		else if (kill25.test(str)) {
			const victim = `${kill25.exec(str)[1]}`;
			const killer = `${kill25.exec(str)[2]}`;
			const weapon = `${kill25.exec(str)[3]}`;
			const message = `${victim} bị giết bởi ${killer} dùng ${weapon}`;
			// Victim
			victimWriter(victim, message, kd)
			// Killer
			killerWriter(killer, message, kd)
		}
		else if (kill26.test(str)) {
			const victim = `${kill26.exec(str)[1]}`;
			const message = `${victim} bị sét đánh`;
			// Victim
			victimWriter(victim, message, kd)
		}
		else if (kill27.test(str)) {
			const victim = `${kill27.exec(str)[1]}`;
			const message = `${victim} bì đè chết bởi đe`;
			// Victim
			victimWriter(victim, message, kd)
		}
		else if (kill28.test(str)) {
			const victim = `${kill28.exec(str)[1]}`;
			const message = `${victim} ngủ dưới nether :kappa:`;
			// Victim
			victimWriter(victim, message, kd)
		}
		else if (kill29.test(str)) {
			const victim = `${kill29.exec(str)[1]}`;
			const killer = `${kill29.exec(str)[2]}`;
			const weapon = `${kill29.exec(str)[3]}`;
			const message = `${victim} bị hội đồng bởi ${killer} dùng ${weapon}`;
			// Victim
			victimWriter(victim, message, kd)
			// Killer
			killerWriter(killer, message, kd)
		}
		else if (kill30.test(str)) {
			const victim = `${kill30.exec(str)[1]}`;
			const message = `${victim} bị bốc hơi`;
			// Victim
			victimWriter(victim, message, kd)
		}
	});
	const kdcommand = /^<(.+)> (?:og.kd|!kd)/;
	const jdcommand = /^<(.+)> (?:!jd|og.jd)/;
	const lastkill = /^<(.+)> (?:!lk|!lastkill|og.lk|og.lastkill)/;
	const firstkill = /^<(.+)> (?:!fk|!firstkill|og.firstkill|og.fk)/;
	const lastdeath = /^<(.+)> (?:!ld|!lastdeath|og.ld|og.lastdeath)/;
	const firstdeath = /^<(.+)> (?:!fd|!firstdeath|og.fd|og.firstdeath)/;

	minecraftbot.on('message', async (msg) => {
		const text = msg.toString();
		const str = msg.toString();
		if (kdcommand.test(msg.toString())) {
			var randomnum = await random()
			const fullname = kdcommand.exec(text)[1];
			const userlenght = fullname.length - 9;
			const username = fullname.slice(-userlenght);
			const checkdonator = fullname.slice(0, -username.length);
			if (checkdonator === '[Donator]') {
				kd.findOne({ username: `${username}` }, async (err, data) => {
					if (err) throw err;
					if (data) {
						const kdpoint = data.kill / data.death;
						minecraftbot.chat(`/w ${username} Kill: ${data.kill} | Death: ${data.death} | K/D: ${kdpoint} | ${randomnum}`);
					}
					else {
						minecraftbot.chat(`/w ${username} Không tìm thấy data! Hãy bóp bird tự tử để tạo data.`);
					}
				});
			}
			else {
				kd.findOne({ username: `${fullname}` }, async (err, data) => {
					if (err) throw err;
					if (data) {
						const kdpoint = data.kill / data.death;
						minecraftbot.chat(`/w ${fullname} Kill: ${data.kill} | Death: ${data.death} | K/D: ${kdpoint} | ${randomnum}`);
					}
					else {
						minecraftbot.chat(`/w ${fullname} Không tìm thấy data! Hãy bóp bird tự tử để tạo data.`);
					}
				});
			}
		}
		else if (jdcommand.test(msg.toString())) {
			var randomnum = await random()
			const fullname = jdcommand.exec(text)[1];
			const userlenght = fullname.length - 9;
			const username = fullname.slice(-userlenght);
			const checkdonator = fullname.slice(0, -username.length);
			if (checkdonator === '[Donator]') {
				kd.findOne({ username: `${username}` }, async (err, data) => {
					if (err) throw err;
					if (data) {
						minecraftbot.chat(`/w ${username} Dữ liệu được tạo từ ${data.joinDate}`);
					}
					else {
						minecraftbot.chat(`/w ${username} Không tìm thấy data. Hãy bóp bird tự tử để tạo data.`);
					}
				});
			}
			else {
				kd.findOne({ username: `${fullname}` }, async (err, data) => {
					if (err) throw err;
					if (data) {
						minecraftbot.chat(`/w ${fullname} Dữ liệu được tạo từ ${data.joinDate}`);
					}
					else {
						minecraftbot.chat(`/w ${fullname} Không tìm thấy data. Hãy bóp bird tự tử để tạo data.`);
					}
				});
			}
		}
		else if (lastkill.test(str)) {
			var randomnum = await random()
			var randomnum = `${random1}${random2}${random3}${random4}${random5}`;
			const fullname = lastkill.exec(text)[1];
			const userlenght = fullname.length - 9;
			const username = fullname.slice(-userlenght);
			const checkdonator = fullname.slice(0, -username.length);
			if (checkdonator === '[Donator]') {
				kd.findOne({ username: `${username}` }, async (err, data) => {
					if (err) throw err;
					if (data) {
						minecraftbot.chat(`/w ${username} Lastkill: ${data.lastkill}`);
					}
					else {
						minecraftbot.chat(`/w ${username} Không tìm thấy data. Hãy bún cua để tạo data.`);
					}
				});
			}
			else {
				kd.findOne({ username: `${fullname}` }, async (err, data) => {
					if (err) throw err;
					if (data) {
						minecraftbot.chat(`/w ${fullname} Lastkill: ${data.lastkill}`);
					}
					else {
						minecraftbot.chat(`/w ${fullname} Không tìm thấy data. Hãy bún cua để tạo data.`);
					}
				});
			}
		}
		else if (firstkill.test(str)) {
			var randomnum = await random()
			const fullname = firstkill.exec(text)[1];
			const userlenght = fullname.length - 9;
			const username = fullname.slice(-userlenght);
			const checkdonator = fullname.slice(0, -username.length);
			if (checkdonator === '[Donator]') {
				kd.findOne({ username: `${username}` }, async (err, data) => {
					if (err) throw err;
					if (data) {
						minecraftbot.chat(`/w ${username} Firstkill: ${data.firstkill}`);
					}
					else {
						minecraftbot.chat(`/w ${username} Không tìm thấy data. Hãy bún cua để tạo data.`);
					}
				});
			}
			else {
				kd.findOne({ username: `${fullname}` }, async (err, data) => {
					if (err) throw err;
					if (data) {
						minecraftbot.chat(`/w ${fullname} Firstkill: ${data.firstkill}`);
					}
					else {
						minecraftbot.chat(`/w ${fullname} Không tìm thấy data. Hãy bún cua để tạo data.`);
					}
				});
			}
		}
		else if (lastdeath.test(str)) {
			var randomnum = await random()
			const fullname = lastdeath.exec(text)[1];
			const userlenght = fullname.length - 9;
			const username = fullname.slice(-userlenght);
			const checkdonator = fullname.slice(0, -username.length);
			if (checkdonator === '[Donator]') {
				kd.findOne({ username: `${username}` }, async (err, data) => {
					if (err) throw err;
					if (data) {
						minecraftbot.chat(`/w ${username} Lastdeath: ${data.lastdeath}`);
					}
					else {
						minecraftbot.chat(`/w ${username} Không tìm thấy data. Hãy bóp bird tự tử để tạo data.`);
					}
				});
			}
			else {
				kd.findOne({ username: `${fullname}` }, async (err, data) => {
					if (err) throw err;
					if (data) {
						minecraftbot.chat(`/w ${fullname} Lastdeath: ${data.lastdeath}`);
					}
					else {
						minecraftbot.chat(`/w ${fullname} Không tìm thấy data. Hãy bóp bird tự tử để tạo data.`);
					}
				});
			}
		}
		else if (firstdeath.test(str)) {
			var randomnum = await random()
			const fullname = firstdeath.exec(text)[1];
			const userlenght = fullname.length - 9;
			const username = fullname.slice(-userlenght);
			const checkdonator = fullname.slice(0, -username.length);
			if (checkdonator === '[Donator]') {
				kd.findOne({ username: `${username}` }, async (err, data) => {
					if (err) throw err;
					if (data) {
						minecraftbot.chat(`/w ${username} Firstdeath: ${data.firstdeath}`);
					}
					else {
						minecraftbot.chat(`/w ${username} Không tìm thấy data. Hãy bóp bird tự tử để tạo data.`);
					}
				});
			}
			else {
				kd.findOne({ username: `${fullname}` }, async (err, data) => {
					if (err) throw err;
					if (data) {
						minecraftbot.chat(`/w ${fullname} Firstdeath: ${data.firstdeath}`);
					}
					else {
						minecraftbot.chat(`/w ${fullname} Không tìm thấy data. Hãy bóp bird tự tử để tạo data.`);
					}
				});
			}
		}
	});
}

// Export module ra index.js
module.exports.createBot = createBot;