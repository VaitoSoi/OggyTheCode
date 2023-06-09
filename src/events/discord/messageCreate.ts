import { Events, Message } from "discord.js";
import { EventBuilder } from "../..";
import option from "../../database/option";

export default new EventBuilder()
    .setName(Events.MessageCreate)
    .setOnce(false)
    .setRun(async (oggy, message: Message) => {
        if (!message.inGuild()) return
        if (message.guild.members.cache.get(oggy.client_1.user?.id ?? '') && message.client.user.id == oggy.client_2.user?.id) return
        const data = await option.findOne({ guildid: message.guildId })
        if (!data) return
        const channel = message.guild.channels.cache.get(data.config?.channels?.livechat ?? '')
        if (!channel || message.channelId != channel.id) return
        if (message.author.bot) return
        if (Date.now() - oggy.data.lastMsg >= oggy.config.minecraft.server.chatTimeout) {
            oggy.bot?.chat(`<${message.author.tag}> ${message.content}`)
            message.react('✅')
            oggy.data.lastMsg = Date.now()
        } else message.react('❌')
    })