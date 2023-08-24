import { Oggy } from '../lib'
import { readdirSync } from 'fs'
import { Collection } from 'discord.js'

export class Compiler {
    private oggy: Oggy;
    private file: string;
    private script: string[];
    private commands: Collection<string, CompilerCommandBuilder>

    constructor(oggy: Oggy, script: { file: string, content: string }) {
        this.oggy = oggy
        this.file = script.file
        this.script = script.content.split('\n').map(val => val.replace(/\t/g, ''))
    }

    async run(): Promise<void | Error> {
        if (this.commands.size == 0) return new Error(`command collection is empty!`)
        else {
            console.log(`[COMPILER] Running file ${this.file}.`)
            for (let i = 0, args = this.script[i].split(' '), command = this.commands.get(args[0]); i < this.script.length; i++)
                if (!command) console.error(`[COMPILER] Can't find command ${args[0]} at line ${i + 1}.`)
                else Promise.resolve(command.execute(commandFormat(command, args), { cmds: this.commands }))
        }
    }

    async load(): Promise<boolean> {
        const path = this.oggy.config.developer.handlerPath.compiler.commands
        const files = readdirSync(path, { withFileTypes: true })
        for (let i in files) {
            const command: CompilerCommandBuilder = (await import(`../../${path}/${files[i]}`)).default
            if (!command) { console.error(`compiler command file ${files[i]} is empty`); return false }
            else if (!command.name || !command.execute) { console.error(`compiler command ${files[i]} is missing name or run function`); return false }
            else this.commands.set(command.name, command)
        }
        return true
    }
}

function updateObject(obj: Object, val: any, path: string[]) {
    let pointer: any = obj;
    while (path.length > 1)
        if (pointer.hasOwnProperty(path.shift() || path[1])) pointer = pointer[path.shift() || path[1]]
        else throw new Error(`obj doesnt have ${path.shift()} parameter`)
    pointer[path.shift() || path[1]] = val
}

function commandFormat(command: CompilerCommandBuilder, args: string[]): CommandOption {
    const reg1 = /--(.+):(.+)/, reg2 = /(.+):(.+)/
    let commandOption: CommandOption = {
        name: command.name,
        options: {},
        subcommand: undefined
    },
        path = [],
        currentSubcommandBuilders: SubcommandBuilder[] | undefined = command.subcommands?.find(val => val.name === args[1]) ? command.subcommands : undefined,
        currentSubcommand: SubcommandBuilder | undefined,
        opts: number = 0
    const argsOption = args.slice(1)
    for (let i = 0; i < argsOption.length; i++) {
        if (currentSubcommandBuilders) {
            delete commandOption.options
            currentSubcommand = currentSubcommandBuilders.find(val => val.name === argsOption[i])
            if (currentSubcommand) {
                path.push('subcommand')
                void updateObject(commandOption, {
                    name: currentSubcommand.name,
                    option: {},
                    subcommand: undefined
                }, path)
                currentSubcommandBuilders = currentSubcommand?.subcommands
            } else currentSubcommandBuilders = undefined
        } else {
            if (commandOption.options !== undefined) {
                if (!command.options || !command.options[opts]) continue
                const option = command.options[opts]
                if (reg1.test(argsOption[opts]) || reg2.test(argsOption[opts])) {
                    const exec = (reg1.test(argsOption[opts]) ? reg1.exec(argsOption[opts]) : reg2.exec(argsOption[opts])) || []
                    const opt = exec[1], value = exec[2]
                    const option = command.options.find((val) => (val.name.startsWith('...') ? val.name.slice(3) : val.name) == opt)
                    if (!option) console.error(`[COMPILER] [Error] Can't find option name '${opt}'`)
                    else
                        if (option.name.startsWith('...')) {
                            commandOption.options[option.name.slice(3)] = [value, ...argsOption.slice(Number(i) + 1)].join(' ')
                            break
                        } else commandOption.options[option.name] = value
                } else if (option.name.startsWith('...')) {
                    commandOption.options[option.name.slice(3)] = argsOption.slice(Number(i)).join(' ')
                    break
                } else commandOption.options[option.name] = argsOption[i]
                if (
                    (option.optional == false && !commandOption.options[option.name]) ||
                    ((!option.type || option.type == 'string') && typeof commandOption.options[option.name] != 'string') ||
                    (option.type == 'number' && typeof Number(commandOption.options[option.name]) != 'number')
                ) console.log(`[COMPILER] [Error] Unknow option ${option.name} value, expect ${option.type || 'string'}, expect ${typeof commandOption.options[option.name]}`)
            } else {
                if (!currentSubcommand?.options) continue
                if (reg1.test(argsOption[opts]) || reg2.test(argsOption[opts])) {
                    const exec = (reg1.test(argsOption[opts]) ? reg1.exec(argsOption[opts]) : reg2.exec(argsOption[opts])) || []
                    const opt = exec[1], value = exec[2]
                    const option = currentSubcommand.options.find((val) => val.name == value)
                    if (!option) console.error(`[COMPILER] [Error] Can't find option ${opt}`)
                    else updateObject(commandOption, value, path)
                } else if (currentSubcommand.options[opts].name.startsWith('...')) {
                    updateObject(commandOption, argsOption.slice(Number(i)).join(' '), path)
                    break
                } else updateObject(commandOption, argsOption[i], path)
            }
            opts++
        }
    }
    return commandOption
}

