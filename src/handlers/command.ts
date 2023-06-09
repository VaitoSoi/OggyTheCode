import { Oggy, SlashCommandBuilder, SlashCommandBuilderWithData } from '../index'
import fs from 'node:fs'

export default async function (client: Oggy): Promise<void> {
    const files = fs.readdirSync('./src/commands/discord/')
    const excludeCommand = client.config.discord.command.exclude
    for (const i in files) {
        const commands: SlashCommandBuilder | SlashCommandBuilderWithData = (await import(`../commands/discord/${files[i]}`)).default
        if (!commands || excludeCommand.includes((<SlashCommandBuilder>commands).name || (<SlashCommandBuilderWithData>commands).data.name || '')) continue
        if (commands instanceof SlashCommandBuilder) {
            client.commands.set(commands.name, commands)
            client.commandsJson.push(commands.toJSON())
        } else if (commands instanceof SlashCommandBuilderWithData) {
            client.commands.set(commands.data.name, commands)
            client.commandsJson.push(commands.data.toJSON())
        }
    }
}