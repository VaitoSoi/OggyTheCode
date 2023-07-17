// Import package
import Discord from 'discord.js'
import * as Mineflayer from 'mineflayer'
import mongoose from 'mongoose'
import _package from '../package.json';
import ms from 'ms'
import express from './web/index'
import fs from 'fs'

// Import Mineflayer plugins
import afk from './plugins/default/afk'
import tps from './plugins/default/tps'
import custom_bot from './plugins/default/custom_bot'

// Import handler modules
import { DiscordEventsHandler, MineflayerEventsHandler } from './handlers/events'
import { DiscordCommandHandler, MineflayerCommandHandler } from './handlers/command'


/*
 * Main Client 
 */
interface Package {
    name: string;
    version: string;
    main: string;
    repository: string;
    github: string;
    author: string;
    license: string;
    dependencies: {
        [key: string]: string
    };
    type: string;
}
interface Data {
    loginAt: number;
    currentCluster: number;
    lastMsg: number;
    statusInterval: {
        client_1: any
        client_2: any
    }
}
interface Commands {
    discord: {
        collections: Discord.Collection<string, SlashCommandBuilder | SlashCommandBuilderWithData>,
        json: Array<Discord.RESTPostAPIChatInputApplicationCommandsJSONBody>
    },
    mineflayer: {
        collections: Discord.Collection<string, MineflayerCommandBuilder>
    }
}
export class Oggy {
    config: ENV | YAML;
    client_1: Discord.Client;
    client_2: Discord.Client;
    bot?: Mineflayer.Bot;
    package: Package;
    data: Data
    commands: Commands
    express: express
    constructor(config: ENV | YAML) {
        this.config = config
        this.commands = {
            discord: {
                collections: new Discord.Collection(),
                json: []
            },
            mineflayer: {
                collections: new Discord.Collection()
            }
        }
        this.package = _package
        this.data = {
            loginAt: 0,
            currentCluster: 0,
            lastMsg: Date.now(),
            statusInterval: {
                client_1: 0,
                client_2: 0
            }
        }
        const clientConfig = {
            intents: [
                Discord.GatewayIntentBits.Guilds,
                Discord.GatewayIntentBits.GuildMessages,
                Discord.GatewayIntentBits.MessageContent,
                Discord.GatewayIntentBits.GuildMessageReactions,
            ],
            partials: [Discord.Partials.Channel, Discord.Partials.Message, Discord.Partials.User, Discord.Partials.Reaction]
        }
        this.client_1 = new Discord.Client(clientConfig)
        this.client_2 = new Discord.Client(clientConfig);
        (async () => await mongoose.connect(this.config.database.link))()
        this.express = new express(this)
    };
    setConfig(config: ENV | YAML): Oggy {
        this.config = config;
        return this
    }
    async start(): Promise<void> {
        process.on('rejectionHandled', (error) => console.error(error))
        await DiscordCommandHandler(this)
        await MineflayerCommandHandler(this)
        this.discord_login(this.client_1, this.config.discord.token.client_1, 1)
        if (this.config.discord.token.client_2)
            this.discord_login(this.client_2, this.config.discord.token.client_2, 2)
        this.minecraft_start()
        this.express.listen(this.config.express.port)
    }
    private discord_login(client: Discord.Client, token: string, type: number = 1): void {
        client.login(token)
            .then(() => console.log(`[DISCORD.JS] [${client?.user?.tag}] Logined`))
            .catch(console.error)
        client.on(Discord.Events.Error, console.error);
        client.on(Discord.Events.Warn, console.error);
        client.on(Discord.Events.ClientReady, async (client) => {
            console.log(`[DISCORD.JS] [${client.user.tag}] User is ready`)
            DiscordEventsHandler({ client, oggy: this })
            const rest = new Discord.REST().setToken(token)
            const data = await rest.put(
                Discord.Routes.applicationCommands(client.user.id),
                { body: this.commands.discord.json },
            );
            console.log(`[DISCORD.JS] [${client.user.tag}] Registered ${(<Array<Discord.RESTPostAPIChatInputApplicationCommandsJSONBody>>data).length ?? 0}/${this.commands.discord.json.length} application (/) commands.`);
            this.startStatusInterval(client, type)
        })
    }
    public minecraft_start(): void {
        this.bot?.end()
        const option: Mineflayer.BotOptions = {
            username: this.config.minecraft.account.username,
            password: this.config.minecraft.account.password,
            host: this.config.minecraft.server.ip,
            version: this.config.minecraft.server.version,
            hideErrors: true
        }
        this.bot = Mineflayer.createBot(option)
        MineflayerEventsHandler({ bot: this.bot, oggy: this })
        custom_bot(this.bot, this)
        this.bot.loadPlugins([afk, tps]);
        this.bot.once('spawn', () => {
            this.data.loginAt = Date.now()
            this.data.currentCluster = -1
        });
        this.bot.once('end', () =>
            void setTimeout(() =>
                this.minecraft_start(),
                this.config.minecraft.server.reconnectTimeout
            )
        );
    }
    private startStatusInterval(client: Discord.Client<true>, client_enum: number = 1): void {
        clearInterval(this.data.statusInterval[client_enum == 1 ? 'client_1' : 'client_2'])
        const type = this.config.status.type
        switch (type) {
            case 'discord':
                let i = 0;
                this.data.statusInterval[client_enum == 1 ? 'client_1' : 'client_2'] = setInterval(() => {
                    const activity_arr = this.config.status.discord.text;
                    const activity = activity_arr[i];
                    const status: Discord.PresenceStatusData = this.config.status.discord.status;
                    client.user.setPresence({ activities: [{ name: activity }], status })
                    i++
                    if (i >= activity_arr.length) i = 0
                }, this.config.status.updateInterval)
                break;
            case 'minecraft':
                this.data.statusInterval[client_enum == 1 ? 'client_1' : 'client_2'] = setInterval(() => {
                    if (!this.bot)
                        client.user.setPresence({ activities: [{ name: 'Bot is offline...' }], status: this.config.status.minecraft.disconnect })
                    else {
                        const tps = (<any>this.bot).getTps() || 20
                        const ping = this.bot.player?.ping ?? 100
                        const players = Object.keys(this.bot.players ?? {}).length || 1
                        const status = this.config.status.minecraft.connect
                        client.user.setPresence({ activities: [{ name: `TPS: ${tps} | ${ping}ms | ${players} players` }], status })
                    }
                }, this.config.status.updateInterval)
                break;
        }
    }
}