type Awaitable<T> = T | PromiseLike<T>

type CommandExecute = (command: CommandOption, compilerConfig: CompilerConfig) => Awaitable<any>

interface SubcommandOption {
    name: string,
    subcommand?: SubcommandOption,
    option?: {
        [key: string]: string | number
    }
}

interface CommandOption {
    name: string,
    subcommand?: SubcommandOption,
    options?: {
        [key: string]: string
    }
}

interface CompilerConfig {
    cmds: Collection<string, CompilerCommandBuilder>
}

interface CommandOptions {
    name: string
    type?: 'string' | 'number'
    optional?: boolean
}

interface CommandBuilderOption {
    name: string;
    aliases?: string[];
    options?: CommandOptions[];
    subcommands?: SubcommandBuilder[];
    execute: CommandExecute;
}

export class CompilerCommandBuilder {
    public name: string;
    public aliases?: string[];
    public options?: CommandOptions[];
    public subcommands?: SubcommandBuilder[]
    public execute: CommandExecute

    constructor(option?: CommandBuilderOption) {
        this.name = option?.name ?? ''
        this.aliases = option?.aliases
        this.options = option?.options
        this.subcommands = option?.subcommands
        this.execute = option?.execute ?? function () {
        }
    }

    setName(name: string): CompilerCommandBuilder {
        this.name = name;
        return this
    }

    setAliases(aliases: string[]): CompilerCommandBuilder {
        this.aliases = aliases;
        return this
    }

    setOptions(...options: CommandOptions[]): CompilerCommandBuilder {
        this.options = options;
        return this
    }

    setSubcommands(...subcommands: SubcommandBuilder[]): CompilerCommandBuilder {
        this.subcommands = subcommands;
        return this
    }

    setExecute(execute: CommandExecute): CompilerCommandBuilder {
        this.execute = execute;
        return this
    }
}

interface SubcommandBuilderOption {
    name: string;
    description?: string;
    usage?: string;
    options?: CommandOptions[];
    subcommands?: SubcommandBuilder[]
}

export class SubcommandBuilder {
    public name: string;
    public description?: string;
    public usage?: string;
    public options?: CommandOptions[];
    public subcommands?: SubcommandBuilder[]

    constructor(option?: SubcommandBuilderOption) {
        this.name = option?.name ?? ''
        this.description = option?.description
        this.usage = option?.usage
        this.options = option?.options
        this.subcommands = option?.subcommands
    }

    setName(name: string): SubcommandBuilder {
        this.name = name;
        return this
    }

    setDescription(description: string): SubcommandBuilder {
        this.description = description;
        return this
    }

    setUsage(usage: string): SubcommandBuilder {
        this.usage = usage;
        return this
    }

    setOptions(...options: CommandOptions[]): SubcommandBuilder {
        this.options = options;
        return this
    }

    setSubcommands(...subcommands: SubcommandBuilder[]): SubcommandBuilder {
        this.subcommands = subcommands;
        return this
    }
}