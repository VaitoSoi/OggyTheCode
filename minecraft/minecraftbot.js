const mineflayer = require('mineflayer')
	, tpsPlugin = require('mineflayer-tps')(mineflayer)
	, util = require('minecraft-server-util')
	, { Client } = require('discord.js')
	, ms = require('ms')
	, config = require('../models/option')
	// , config = require('../models/option')
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
 * @param {Client} client2
 */
function createBot(client, client2) {

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
		, guilds = []
		, restart = false

	/**
	 * 
	 * @param {MessageEmbed} embed 
	 * @param {Message} msg
	 * @param {String} color
	 */
	async function send(embed, msg, color) {
		// console.log(msg)
		if (embed) {
			client.guilds.cache.map(guild => guild).forEach(async (guild) => {
				guilds.push(guild.id)
				if (!guild.me.permissions.has('SEND_MESSAGES')) return
				let data = await config.findOne({ guildid: guild.id })
				if (data) {
					let id = data.config.channels.livechat
					const channel = guild.channels.cache.get(id);
					if (!channel) return;
					if (!guild.me.permissionsIn(channel).has('SEND_MESSAGES')) return
					try {
						if (embed && embed !== '') channel.send({ embeds: [embed] })
						else channel.send(await codeblockGenerator(msg, color))
					} catch (e) {
						console.log(e)
					}
				}
			})
			client2.guilds.cache.map(guild => guild).forEach(async (guild) => {
				if (guilds.includes(guild.id)) return
				if (!guild.me.permissions.has('SEND_MESSAGES')) return
				let data = await config.findOne({ guildid: guild.id })
				if (data) {
					let id = data.config.channels.livechat
					const channel = guild.channels.cache.get(id);
					if (!channel) return;
					if (!guild.me.permissionsIn(channel).has('SEND_MESSAGES')) return
					try {
						if (embed && embed !== '') channel.send({ embeds: [embed] })
						else channel.send(await codeblockGenerator(msg, color))
					} catch (e) {
						console.log(e)
					}
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
	 * @param {Number} rejoin 
	 */
	function reconnect(rejoin) {
		let time = 5
		if (rejoin) time = rejoin
		setTimeout(async () => {
			let server = await util.status('2y2c.org', 25565).catch((err) => { return console.log(err.stack) })
			if (server.players.online < 15 && restart === true) {
				const embed = new MessageEmbed()
					.setDescription(`**Ngắt kết nối với \`${info.ip}\`.\nLý do: Server hiện tại có players < 20 người!\nKết nối lại sau ${time} phút**`)
					.setColor('#f00c0c')
				send(embed, embed.title ? embed.title : embed.description, 'red')
				reconnect(time)
			} else {
				const embed = new MessageEmbed()
					.setDescription('Đang kết nối lại với ' + info.ip + '...')
					.setColor('#ffe021')
				send(embed, embed.title ? embed.title : embed.description, 'orange')
				createBot(client, client2, 'mc');
			}
		}, ms(`${time}m`));
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
				if (end === true) { return; }
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

		} else if (Number(window.slots.length) == 45 || Number(window.slots.length) == 46) {
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
					if (end === true) { return; }
					else {
						end
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
			if (message.toString().split(' ').shift() === `<${minecraftbot.player.username}>`) {
				embed.setColor('#094ded');
			} else {
				embed.setColor('#09bced');
			}
			send(embed, embed.title ? embed.title : embed.description, 'blue')
		}
	});


	// Chat to game (Discord)

	const prefixSchema = require('../models/prefix');
	const p = process.env.PREFIX
	/*
	client.on('messageCreate', async (message) => {
		return
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
			prefix = process.env.PREFIX_1;
		}
		blacklist.findOne({ id: message.author.id }, async (err, data) => {
			if (err) throw err;
			if (!data) {
				if (!message.content.startsWith(prefix)) return;
				const args = message.content.slice(prefix.length).trim().split(/ +/g);
				const cmd = args.shift().toLocaleLowerCase();
				if (cmd.length === 0) return;
				if (end === true) return message.channel.send('🛑 | Bot đang mất kết nối với server `' + info.ip + '`')
				if (cmd === 'checkonline' || cmd === 'conl') {
					let i = 0;
					const num = Object.values(minecraftbot.players).map(name => name.username).length;
					Object.values(minecraftbot.players).map(name => name.username).forEach((names) => {
						if (names === args[0]) return message.channel.send(`✅ | Player ${names} đang onl!`);
						if (i > num) return message.channel.send('❌ | Player hiện không onl!');
						i++;
					});
				} else if (cmd === 'playeronline' || cmd === 'ponl' || cmd === 'player-online' || cmd === 'players-online') {
					message.channel.send('Hiện có `' + Object.values(minecraftbot.players).map(name => name.username).length + '` player(s) đang onl trong server bot đang ở!')
				} else if (cmd === 'chat') {
					if (end === true) {
						message.reactions.removeAll()
						message.react('❌')
					} else {
						try {
							minecraftbot.chat(`<${message.author.tag}> ${message.content.split(' ').slice(1).join(' ')}`)
							message.reactions.removeAll()
							message.react('✅')
						} catch (error) {
							message.reactions.removeAll()
							message.react('❌')
						}
					}
				}
			}
			else { return }
		});
	});
	*/
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
				if (ava) {
					if (!interaction.deferred) await require('../util/delay')(1000)
					if (interaction.commandName === 'check-online') {
						if (end === true) return interaction.editReply('🛑 | Bot đang mất kết nối với server `' + info.ip + '`')
						let i = 0;
						const num = Object.values(minecraftbot.players).map(name => name.username).length;
						Object.values(minecraftbot.players).map(name => name.username).forEach((names) => {
							if (names === interaction.options.getString('player')) return interaction.editReply(`✅ | Player ${names} đang onl!`);
							if (i > num) return interaction.editReply('❌ | Player hiện không onl!');
							i++;
						});
					} else if (interaction.commandName === 'players-online') {
						if (end === true) return interaction.editReply('🛑 | Bot đang mất kết nối với server `' + info.ip + '`')
						interaction.editReply(`Hiện có ${Object.values(minecraftbot.players).map(name => name.username).length} player(s) đang online trong server bot đang có mặt!`)
					} else if (interaction.commandName === 'chat') {
						if (end === true) {
							interaction.editReply('🛑 | Bot đang mất kết nối với server `' + info.ip + '`')
						} else {
							try {
								minecraftbot.chat(`<${interaction.user.tag}> ${interaction.options.getString('chat')}`)
								interaction.editReply('✅ | Đã gửi chat!')
							} catch (error) {
								interaction.editReply('❌ | Không thể gửi chat!\n🛑 | Lý do: ```' + error + '```')
							}
						}
					}
				}
			}
		}
	})
	/*
	client2.on('messageCreate', async (message) => {
		return
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
			prefix = process.env.PREFIX_2;
		}
		blacklist.findOne({ id: message.author.id }, async (err, data) => {
			if (err) throw err;
			if (!data) {
				if (!message.content.startsWith(prefix)) return;
				const args = message.content.slice(prefix.length).trim().split(/ +/g);
				const cmd = args.shift().toLocaleLowerCase();
				if (cmd.length === 0) return;
				if (end === true) return message.channel.send('🛑 | Bot đang mất kết nối với server `' + info.ip + '`')
				if (cmd === 'checkonline' || cmd === 'conl') {
					let i = 0;
					const num = Object.values(minecraftbot.players).map(name => name.username).length;
					Object.values(minecraftbot.players).map(name => name.username).forEach((names) => {
						if (names === args[0]) return message.channel.send(`✅ | Player ${names} đang onl!`);
						if (i > num) return message.channel.send('❌ | Player hiện không onl!');
						i++;
					});
				} else if (cmd === 'playeronline' || cmd === 'ponl' || cmd === 'player-online' || cmd === 'players-online') {
					message.channel.send('Hiện có `' + Object.values(minecraftbot.players).map(name => name.username).length + '` player(s) đang onl trong server bot đang ở!')
				} else if (cmd === 'chat') {
					if (end === true) {
						message.reactions.removeAll()
						message.react('❌')
					} else {
						try {
							minecraftbot.chat(`<${message.author.tag}> ${message.content.split(' ').slice(1).join(' ')}`)
							message.reactions.removeAll()
							message.react('✅')
						} catch (error) {
							message.reactions.removeAll()
							message.react('❌')
						}
					}
				}
			}
			else { return }
		});
	});
	*/
	client2.on('interactionCreate', async (interaction) => {
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
					interaction.editReply({
						embeds: [
							new MessageEmbed()
								.setTitle(`❌ | Lệnh \`${cmd}\` đã bị tắt bởi Admin`)
								.setColor('#f00c0c')
						]
					})
				} else if (ava === true || !ava) {
					if (!interaction.deferred) await require('../util/delay')(1000)
					if (interaction.commandName === 'check-online') {
						if (end === true) return interaction.editReply('🛑 | Bot đang mất kết nối với server `' + info.ip + '`')
						let i = 0;
						const num = Object.values(minecraftbot.players).map(name => name.username).length;
						Object.values(minecraftbot.players).map(name => name.username).forEach((names) => {
							if (names === interaction.options.getString('player')) return interaction.editReply(`✅ | Player ${names} đang onl!`);
							if (i > num) return interaction.editReply('❌ | Player hiện không onl!');
							i++;
						});
					} else if (interaction.commandName === 'players-online') {
						if (end === true) return interaction.editReply('🛑 | Bot đang mất kết nối với server `' + info.ip + '`')
						interaction.editReply(`Hiện có ${Object.values(minecraftbot.players).map(name => name.username).length} player(s) đang online trong server bot đang có mặt!`)
					} else if (interaction.commandName === 'chat') {
						if (end === true) {
							interaction.editReply('🛑 | Bot đang mất kết nối với server `' + info.ip + '`')
						} else {
							try {
								minecraftbot.chat(`<${interaction.user.tag}> ${interaction.options.getString('chat')}`)
								interaction.editReply('✅ | Đã gửi chat!')
							} catch (error) {
								interaction.editReply('❌ | Không thể gửi chat!\n🛑 | Lý do: ```' + error + '```')
							}
						}
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
		if (kickcount < 2) { rejoin = 1; kickcount++ }
		else { rejoin = 5; }
		if (reason.toString().toLowerCase() == 'server restart') { rejoin = 5; restart = true }
		const embed = new MessageEmbed()
			.setDescription(`**Bot đã mất kết nối đến server \`${info.ip}\`!\nLý do: \`${reason}\`\nKết nối lại sau ${rejoin} phút**`)
			.setColor('#f00c0c') // Đỏ
		send(embed, embed.title ? embed.title : embed.description, 'red')
		reconnect(rejoin)
	});

	/**
	*
	* Command của bot ingame
	*
	*/
	minecraftbot.on('chat', (username, message) => {
		let msg = message.split(' ').splice(1).join(' ')
			, prefix = '!'
		if (!msg.split(' ').shift().startsWith(prefix)) return
		let args = msg.slice(prefix.length).trim().split(/ +/g)
			, cmd = args.shift().toLowerCase()
		if (cmd === '>') cmd = args[1].toLowerCase()
		let command = client.mccommands.get(cmd)
		if (!command) return minecraftbot.chat(`/msg ${username} Error: Không tìm thấy command!!`)
		try {
			command.run(client, minecraftbot, args, username)
		} catch (err) {
			minecraftbot.chat(`/msg ${username} Error: ${err}`)
		}
	})
	/**
	 * 
	 * KDA Writer
	 * 
	 */
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
				kd.findOneAndUpdate({ username: victim }, { $set: { firstdeath: message, lastdeath: message, death: deathcount } });
			}
			else if (data.firstdeath !== 'No data' && data.lastdeath !== 'No data') {
				kd.findOneAndUpdate({ username: victim }, { $set: { lastdeath: message, death: deathcount } });
			}
		} else {
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
				await kd.findOneAndUpdate({ username: killer }, { $set: { firstkill: message, lastkill: message, kill: killcount } });
			}
			else if (data.firstkill !== 'No data' && data.lastkill !== 'No data') {
				await kd.findOneAndUpdate({ username: killer }, { $set: { lastkill: message, kill: killcount } });
			}
		} else {
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
			await data.save();
		}
	}

	// Message
	minecraftbot.on('message', async (message) => {
		if (minecraftbot.player.username === 'BotNameisOggy') return
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
}

// Export module ra index.js
module.exports.createBot = createBot;