/*
 * Minecraft Thing
 */
export const Cluster = [
    'Pin',
    'Queue',
    'Main'
]


/*
 * Command Builder 
 */
type Callback<T> = T | PromiseLike<T>
export interface Bot extends Mineflayer.Bot {
    getTps(): number
    afk: {
        start(): void
        stop(): void
    }
}

export type CommandInteraction = Discord.ChatInputCommandInteraction
export class SlashCommandBuilder extends Discord.SlashCommandBuilder {
    run: (interaction: CommandInteraction, client: Oggy) => Callback<void | any>
    autocompleteRun: (interaction: Discord.AutocompleteInteraction, client: Oggy) => Callback<void | any>
    constructor() {
        super()
        this.setName('name')
        this.setDescription('description')
        this.setDMPermission(false)
    }
    setRun(run: (interaction: CommandInteraction, client: Oggy) => Callback<void | any>) { this.run = run; return this; }
    setAutocompleteRun(run: (interaction: Discord.AutocompleteInteraction, client: Oggy) => Callback<void | any>) { this.autocompleteRun = run; return this; }
}
interface SlashCommandBuilderWithDataOption {
    data: Discord.SlashCommandBuilder | Discord.SlashCommandSubcommandsOnlyBuilder
    run: (interaction: CommandInteraction, client: Oggy) => Callback<void | any>
    autocompleteRun: (interaction: Discord.AutocompleteInteraction, client: Oggy) => Callback<void | any>
}
export class SlashCommandBuilderWithData {
    data: Discord.SlashCommandBuilder | Discord.SlashCommandSubcommandsOnlyBuilder
    run: (interaction: CommandInteraction, client: Oggy) => Callback<void | any>
    autocompleteRun: (interaction: Discord.AutocompleteInteraction, client: Oggy) => Callback<void | any>
    constructor(config?: SlashCommandBuilderWithDataOption) {
        this.data = config?.data ?? new SlashCommandBuilder()
        this.data.setDMPermission(false)
        this.run = config?.run ?? function () { }
        this.autocompleteRun = config?.autocompleteRun ?? function () { }
    }
    setData(data: Discord.SlashCommandBuilder | Discord.SlashCommandSubcommandsOnlyBuilder) {
        this.data = data
        return this
    }
    setRun(run: (interaction: CommandInteraction, client: Oggy) => Callback<void | any>) {
        this.run = run
        return this
    }
    setAutocompleteRun(run: (interaction: Discord.AutocompleteInteraction, client: Oggy) => Callback<void | any>) {
        this.autocompleteRun = run
        return this
    }
}

