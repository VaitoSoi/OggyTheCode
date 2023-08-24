import fs from 'node:fs';
import { EventBuilder, DiscordEventHandlerOption, MineflayerEventHandlerOption } from '../lib/index'

export async function DiscordEventsHandler(config: DiscordEventHandlerOption) {
    let listenedEvents: string[] = [];
    const files = fs.readdirSync('./src/events/discord/')
        .filter(file => (file.endsWith('.ts') || file.endsWith('.js')) && fs.lstatSync(`./src/events/discord/${file}`).isFile())
    for (let index in files) {
        const event: EventBuilder = (await import(`../events/discord/${files[index]}`)).default
        if (!event.name || !event.run) return console.error(`file ${files[index]} missing name or run function`);
        listenedEvents.push(event.name)
        switch (event.once) {
            case true:
                config.client?.once(event.name, (...args: any[]) => event.run(config.oggy, ...args)); break;
            default:
                config.client?.on(event.name, (...args: any[]) => event.run(config.oggy, ...args))
        }
    }
    console.log(`[DISCORD.JS] [${config.client.user?.tag}] Listened to ${listenedEvents.length} event(s)`)
}


export async function MineflayerEventsHandler(config: MineflayerEventHandlerOption) {
    let listenedEvents: string[] = [];
    const files = fs.readdirSync('./src/events/mineflayer/')
        .filter(file => (file.endsWith('.ts') || file.endsWith('.js')) && fs.lstatSync(`./src/events/mineflayer/${file}`).isFile())
    for (let index in files) {
        const event: EventBuilder = (await import(`../events/mineflayer/${files[index]}`)).default
        if (!event.name || !event.run) return console.error(`file ${files[index]} missing name or run function`);
        listenedEvents.push(event.name)
        switch (event.once) {
            case true:
                config.bot?.once(<any>event.name, (...args: any[]) => event.run(config.oggy, ...args)); break;
            default:
                config.bot?.on(<any>event.name, (...args: any[]) => event.run(config.oggy, ...args))
        }
    }
    console.log(`[MINEFLAYER] [${config.bot.username ?? 'Mineflayer'}] Listened to ${listenedEvents.length} event(s)`)
}