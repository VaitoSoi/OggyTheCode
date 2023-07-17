import { Oggy, SlashCommandBuilder, SlashCommandBuilderWithData, MineflayerCommandBuilder } from '../index'
import fs from 'node:fs'

export async function DiscordCommandHandler (client: Oggy): Promise<void> {
    const files = fs.readdirSync(`./${client.config.developer.handlerPath.commands.discord}`)
    const excludeCommand = client.config.discord.commands.exclude
    for (const i in files) {
        const commands: SlashCommandBuilder | SlashCommandBuilderWithData = (await import(`../../${client.config.developer.handlerPath.commands.discord}/${files[i]}`)).default
        if (!commands || excludeCommand.includes((<SlashCommandBuilder>commands).name || (<SlashCommandBuilderWithData>commands).data.name || '')) continue
        client.commands.discord.collections.set(commands instanceof SlashCommandBuilder ? commands.name : commands.data.name, commands)
        client.commands.discord.json.push(commands instanceof SlashCommandBuilder ? commands.toJSON() : commands.data.toJSON())
    }
}

export async function MineflayerCommandHandler (client: Oggy): Promise<void> {
    const files = fs.readdirSync(`./${client.config.developer.handlerPath.commands.mineflayer}`)
    for (const i in files) {
        const commands: MineflayerCommandBuilder = (await import(`../../${client.config.developer.handlerPath.commands.mineflayer}/${files[i]}`)).default
        if (!commands) continue
        client.commands.mineflayer.collections.set(commands.name, commands)
    }
}