interface MineflayerCommandBuilderOption {
    name: string;
    description: string;
    usage: string
    aliases: Array<string>
    run: (args: Array<string>, bot: Mineflayer.Bot) => Callback<void | any>
}
export class MineflayerCommandBuilder {
    name: string;
    description: string;
    usage: string
    aliases: Array<string>
    run: (args: Array<string>, bot: Mineflayer.Bot) => Callback<void | any>
    constructor(option?: MineflayerCommandBuilderOption) {
        this.name = option?.name || 'Ủa sao có lệnh nì hay vậy :)?'
        this.description = option?.description ?? 'Lệnh không có miêu tả'
        this.usage = option?.usage ?? 'Lệnh không có cách dùng'
        this.aliases = option?.aliases ?? []
        this.run = option?.run ?? function () { }
    }
    setName(name: string) {
        this.name = name; return this;
    };
    setDescription(description: string) {
        this.description = description; return this;
    };
    setUsage(usage: string) {
        this.usage = usage; return this;
    };
    setAliases(aliases: Array<string>) {
        this.aliases = aliases; return this;
    };
    setRun(run: (args: Array<string>, bot: Mineflayer.Bot) => Callback<void | any>) {
        this.run = run; return this;
    };
}

interface CompilerCommandOption {
    name: string;
    run: (...args: any[]) => Callback<any>
}
export class CompilerCommandBuilder {
    name: string;
    run: (...args: any[]) => Callback<any>
    constructor(option?: CompilerCommandOption) {
        this.name = option?.name || 'command'
        this.run = option?.run || function () { }
    }
    setName(name: string) {
        this.name = name; return this;
    };
    setRun(run: (...args: any[]) => Callback<any>) {
        this.run = run; return this
    }
}


/*
 * Event Builder
 */
