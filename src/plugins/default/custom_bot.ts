import * as Mineflayer from 'mineflayer';
import { sendMessage, consoleEmbed } from '../../modules/message'
import { ColorResolvable, Colors, EmbedBuilder } from 'discord.js'
import { Oggy } from '../../lib';

export default function (bot: Mineflayer.Bot | any, oggy: Oggy): void {
    bot.msg = {}
    bot.msg.sendMsg = (content: string | EmbedBuilder | EmbedBuilder[] = 'Nothing ._.') => sendMessage(oggy, content) 
    bot.msg.sendConsole = (title: string = 'Nothing ._.', color: ColorResolvable = Colors.Green) => 
        sendMessage(oggy, new consoleEmbed()
            .setTitle(title)
            .setColor(color))
}