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
	, color = {
		red: '#f00c0c',
		yellow: '#e5f00c',
		green: '#07fc03',
		pink: '#ff17bd',
		blue: '#09bced',
		purple: '#a009e0',
		blue2: '#094ded'
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
		, prepare = false
		, restart = false
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
			client.guilds.cache.forEach(async (guild) => {
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
			client2.guilds.cache.forEach(async (guild) => {
				if (guild.members.cache.has(client.user.id)) return
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
	 * @param {String} time 
	 * @param {Boolean} now 
	 */
	async function restartsend(time, now) {
		client.guilds.cache.forEach(async (guild) => {
			if (!guild.me.permissions.has('SEND_MESSAGES')) return
			let data = await config.findOne({ guildid: guild.id })
			if (data) {
				try {
					const channel = guild.channels.cache.get(data.config.channels.restart);
					const role = guild.roles.cache.get(data.config.role.restart)
					if (!channel || !channel.isText() || !role) return;
					(await channel.messages.fetch()).forEach(msg => {
						if (msg.id === data.config.message.restart) return
						if (msg.author.id !== client.user.id && msg.author.id !== client.user.id) return
						if ((Date.now() - msg.createdTimestamp) < 31 * 60 * 1000) return
						msg.delete().catch((e) => { }) // console.log(e)
					})
					if (!guild.me.permissionsIn(channel).has('SEND_MESSAGES')) return
					let str = ''
					if (!now) str = `${role} | Server sẽ restart trong ${time} nữa!`
					else str = `${role} | Server đang restart!`
					channel.send(str)
				} catch (e) {
					// console.log(e)
				}
			}
		})
		client2.guilds.cache.forEach(async (guild) => {
			if (guild.members.cache.has(client.user.id)) return
			if (!guild.me.permissions.has('SEND_MESSAGES')) return
			let data = await config.findOne({ guildid: guild.id })
			if (data) {
				try {
					const channel = guild.channels.cache.get(data.config.channels.restart);
					const role = guild.roles.cache.get(data.config.role.restart)
					if (!channel || !channel.isText() || !role) return;
					(await channel.messages.fetch()).forEach(msg => {
						if (msg.id === data.config.message.restart) return
						if (msg.author.id !== client.user.id && msg.author.id !== client.user.id) return
						if ((Date.now() - msg.createdTimestamp) < 31 * 60 * 1000) return
						msg.delete().catch((e) => { }) // console.log(e)
					})
					if (!guild.me.permissionsIn(channel).has('SEND_MESSAGES')) return
					let str = ''
					if (!now) str = `${role} | Server sẽ restart trong ${time} nữa!`
					else str = `${role} | Server đang restart!`
					channel.send(str)
				} catch (e) {
					// console.log(e)
				}
			}
		})
	}

	minecraftbot.on('login', async () => {
		client.user.setStatus('online')
		client2.user.setStatus('online')
		move++
		end = false
		prepare = false
		restart = false
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
					.setColor('GREY') // Xám
				send(embed, 'Bắt đầu AFK', 'gray')
			}, 15000);
		}
		const embed1 = new MessageEmbed()
			.setTitle('Đã kết nối với server ' + server)
			.setColor(color.green) // Xanh lá

		send(embed1, embed1.title ? embed1.title : embed1.description, 'green')
	});

	// Login to server
	// From MoonU
	minecraftbot.on('windowOpen', async (window) => {
		if (Number(window.slots.length) == 63 || Number(window.slots.length) == 62) {

			const embed = new MessageEmbed()
				.setTitle('Cửa sổ `Chuyển Server` mở')
				.setColor(color.green) // Xanh lá

			send(embed, embed.title ? embed.title : embed.description, 'green')

			minecraftbot.simpleClick.leftMouse(10);

			const embed1 = new MessageEmbed()
				.setTitle('Đã click vào cửa sổ `Chuyển Server`')
				.setColor(color.green) // Xanh lá

			send(embed1, embed1.title ? embed1.title : embed1.description, 'green')

		} else if (Number(window.slots.length) == 45 || Number(window.slots.length) == 46) {
			const embed = new MessageEmbed()
				.setTitle('Cửa sổ `Nhập PIN` mở')
				.setColor(color.green) // Xanh lá
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
				.setColor(color.green) // Xanh lá
			send(embed1, embed1.title ? embed1.title : embed1.description, 'green')
		}
	});

	// Livechat ingame (Mineflayer)
	// Phân loại

	// CHat thường
	const chat = /$<(.+)> (.+)^/;

	// Whisper
	const whisper1 = /^nhắn cho (.+): (.+)$/;
	const whisper2 = /^(.+) nhắn: (.+)$/;

	// Error
	const error1 = /^Unknown command$/;
	const error2 = /^Kicked whilst connecting to (.+)$/;
	const error3 = /^Could not connect to a default or fallback server, please try again later:(.+)$/;
	const error4 = /^Oops something went wrong... Putting you back in queue.$/;
	const error5 = /^Exception Connecting:ReadTimeoutException : null$/;
	const error6 = /^CommandWhitelist > No such command.$/;

	// Donater
	const donater = /^[Broadcast] (.+) (?:đạt mốc nạp|vừa ủng hộ) (.+)$/;

	//Restart
	const restartchat1 = /^UltimateAutoRestart » Restarting in (.+)!$/
	const restartchat2 = /^UltimateAutoRestart » Restarting... join back soon!$/

	//Sleep
	const sleepchat = /^(.+) players sleeping$/

	minecraftbot.on('message', async (message) => {
		// console.log(message.toString())
		if (whisper1.test(message.toString())
			|| whisper2.test(message.toString())) {
			const embed = new MessageEmbed()
				.setDescription(`${message.toString()}`)
				.setColor(color.pink) // Hồng cánh sen thơ mộng mer :Đ
			send(embed, embed.title ? embed.title : embed.description, 'blue')
		}
		else if (error1.test(message.toString())
			|| error2.test(message.toString())
			|| error3.test(message.toString())
			|| error4.test(message.toString())
			|| error5.test(message.toString())
			|| error6.test(message.toString())
		) {
			const embed = new MessageEmbed()
				.setDescription(`${message.toString()}`)
				.setColor(color.red) // Đỏ chói như nụ cười của cờ rớt

			send(embed, embed.title ? embed.title : embed.description, 'red')
			if (error4.test(message.toString())) {
				err++
				if (err >= 5) { minecraftbot.end('Không thể kết nối với server `Chính`'); err = 0 }
			}
		}
		else if (message.getText().toLowerCase().trim() === 'dùng lệnh/anarchyvn  để vào server.') {
			connect++;
			const embed = new MessageEmbed()
				.setDescription(`${message.toString()}`)
				.setColor(color.blue) // Xanh đại dương

			send(embed, embed.title ? embed.title : embed.description, 'blue')

			function connectServer(click, end, minecraftbot) {
				if (click === true && end === false) {
					minecraftbot.chat('/arnarchyvn');
					const embed1 = new MessageEmbed()
						.setTitle('Đã nhập `/2y2c`')
						.setColor(color.green) // Xanh lá chuối

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
		else if (donater.test(message.toString())) {
			const embed = new MessageEmbed()
				.setDescription(`${message.toString()}`)
				.setColor(color.purple) // Tím mộng mer
			send(embed, embed.title ? embed.title : embed.description, 'blue')
		}
		else if (message.toString() === 'The main server is down. We will be back soon!') {
			const embed = new MessageEmbed()
				.setDescription(`${message.toString()}`)
				.setColor(color.red); // Đỏ chói như nụ cười của cờ rớt
			send(embed, embed.title ? embed.title : embed.description, 'red')
			setTimeout(() => { minecraftbot.end('Server Restart'); }, 5000);
		}
		else if (restartchat1.test(message.toString())) {
			const embed = new MessageEmbed()
				.setDescription(`${message.toString()}`)
				.setColor('#e5f00c'); // Vàng khè
			send(embed, embed.title ? embed.title : embed.description, 'orange')
			restartsend(restartchat1.exec(message.toString())[1], false)
		}
		else if (restartchat2.test(message.toString())) {
			const embed = new MessageEmbed()
				.setDescription(`${message.toString()}`)
				.setColor(color.yellow); // Vàng khè
			send(embed, embed.title ? embed.title : embed.description, 'red')
			prepare = true; minecraftbot.end('Server Restart')
			// console.log(prepare)
		}
		else if (sleepchat.test(message.toString())) {
			return
		}
		else {
			if (message.toString() === '') return
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
							.setColor('GREY') // Gray

						send(embed, 'Bắt đầu AFK', 'gray')
					}
				}, 15000);
			}
			const embed = new MessageEmbed()
				.setDescription(`${message.toString()}`);
			if (message.toString().split(' ').shift() === `<${info.name}}>`) {
				embed.setColor(color.blue2);
			} else {
				embed.setColor(color.blue);
			}
			send(embed, embed.title ? embed.title : embed.description, 'blue')
		}
	});


	// Chat to game (Discord)

	// const prefixSchema = require('../models/prefix');
	// const p = process.env.PREFIX
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
						let i = 0;
						const num = Object.values(minecraftbot.players).map(name => name.username).length;
						Object.values(minecraftbot.players).map(name => name.username).forEach((names) => {
							if (names === interaction.options.getString('player')) return interaction.editReply(`✅ | Player ${names} đang onl!`);
							if (i > num) return interaction.editReply('❌ | Player hiện không onl!');
							i++;
						});
					} else if (interaction.commandName === 'players-online') {
						interaction.editReply(`Hiện có ${Object.values(minecraftbot.players).map(name => name.username).length} player(s) đang online trong server bot đang có mặt!`)
					} else if (interaction.commandName === 'chat') {
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
						const num = Object.values(minecraftbot.players).map(name => name.username).length;
						Object.values(minecraftbot.players).map(name => name.username).forEach((names) => {
							if (names === interaction.options.getString('player')) return interaction.editReply(`✅ | Player ${names} đang onl!`);
							if (i > num) return interaction.editReply('❌ | Player hiện không onl!');
							i++;
						});
					} else if (interaction.commandName === 'players-online') {
						interaction.editReply(`Hiện có ${Object.values(minecraftbot.players).map(name => name.username).length} player(s) đang online trong server bot đang có mặt!`)
					} else if (interaction.commandName === 'chat') {

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
	})

	// Login when kicked

	var kickcount = 0
		, rejoin = 0
	minecraftbot.on('end', (reason) => {
		// console.log(`${reason} || ${prepare}`)
		client.user.setStatus('idle')
		client2.user.setStatus('idle')
		end = true;
		let res = reason
		if (reason === 'player_under_15') res = 'Server có dưới 15 người chơi.'
		if (kickcount < 2) { rejoin = 1; kickcount++ }
		else { rejoin = 5; }
		if (
			reason.toString().toLowerCase() == 'server restart'
		) { rejoin = 5; restart = true }
		if (prepare === true && reason.toString().toLowerCase() == 'server restart') restartsend('', true)
		const embed = new MessageEmbed()
			.setDescription(
				`**Bot đã mất kết nối đến server \`${info.ip}\`!\nLý do: \`${res}\`\nKết nối lại sau ${rejoin} phút**`
			)
			.setColor('#f00c0c') // Đỏ
		send(embed, embed.title ? embed.title : embed.description, 'red')
		setTimeout(async () => {
			let server = await util.status('2y2c.org', 25565)
			if (server.players.online < 15 && restart === true) {
				minecraftbot.end('player_under_15')
			} else {
				const embed = new MessageEmbed()
					.setDescription('Đang kết nối lại với ' + info.ip + '...')
					.setColor(color.yellow)
				send(embed, embed.title ? embed.title : embed.description, 'orange')
				createBot(client, client2);
			}
		}, ms(`${rejoin}m`));
	});
	/*
	minecraftbot.on('kicked', (reason) => {
		if (reason.toLowerCase() === 'You have lost connecting to server'.toLowerCase()) {
			restartsend('', true)
		}
	})
	*/

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
		if (info.name === 'BotNameisOggy') return
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