export type DiscordEvents = Discord.Events
export enum MineflayerEvents {
    "Chat" = "chat",
    "Whisper" = "whisper",
    "ActionBar" = "actionBar",
    "Message" = "message",
    "MessageStr" = "messagestr",
    "InjectAllowed" = "inject_allowed",
    "Login" = "login",
    "Spawn" = "spawn",
    "Respawn" = "respawn",
    "Game" = "game",
    "ResourcePack" = "resourcePack",
    "Title" = "title",
    "Rain" = "rain",
    "WeatherUpdate" = "weatherUpdate",
    "Time" = "time",
    "Kicked" = "kicked",
    "End" = "end",
    "Error" = "error",
    "SpawnReset" = "spawnReset",
    "Death" = "death",
    "Health" = "health",
    "Breath" = "breath",
    "EntityAttributes" = "entityAttributes",
    "EntitySwingArm" = "entitySwingArm",
    "EntityHurt" = "entityHurt",
    "EntityDead" = "entityDead",
    "EntityTaming" = "entityTaming",
    "EntityTamed" = "entityTamed",
    "EntityShakingOffWater" = "entityShakingOffWater",
    "EntityEatingGrass" = "entityEatingGrass",
    "EntityWake" = "entityWake",
    "EntityEat" = "entityEat",
    "EntityCriticalEffect" = "entityCriticalEffect",
    "EntityMagicCriticalEffect" = "entityMagicCriticalEffect",
    "EntityCrouch" = "entityCrouch",
    "EntityUncrouch" = "entityUncrouch",
    "EntityEquip" = "entityEquip",
    "EntitySleep" = "entitySleep",
    "EntitySpawn" = "entitySpawn",
    "ItemDrop" = "itemDrop",
    "PlayerCollect" = "playerCollect",
    "EntityGone" = "entityGone",
    "EntityMoved" = "entityMoved",
    "EntityDetach" = "entityDetach",
    "EntityAttach" = "entityAttach",
    "EntityUpdate" = "entityUpdate",
    "EntityEffect" = "entityEffect",
    "EntityEffectEnd" = "entityEffectEnd",
    "PlayerJoined" = "playerJoined",
    "PlayerUpdated" = "playerUpdated",
    "PlayerLeft" = "playerLeft",
    "BlockUpdate" = "blockUpdate",
    "BlockPlaced" = "blockPlaced",
    "ChunkColumnLoad" = "chunkColumnLoad",
    "ChunkColumnUnload" = "chunkColumnUnload",
    "SoundEffectHeard" = "soundEffectHeard",
    "HardcodedSoundEffectHeard" = "hardcodedSoundEffectHeard",
    "NoteHeard" = "noteHeard",
    "PistonMove" = "pistonMove",
    "ChestLidMove" = "chestLidMove",
    "BlockBreakProgressObserved" = "blockBreakProgressObserved",
    "BlockBreakProgressEnd" = "blockBreakProgressEnd",
    "DiggingCompleted" = "diggingCompleted",
    "DiggingAborted" = "diggingAborted",
    "Move" = "move",
    "ForcedMove" = "forcedMove",
    "Mount" = "mount",
    "Dismount" = "dismount",
    "WindowOpen" = "windowOpen",
    "WindowClose" = "windowClose",
    "Sleep" = "sleep",
    "Wake" = "wake",
    "Experience" = "experience",
    "ScoreboardCreated" = "scoreboardCreated",
    "ScoreboardDeleted" = "scoreboardDeleted",
    "ScoreboardTitleChanged" = "scoreboardTitleChanged",
    "ScoreUpdated" = "scoreUpdated",
    "ScoreRemoved" = "scoreRemoved",
    "ScoreboardPosition" = "scoreboardPosition",
    "TeamCreated" = "teamCreated",
    "TeamRemoved" = "teamRemoved",
    "TeamUpdated" = "teamUpdated",
    "TeamMemberAdded" = "teamMemberAdded",
    "TeamMemberRemoved" = "teamMemberRemoved",
    "BossBarCreated" = "bossBarCreated",
    "BossBarDeleted" = "bossBarDeleted",
    "BossBarUpdated" = "bossBarUpdated",
    "HeldItemChanged" = "heldItemChanged",
    "PhysicsTick" = "physicsTick",
    "Particle" = "particle",
}
export interface DiscordEventHandlerOption {
    client: Discord.Client;
    oggy: Oggy;
}
export interface MineflayerEventHandlerOption {
    bot: Mineflayer.Bot;
    oggy: Oggy;
}
interface EventConfig {
    name: DiscordEvents | MineflayerEvents | string;
    once: boolean;
    run: (client: Oggy, ...args: any[]) => Callback<void>
}
export class EventBuilder {
    name: DiscordEvents | MineflayerEvents | string;
    once: Boolean;
    run: (client: Oggy, ...args: any[]) => Callback<void>;
    constructor(config?: EventConfig) {
        this.name = config?.name || '';
        this.once = config?.once || false;
        this.run = config?.run || function () { };
    };
    setName(name: string): EventBuilder {
        this.name = name; return this;
    };
    setOnce(once: Boolean): EventBuilder {
        this.once = once; return this;
    };
    setRun(run: (client: Oggy, ...args: any[]) => Callback<void>) {
        this.run = run; return this;
    };
}


/*
 * Bot Config
 */

interface DiscordConfig {
    token: {
        client_1: string;
        client_2: string;
    };
    channel: {
        command_log: string;
        error_log: string;
    };
    commands: {
        exclude: Array<string>;
    };
    owner: {
        id: string;
    };
}

interface MinecraftConfig {
    account: {
        username: string;
        password: string;
    };
    ingame: {
        pin: string;
        pass: string;
    }
    server: {
        ip: string;
        version: string;
        port: number;
        reconnectTimeout: number;
        chatTimeout: number;
        loginType: 'cratingTable' | 'chatInput' | 'auth';
        prefix: string;
    }
}

interface StatusConfig {
    type: 'discord' | 'minecraft';
    updateInterval: number;
    discord: {
        text: string[];
        status: Discord.PresenceStatusData;
    };
    minecraft: {
        connect: Discord.PresenceStatusData;
        disconnect: Discord.PresenceStatusData;
    };
}

interface DatabaseConfig {
    link: string;
}

interface ExpressConfig {
    port: number
}

interface DefaultPath {
    discord: fs.PathLike,
    mineflayer: fs.PathLike
}
interface DevoloperConfig {
    timezone: string,
    handlerPath: {
        events: DefaultPath
        commands: DefaultPath
    },
    plugins: string[],
    customScript: fs.PathLike
}

