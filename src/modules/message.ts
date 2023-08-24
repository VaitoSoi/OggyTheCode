import { Oggy } from "../lib/index";
import Discord from 'discord.js';
import option from '../database/option'
import _package from '../../package.json';

export class consoleEmbed extends Discord.EmbedBuilder {
    constructor() {
        super()
        this
            .setAuthor({
                name: `Oggy Console`,
                iconURL: `https://cdn.discordapp.com/attachments/936994104884224020/1104690145531273316/242105559_940905476497135_3471501375826351146_n.jpg`
            })
            .setFooter({
                text: `OggyTheCode ${_package.version}`,
                iconURL: `https://github.com/${_package.github}.png`
            })
            .setTimestamp()
    }
}
export async function sendMessage(client: Oggy, message: Discord.EmbedBuilder | Array<Discord.EmbedBuilder> | string) {
    const sendOption: Discord.MessageCreateOptions = message instanceof Discord.EmbedBuilder || message instanceof Array ? { embeds: message instanceof Array ? message : [message] } : { content: message };
    const fetchGuild = (client: Discord.Client, id: string = '') => client.guilds.cache.get(id)
    const datas = await option.find()
    let sent: Array<string> = []
    datas.forEach(async function (data) {
        const guild = fetchGuild(client.client_1, data.guildid) || fetchGuild(client.client_2, data.guildid)
        if (!guild || sent.includes(guild.id)) return
        const channel = guild.channels.cache.get(data.config?.channels?.livechat || '')
        if (!channel || channel.type != Discord.ChannelType.GuildText || !channel.permissionsFor(await guild.members.fetchMe()).has(Discord.PermissionFlagsBits.SendMessages)) return
        const msg = channel.send(sendOption)
        sent.push((await msg).guildId)
    })
}