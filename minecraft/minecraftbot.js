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
		if (c === 'blue' || c === 'xanh d????ng') {
			return '```md\n# ' + msg.toString() + '```'
		}
		else if (c === 'orange' || c === 'cam') {
			return '```cs\n# ' + msg.toString() + '```'
		}
		else if (c === 'red' || c === '?????') {
			return '```cs\n- ' + msg.toString() + '```'
		}
		else if (c === 'green' || c === 'xanh l??') {
			return '```cs\n+ ' + msg.toString() + '```'
		}
		else if (c === 'gray' || c === 'grey' || c === 'x??m') {
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
					if (!now) str = `${role} | Server s??? restart trong ${time} n???a!`
					else str = `${role} | Server ??ang restart!`
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
					if (!now) str = `${role} | Server s??? restart trong ${time} n???a!`
					else str = `${role} | Server ??ang restart!`
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
					.setTitle('B???t ?????u afk')
					.setColor('GREY') // X??m
				send(embed, 'B???t ?????u AFK', 'gray')
			}, 15000);
		}
		const embed1 = new MessageEmbed()
			.setTitle('???? k???t n???i v???i server ' + server)
			.setColor(color.green) // Xanh l??

		send(embed1, embed1.title ? embed1.title : embed1.description, 'green')
	});

	// Login to server
	// From MoonU
	minecraftbot.on('windowOpen', async (window) => {
		if (Number(window.slots.length) == 63 || Number(window.slots.length) == 62) {

			const embed = new MessageEmbed()
				.setTitle('C???a s??? `Chuy???n Server` m???')
				.setColor(color.green) // Xanh l??

			send(embed, embed.title ? embed.title : embed.description, 'green')

			minecraftbot.simpleClick.leftMouse(13);

			const embed1 = new MessageEmbed()
				.setTitle('???? click v??o c???a s??? `Chuy???n Server`')
				.setColor(color.green) // Xanh l??

			send(embed1, embed1.title ? embed1.title : embed1.description, 'green')

		} else if (Number(window.slots.length) == 45 || Number(window.slots.length) == 46) {
			const embed = new MessageEmbed()
				.setTitle('C???a s??? `Nh???p PIN` m???')
				.setColor(color.green) // Xanh l??
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
				.setTitle('???? nh???p m???t kh???u')
				.setColor(color.green) // Xanh l??
			send(embed1, embed1.title ? embed1.title : embed1.description, 'green')
		}
	});

	// Livechat ingame (Mineflayer)
	// Ph??n lo???i

	// CHat th?????ng
	const chat = /$<(.+)> (.+)^/;

	// Whisper
	const whisper1 = /^nh???n cho (.+): (.+)$/;
	const whisper2 = /^(.+) nh???n: (.+)$/;

	// Error
	const error1 = /^Unknown command$/;
	const error2 = /^Kicked whilst connecting to (.+)$/;
	const error3 = /^Could not connect to a default or fallback server, please try again later:(.+)$/;
	const error4 = /^Oops something went wrong... Putting you back in queue.$/;
	const error5 = /^Exception Connecting:ReadTimeoutException : null$/;
	const error6 = /^CommandWhitelist > No such command.$/;

	// Donater
	const donater = /^[Broadcast] (.+) (?:?????t m???c n???p|v???a ???ng h???) (.+)$/;

	//Restart
	const restartchat1 = /^UltimateAutoRestart ?? Restarting in (.+)!$/
	const restartchat2 = /^UltimateAutoRestart ?? Restarting... join back soon!$/

	//Sleep
	const sleepchat = /^(.+) players sleeping$/

	minecraftbot.on('message', async (message) => {
		// console.log(message.toString())
		if (whisper1.test(message.toString())
			|| whisper2.test(message.toString())) {
			const embed = new MessageEmbed()
				.setDescription(`${message.toString()}`)
				.setColor(color.pink) // H???ng c??nh sen th?? m???ng mer :??
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
				.setColor(color.red) // ????? ch??i nh?? n??? c?????i c???a c??? r???t

			send(embed, embed.title ? embed.title : embed.description, 'red')
			if (error4.test(message.toString())) {
				err++
				if (err >= 5) { minecraftbot.end('Kh??ng th??? k???t n???i v???i server `Ch??nh`'); err = 0 }
			}
		}
		else if (message.getText().toLowerCase().trim() === 'd??ng l???nh/anarchyvn  ????? v??o server.') {
			connect++;
			const embed = new MessageEmbed()
				.setDescription(`${message.toString()}`)
				.setColor(color.blue) // Xanh ?????i d????ng

			send(embed, embed.title ? embed.title : embed.description, 'blue')

			function connectServer(click, end, minecraftbot) {
				if (click === true && end === false) {
					minecraftbot.chat('/anarchyvn');
					const embed1 = new MessageEmbed()
						.setTitle('???? nh???p `/anarchyvn`')
						.setColor(color.green) // Xanh l?? chu???i

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
				minecraftbot.end('Kh??ng th??? k???t n???i v???i server `H??ng ch???`');
			}
		}
		else if (donater.test(message.toString())) {
			const embed = new MessageEmbed()
				.setDescription(`${message.toString()}`)
				.setColor(color.purple) // T??m m???ng mer
			send(embed, embed.title ? embed.title : embed.description, 'blue')
		}
		else if (message.toString() === 'The main server is down. We will be back soon!') {
			const embed = new MessageEmbed()
				.setDescription(`${message.toString()}`)
				.setColor(color.red); // ????? ch??i nh?? n??? c?????i c???a c??? r???t
			send(embed, embed.title ? embed.title : embed.description, 'red')
			setTimeout(() => { minecraftbot.end('Server Restart'); }, 5000);
		}
		else if (restartchat1.test(message.toString())) {
			const embed = new MessageEmbed()
				.setDescription(`${message.toString()}`)
				.setColor('#e5f00c'); // V??ng kh??
			send(embed, embed.title ? embed.title : embed.description, 'orange')
			restartsend(restartchat1.exec(message.toString())[1], false)
		}
		else if (restartchat2.test(message.toString())) {
			const embed = new MessageEmbed()
				.setDescription(`${message.toString()}`)
				.setColor(color.yellow); // V??ng kh??
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
							.setTitle('B???t ?????u afk')
							.setColor('GREY') // Gray

						send(embed, 'B???t ?????u AFK', 'gray')
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
				if (end === true) return message.channel.send('???? | Bot ??ang m???t k???t n???i v???i server `' + info.ip + '`')
				if (cmd === 'checkonline' || cmd === 'conl') {
					let i = 0;
					const num = Object.values(minecraftbot.players).map(name => name.username).length;
					Object.values(minecraftbot.players).map(name => name.username).forEach((names) => {
						if (names === args[0]) return message.channel.send(`??? | Player ${names} ??ang onl!`);
						if (i > num) return message.channel.send('??? | Player hi???n kh??ng onl!');
						i++;
					});
				} else if (cmd === 'playeronline' || cmd === 'ponl' || cmd === 'player-online' || cmd === 'players-online') {
					message.channel.send('Hi???n c?? `' + Object.values(minecraftbot.players).map(name => name.username).length + '` player(s) ??ang onl trong server bot ??ang ???!')
				} else if (cmd === 'chat') {
					if (end === true) {
						message.reactions.removeAll()
						message.react('???')
					} else {
						try {
							minecraftbot.chat(`<${message.author.tag}> ${message.content.split(' ').slice(1).join(' ')}`)
							message.reactions.removeAll()
							message.react('???')
						} catch (error) {
							message.reactions.removeAll()
							message.react('???')
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
							if (names === interaction.options.getString('player')) return interaction.editReply(`??? | Player ${names} ??ang onl!`);
							if (i > num) return interaction.editReply('??? | Player hi???n kh??ng onl!');
							i++;
						});
					} else if (interaction.commandName === 'players-online') {
						interaction.editReply(`Hi???n c?? ${Object.values(minecraftbot.players).map(name => name.username).length} player(s) ??ang online trong server bot ??ang c?? m???t!`)
					} else if (interaction.commandName === 'chat') {
						try {
							minecraftbot.chat(`<${interaction.user.tag}> ${interaction.options.getString('chat')}`)
							interaction.editReply('??? | ???? g???i chat!')
						} catch (error) {
							interaction.editReply('??? | Kh??ng th??? g???i chat!\n???? | L?? do: ```' + error + '```')
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
				if (end === true) return message.channel.send('???? | Bot ??ang m???t k???t n???i v???i server `' + info.ip + '`')
				if (cmd === 'checkonline' || cmd === 'conl') {
					let i = 0;
					const num = Object.values(minecraftbot.players).map(name => name.username).length;
					Object.values(minecraftbot.players).map(name => name.username).forEach((names) => {
						if (names === args[0]) return message.channel.send(`??? | Player ${names} ??ang onl!`);
						if (i > num) return message.channel.send('??? | Player hi???n kh??ng onl!');
						i++;
					});
				} else if (cmd === 'playeronline' || cmd === 'ponl' || cmd === 'player-online' || cmd === 'players-online') {
					message.channel.send('Hi???n c?? `' + Object.values(minecraftbot.players).map(name => name.username).length + '` player(s) ??ang onl trong server bot ??ang ???!')
				} else if (cmd === 'chat') {
					if (end === true) {
						message.reactions.removeAll()
						message.react('???')
					} else {
						try {
							minecraftbot.chat(`<${message.author.tag}> ${message.content.split(' ').slice(1).join(' ')}`)
							message.reactions.removeAll()
							message.react('???')
						} catch (error) {
							message.reactions.removeAll()
							message.react('???')
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
								.setTitle(`??? | L???nh \`${cmd}\` ???? b??? t???t b???i Admin`)
								.setColor('#f00c0c')
						]
					})
				} else if (ava === true || !ava) {
					if (!interaction.deferred) await require('../util/delay')(1000)
					if (interaction.commandName === 'check-online') {
						const num = Object.values(minecraftbot.players).map(name => name.username).length;
						Object.values(minecraftbot.players).map(name => name.username).forEach((names) => {
							if (names === interaction.options.getString('player')) return interaction.editReply(`??? | Player ${names} ??ang onl!`);
							if (i > num) return interaction.editReply('??? | Player hi???n kh??ng onl!');
							i++;
						});
					} else if (interaction.commandName === 'players-online') {
						interaction.editReply(`Hi???n c?? ${Object.values(minecraftbot.players).map(name => name.username).length} player(s) ??ang online trong server bot ??ang c?? m???t!`)
					} else if (interaction.commandName === 'chat') {

						try {
							minecraftbot.chat(`<${interaction.user.tag}> ${interaction.options.getString('chat')}`)
							interaction.editReply('??? | ???? g???i chat!')
						} catch (error) {
							interaction.editReply('??? | Kh??ng th??? g???i chat!\n???? | L?? do: ```' + error + '```')
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
		if (reason === 'player_under_15') res = 'Server c?? d?????i 15 ng?????i ch??i.'
		if (kickcount < 2) { rejoin = 1; kickcount++ }
		else { rejoin = 5; }
		if (
			reason.toString().toLowerCase() == 'server restart'
		) { rejoin = 5; restart = true }
		if (prepare === true && reason.toString().toLowerCase() == 'server restart') restartsend('', true)
		const embed = new MessageEmbed()
			.setDescription(
				`**Bot ???? m???t k???t n???i ?????n server \`${info.ip}\`!\nL?? do: \`${res}\`\nK???t n???i l???i sau ${rejoin} ph??t**`
			)
			.setColor('#f00c0c') // ?????
		send(embed, embed.title ? embed.title : embed.description, 'red')
		setTimeout(async () => {
			let server = await util.status(info.ip, 25565)
			if (server.players.online < 15 && restart === true) {
				minecraftbot.end('player_under_15')
			} else {
				const embed = new MessageEmbed()
					.setDescription('??ang k???t n???i l???i v???i ' + info.ip + '...')
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
	* Command c???a bot ingame
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
		if (!command) return minecraftbot.chat(`/msg ${username} Error: Kh??ng t??m th???y command!!`)
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
	const kill1 = /^(.+) b??? gi???t b???i (.+) s??? d???ng (.+)$/;
	const kill2 = /^(.+) b??? ?????y t?? xu???ng v???c b???i (.+)$/;
	const kill3 = /^(.+) ch???t ng???t v?? ????o bi???t b??i$/;
	const kill4 = /^(.+) b??? th??ng ????t ?????n ch???t$/;
	const kill5 = /^(.+) ch???t ????i$/;
	const kill6 = /^(.+) c??? ngh?? ch??y l?? ng???u$/;
	const kill7 = /^(.+) t?? ?????p con m??? n?? m???t$/;
	const kill8 = /^(.+) b?? cu t??? s??t$/;
	const kill9 = /^(.+) T???p b??i trong lava$/;
	const kill10 = /^(.+) ??ang leo l??n th?? t?? kh???i d??y leo$/;
	const kill11 = /^(.+) ???? b??? gi???t b???i (.+)$/;
	const kill12 = /^(.+) ?????p m???t v??o c???t ??i???n$/;
	const kill13 = /^(.+) ngh?? r???ng c???u ???y b??i ???????c ho??i$/;
	const kill14 = /^(.+) ch???t ch??y$/;
	const kill15 = /^(.+) ??ang leo l??n th?? t?? kh???i Thang$/;
	const kill16 = /^(.+) b??? b???t b???i (.+) d??ng (.+)$/;
	const kill17 = /^(.+) ???? gi???t (.+) b???ng (.+)$/;
	const kill18 = /^(.+) b??? gi???t b???i (.+)$/;
	const kill19 = /^(.+) ???? gi???t h???i (.+) b???ng (.+)$/;
	const kill20 = /^(.+) ch???t khi t???m x??ng h??i$/;
	const kill21 = /^(.+) b??p chim t??? t???$/;
	const kill22 = /^(.+) n??? banh x??c (.+) v???i tnt$/;
	const kill23 = /^(.+) was blown up by a Creeper$/;
	const kill24 = /^(.+) (?:n???|n???) banh chim$/;
	const kill25 = /^(.+) b??? gi???t b???i (.+) d??ng (.+)$/;
	const kill26 = /^(.+) b??? s??t ????nh$/;
	const kill27 = /^(.+) b??? ???? ch???t b???i ??e$/;
	const kill28 = /^(.+) ng??? d?????i nether :kappa: $/;
	const kill29 = /^(.+) b??? h???i ?????ng b???i (.+) S??? d???ng (.+)$/;
	const kill30 = /^(.+) b??? b???c h??i$/;

	// Nh???p v??o database
	const kd = require('../models/kd');
	const date = new Date();
	const joinDate = `Ng ${date.getDate()},Thg ${date.getMonth() + 1},N??m ${date.getFullYear()}`;

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
			const message = `${victim} b??? gi???t b???i ${killer} d??ng ${weapon}`;
			// Victim
			victimWriter(victim, message, kd)
			// Killer
			killerWriter(killer, message, kd)
		}
		else if (kill2.test(str)) {
			const victim = `${kill2.exec(str)[1]}`;
			const killer = `${kill2.exec(str)[2]}`;
			const message = `${victim} b??? ?????y xu???ng v???c ${killer}`;
			// Victim
			victimWriter(victim, message, kd)
			// Killer
			killerWriter(killer, message, kd)
		}
		else if (kill3.test(str)) {
			const victim = `${kill3.exec(str)[1]}`;
			const message = `${victim} ch???t ng???t v?? ????o bi???t b??i`;
			// Victim
			victimWriter(victim, message, kd)
		}
		else if (kill4.test(str)) {
			const victim = `${kill4.exec(str)[1]}`;
			const message = `${victim} b??? th??ng ????t ?????n ch???t`;
			// Victim
			victimWriter(victim, message, kd)
		}
		else if (kill5.test(str)) {
			const victim = `${kill5.exec(str)[1]}`;
			const message = `${victim} ch???t ????i`;
			// Victim
			victimWriter(victim, message, kd)
		}
		else if (kill6.test(str)) {
			const victim = `${kill6.exec(str)[1]}`;
			const message = `${victim} c??? ngh?? ch??y l?? ng???u`;
			// Victim
			victimWriter(victim, message, kd)
		}
		else if (kill7.test(str)) {
			const victim = `${kill7.exec(str)[1]}`;
			const message = `${victim} t?? ?????p con m??? n?? m???t`;
			// Victim
			victimWriter(victim, message, kd)
		}
		else if (kill8.test(str)) {
			const victim = `${kill8.exec(str)[1]}`;
			const message = `${victim} b?? cu t??? s??t`;
			// Victim
			victimWriter(victim, message, kd)
		}
		else if (kill9.test(str)) {
			const victim = `${kill9.exec(str)[1]}`;
			const message = `${victim} T???p b??i trong lava`;
			// Victim
			victimWriter(victim, message, kd)
		}
		else if (kill10.test(str)) {
			const victim = `${kill10.exec(str)[1]}`;
			const message = `${victim} ??ang leo th?? t?? kh???i d??y leo`;
			// Victim
			victimWriter(victim, message, kd)
		}
		else if (kill11.test(str)) {
			const victim = `${kill11.exec(str)[1]}`;
			const killer = `${kill11.exec(str)[2]}`;
			const message = `${victim} b??? gi???t b???i ${killer}`;
			// Victim
			victimWriter(victim, message, kd)
			// Killer
			killerWriter(killer, message, kd)
		}
		else if (kill12.test(str)) {
			const victim = `${kill12.exec(str)[1]}`;
			const message = `${victim} ?????p m???t v??o c???t ??i???n`;
			// Victim
			kvictimWriter(victim, message, kd)
		}
		else if (kill13.test(str)) {
			const victim = `${kill13.exec(str)[1]}`;
			const message = `${victim} ngh?? r???ng c???u ???y b??i ???????c ho??i`;
			// Victim
			victimWriter(victim, message, kd)
		}
		else if (kill14.test(str)) {
			const victim = `${kill14.exec(str)[1]}`;
			const message = `${victim} ch???t ch??y`;
			// Victim
			victimWriter(victim, message, kd)
		}
		else if (kill15.test(str)) {
			const victim = `${kill15.exec(str)[1]}`;
			const message = `${victim} ??ang leo th?? t?? kh???i thang`;
			// Victim
			victimWriter(victim, message, kd)
		}
		else if (kill16.test(str)) {
			const victim = `${kill16.exec(str)[1]}`;
			const killer = `${kill16.exec(str)[2]}`;
			const weapon = `${kill16.exec(str)[3]}`;
			const message = `${victim} b??? b???n b???i ${killer} s??? d???ng ${weapon}`;
			// Victim
			victimWriter(victim, message, kd)
			// Killer
			killerWriter(killer, message, kd)
		}
		else if (kill17.test(str)) {
			const victim = `${kill17.exec(str)[2]}`;
			const killer = `${kill17.exec(str)[1]}`;
			const weapon = `${kill17.exec(str)[3]}`;
			const message = `${killer} ???? gi???t ${victim} d??ng ${weapon}`;
			// Victim
			victimWriter(victim, message, kd)
			// Killer
			killerWriter(killer, message, kd)
		}
		else if (kill18.test(str)) {
			const victim = `${kill18.exec(str)[1]}`;
			const killer = `${kill18.exec(str)[2]}`;
			const message = `${victim} b??? gi???t b???i ${killer}`;
			// Victim
			victimWriter(victim, message, kd)
			// Killer
			killerWriter(killer, message, kd)
		}
		else if (kill19.test(str)) {
			const victim = `${kill19.exec(str)[1]}`;
			const killer = `${kill19.exec(str)[2]}`;
			const weapon = `${kill19.exec(str)[3]}`;
			const message = `${victim} ???? gi???t h???i ${killer} b???ng ${weapon}`;
			// Victim
			victimWriter(victim, message, kd)
			// Killer
			killerWriter(killer, message, kd)
		}
		else if (kill20.test(str)) {
			const victim = `${kill13.exec(str)[1]}`;
			const message = `${victim} ch???t khi t???m x??ng h??i`;
			// Victim
			victimWriter(victim, message, kd)
		}
		else if (kill21.test(str)) {
			const victim = `${kill21.exec(str)[1]}`;
			const message = `${victim} b??p chim t??? t???`;
			// Victim
			victimWriter(victim, message, kd)
		}
		else if (kill22.test(str)) {
			const killer = `${kill22.exec(str)[2]}`;
			const victim = `${kill22.exec(str)[1]}`;
			const message = `${victim} n??? banh x??c ${killer} b???ng tnt`;
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
			const message = `${victim} n??? banh chim`;
			// Victim
			victimWriter(victim, message, kd)
		}
		else if (kill25.test(str)) {
			const victim = `${kill25.exec(str)[1]}`;
			const killer = `${kill25.exec(str)[2]}`;
			const weapon = `${kill25.exec(str)[3]}`;
			const message = `${victim} b??? gi???t b???i ${killer} d??ng ${weapon}`;
			// Victim
			victimWriter(victim, message, kd)
			// Killer
			killerWriter(killer, message, kd)
		}
		else if (kill26.test(str)) {
			const victim = `${kill26.exec(str)[1]}`;
			const message = `${victim} b??? s??t ????nh`;
			// Victim
			victimWriter(victim, message, kd)
		}
		else if (kill27.test(str)) {
			const victim = `${kill27.exec(str)[1]}`;
			const message = `${victim} b?? ???? ch???t b???i ??e`;
			// Victim
			victimWriter(victim, message, kd)
		}
		else if (kill28.test(str)) {
			const victim = `${kill28.exec(str)[1]}`;
			const message = `${victim} ng??? d?????i nether :kappa:`;
			// Victim
			victimWriter(victim, message, kd)
		}
		else if (kill29.test(str)) {
			const victim = `${kill29.exec(str)[1]}`;
			const killer = `${kill29.exec(str)[2]}`;
			const weapon = `${kill29.exec(str)[3]}`;
			const message = `${victim} b??? h???i ?????ng b???i ${killer} d??ng ${weapon}`;
			// Victim
			victimWriter(victim, message, kd)
			// Killer
			killerWriter(killer, message, kd)
		}
		else if (kill30.test(str)) {
			const victim = `${kill30.exec(str)[1]}`;
			const message = `${victim} b??? b???c h??i`;
			// Victim
			victimWriter(victim, message, kd)
		}
	});
}

// Export module ra index.js
module.exports.createBot = createBot;