export class ENV {
    readonly discord: DiscordConfig
    readonly minecraft: MinecraftConfig
    readonly status: StatusConfig
    readonly database: DatabaseConfig
    readonly express: ExpressConfig
    readonly developer: DevoloperConfig
    constructor(env: any) {
        this.discord = {
            token: {
                client_1: env.DISCORD_TOKEN_1 ?? '',
                client_2: env.DISCORD_TOKEN_2 ?? '',
            },
            channel: {
                command_log: env.DISCORD_CHANNEL_COMMANDLOG ?? '',
                error_log: env.DISCORD_CHANNEL_ERRORLOG ?? ''
            },
            commands: {
                exclude: (env.DISCORD_COMMANDS_EXCLUDE?.startsWith('[') && env.DISCORD_COMMANDS_EXCLUDE?.endsWith(']')
                    ? env.DISCORD_COMMANDS_EXCLUDE?.slice(1, -1).split(',')
                    : env.DISCORD_COMMANDS_EXCLUDE?.split(',')) ?? [],
            },
            owner: {
                id: env.DISCORD_OWNER_ID ?? ''
            }
        }
        this.minecraft = {
            account: {
                username: env.MINECRAFT_ACCOUNT_USERNAME ?? 'player',
                password: env.MINECRAFT_ACCOUNT_PASSWORD ?? '',
            },
            ingame: {
                pin: env.MINECRAFT_IG_PIN ?? '1 1 1 1',
                // PinRetry: Number(env.MINECRAFT_IG_PINRETRY ?? 3),
                pass: env.MINECRAFT_IG_PASS ?? 'igpass'
            },
            server: {
                ip: env.MINECRAFT_SERVER_IP ?? 'hypixel',
                version: env.MINECRAFT_SERVER_VERSION ?? '1.16.5',
                port: Number(env.MINECRAFT_SERVER_PORT) ?? 25565,
                reconnectTimeout: !!env.MINECRAFT_SERVER_RECONNECTTIMEOUT ? (isNaN(env.MINECRAFT_SERVER_RECONNECTTIMEOUT)
                    ? ms(<string>env.MINECRAFT_SERVER_RECONNECTTIMEOUT)
                    : Number(env.MINECRAFT_SERVER_RECONNECTTIMEOUT)) : 5 * 60 * 1000,
                loginType: env.MINECRAFT_SERVER_LOGINTYPE ?? 'chatInput',
                chatTimeout: env.MINECRAFT_SERVER_CHATTIMEOUT ? (isNaN(env.MINECRAFT_SERVER_CHATTIMEOUT)
                    ? ms(<string>env.MINECRAFT_SERVER_CHATTIMEOUT)
                    : Number(env.MINECRAFT_SERVER_CHATTIMEOUT)) : 30 * 1000,
                prefix: env.MINECRAFT_SERVER_PREFIX ?? 'og.'
            }
        }
        this.status = {
            type: env.STATUS_TYPE ?? 'discord',
            updateInterval: !!env.STATUS_UPDATEINTERVAL ? (isNaN(env.STATUS_UPDATEINTERVAL)
                ? ms(<string>env.STATUS_UPDATEINTERVAL)
                : Number(env.STATUS_UPDATEINTERVAL)) : 60 * 1000,
            discord: {
                text: (env.STATUS_DISCORD_TEXT?.startsWith('[') && env?.STATUS_DISCORD_TEXT.endsWith(']')
                    ? env.STATUS_DISCORD_TEXT?.slice(1, -1).split(',')
                    : env.STATUS_DISCORD_TEXT?.split(',')) ?? [`OggyTheCode ${_package.version}`, `Created by: ${_package.author}`],
                status: env.STATUS_DISCORD_TYPE ?? Discord.PresenceUpdateStatus.Online
            },
            minecraft: {
                disconnect: env.STATUS_MINECRAFT_DISCONNECT ?? Discord.PresenceUpdateStatus.DoNotDisturb,
                connect: env.STATUS_MINECRAFT_CONNECT ?? Discord.PresenceUpdateStatus.DoNotDisturb
            }
        }
        this.database = {
            link: env.DATABASE_LINK
        }
        this.express = {
            port: env.EXPRESS_PORT ?? 8000
        }
        this.developer = {
            handlerPath: {
                commands: {
                    discord: env.DEVELOPER_HANDLERPATH_COMMANDS_DISCORD ?? 'src/commands/discord',
                    mineflayer: env.DEVELOPER_HANDLERPATH_COMMANDS_MINEFLAYER ?? 'src/commands/mineflayer'
                },
                events: {
                    discord: env.DEVELOPER_HANDLERPATH_EVENTS_DISCORD ?? 'src/events/discord',
                    mineflayer: env.DEVELOPER_HANDLERPATH_EVENTS_MINEFLAYER ?? 'src/events/mineflayer'
                }
            },
            plugins: (env.DEVELOPER_PLUGINS?.startsWith('[') && env?.DEVELOPER_PLUGINS.endsWith(']')
                ? <string[]>JSON.parse(env.DEVELOPER_PLUGINS)
                : env.DEVELOPER_PLUGINS?.split(',')) ?? [],
            customScript: env.DEVELOPER_CUSTOMSCRIPT ?? '',
            timezone: env.DEVELOPER_TIMEZONE ?? process.env.TZ,
        }
    }
}

