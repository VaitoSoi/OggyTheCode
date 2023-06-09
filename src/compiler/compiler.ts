import { Oggy, CompilerCommandBuilder } from "..";
import { Collection } from "discord.js";
import fs from 'node:fs'

export class Compiler {
    oggy: Oggy
    commands: Collection<string, CompilerCommandBuilder>
    constructor(oggy: Oggy) {
        this.oggy = oggy
        this.commands = new Collection()
    }
    run(script: string[]) {
        for (let cmd in script) {
            const args = script[cmd].split(' ')
            const command = this.commands.get(args.shift() || '')
            if (!command) return console.error(`[CUSTOM SCRIPT] [ERROR] Can't find command "${args[0]}" at line ${cmd}`)
            Promise.resolve(command.run())
                .then(() => { })
                .catch((e: Error) => console.error(`[CUSTOM SCRIPT] [${command.name}] ${e.name}`))
        }
    }
    async commandHandler() {
        const files = fs.readdirSync('./src/compiler/commands')
            .filter(file => (file.endsWith('.ts') || file.endsWith('.js')) && fs.lstatSync(`./src/compiler/commands/${file}`).isFile())
        for (let i in files) {
            const commands: CompilerCommandBuilder = (await import(`./commands/${files[i]}`)).default
            if (!commands) continue
            this.commands.set(commands.name, commands)
        }
    }
}