import { SlashCommandBuilder } from "../../index";
import util from 'node:util'
import Discord from 'discord.js'
import option from '../../database/option'

export default new SlashCommandBuilder()
    .setName('eval')
    .setDescription('! ADMIN ONLY !')
    .addStringOption(opt => opt
        .setName('command')
        .setDescription('! ADMIN ONLY !')
        .setRequired(true)
    )
    .setRun(async (interaction, client) => {
        const command = interaction.options.getString('command', true)
        if (interaction.user.id == (interaction.client.application.owner?.id ?? client?.config.discord.owner.id ?? ''))
            try {
                const hiddenInfo: Array<string | any> = [
                    client?.config.discord.token.client_1,
                    client?.config.discord.token.client_2,
                    client?.config.database.link.replace(/\+/gi, '\\+').replace(/\?/gi, '\\?'),
                    client?.config.minecraft.account.password,
                    client?.config.minecraft.ingame.pass,
                    client?.config.minecraft.ingame.pin,
                ],
                    regex = new RegExp(`(${hiddenInfo.filter((val) => val !== undefined && val !== '').join('|')})`, 'gi')
                let evaled = eval(command), promise = evaled instanceof Promise || false
                if (promise) evaled = await evaled
                if (typeof evaled != 'string') evaled = util.inspect(evaled, { depth: null });
                evaled = (<string>evaled).replace(regex, '[SECRET]')
                interaction.editReply(
                    promise
                        ? '```js\n' +
                        `Promise<${evaled}>` +
                        '```'
                        : '```js\n' +
                        `${evaled}` +
                        '```')
                    .catch(console.error)
            } catch (error) {
                interaction.editReply(
                    '```\n' +
                    'Error:\n' +
                    `${error}\n` +
                    '```'
                )
            }
        else interaction.editReply('```Error: Who are you :)??```')
    })