export class YAML {
    readonly discord: DiscordConfig
    readonly minecraft: MinecraftConfig
    readonly status: StatusConfig
    readonly database: DatabaseConfig
    readonly express: ExpressConfig
    readonly developer: DevoloperConfig
    constructor(yaml: any) {
        this.discord = {
            token: {
                client_1: yaml.discord.token_1 ?? '',
                client_2: yaml.discord.token_2 ?? '',
            },
            channel: {
                command_log: yaml.discord.channel.command_log ?? '',
                error_log: yaml.discord.channel.error_log ?? ''
            },
            commands: {
                exclude: yaml.discord.commands.exclude ?? [],
            },
            owner: {
                id: yaml.discord.owner.id ?? ''
            }
        }
        this.minecraft = {
            account: {
                username: yaml.minecraft.account.username ?? 'player',
                password: yaml.minecraft.account.password ?? '',
            },
            ingame: {
                pin: yaml.minecraft.ingame.pin ?? '1 1 1 1',
                // PinRetry: Number(yaml.minecraft.ingame.pinretry ?? 3),
                pass: yaml.minecraft.ingame.pass ?? 'igpass'
            },
            server: {
                ip: yaml.minecraft.server.ip ?? 'hypixel.com',
                version: yaml.minecraft.server.version ?? '1.16.5',
                port: yaml.minecraft.server.port ?? '25565',
                reconnectTimeout: !!yaml.minecraft.server.reconnectTimeout ? (isNaN(yaml.minecraft.server.reconnectTimeout)
                    ? ms(<string>yaml.minecraft.server.reconnectTimeout)
                    : Number(yaml.minecraft.server.reconnectTimeout)) : 5 * 60 * 1000,
                loginType: yaml.minecraft.server.loginType ?? 'chatInput',
                chatTimeout: !!yaml.minecraft.server.chatTimeout ? (isNaN(yaml.minecraft.server.chatTimeout)
                    ? ms(<string>yaml.minecraft.server.chatTimeout)
                    : Number(yaml.minecraft.server.chatTimeout)) : 5 * 60 * 1000,
                prefix: yaml.minecraft.server.prefix ?? 'og.'
            }
        }
        this.status = {
            type: yaml.status.type ?? 'discord',
            updateInterval: !!yaml.status.updateInterval ? (isNaN(yaml.status.updateInterval)
                ? ms(<string>yaml.status.updateInterval)
                : Number(yaml.status.updateInterval)) : 5 * 60 * 1000,
            discord: {
                text: yaml.status.discord.text ?? [`OggyTheCode ${_package.version}`],
                status: yaml.status.discord.status ?? Discord.PresenceUpdateStatus.Online
            },
            minecraft: {
                disconnect: yaml.status.minecraft.disconnect ?? Discord.PresenceUpdateStatus.DoNotDisturb,
                connect: yaml.status.minecraft.connect ?? Discord.PresenceUpdateStatus.DoNotDisturb
            }
        }
        this.database = {
            link: yaml.database.link ?? ''
        }
        this.express = {
            port: yaml.express.port ?? 8000
        }
        this.developer = {
            handlerPath: {
                commands: {
                    discord: yaml.developer.handlerPath.commands.discord ?? 'src/commands/discord',
                    mineflayer: yaml.developer.handlerPath.commands.mineflayer ?? 'src/commands/mineflayer'
                },
                events: {
                    discord: yaml.developer.handlerPath.events.discord ?? 'src/events/discord',
                    mineflayer: yaml.developer.handlerPath.events.mineflayer ?? 'src/events/mineflayer'
                }
            },
            plugins: (yaml.developer.plugins?.startsWith('[') && yaml?.developer.plugins.endsWith(']')
                ? <string[]>JSON.parse(yaml.developer.plugins)
                : yaml.developer.plugins?.split(',')) ?? [],
            customScript: yaml.developer.customScript ?? '',
            timezone: yaml.developer.timezone ?? process.env.TZ,
        }
    }
}