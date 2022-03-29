const { MessageEmbed } = require('discord.js')
const { noMusicEmbed, checkSameRoom } = require('../../util/utils')
const ms = require('ms')

module.exports = {
    name: "volume",
    category: 'music',
    aliases: ["v", "set", "set-volume"],
    inVoiceChannel: true,
    run: async (client, message, args) => {
        if (checkSameRoom(message)) return;
        const queue = client.player.getQueue(message.guild.id)
        if (!queue || !queue.nowPlaying()) return noMusicEmbed(message);
        message.channel.send(`${queue.volume}`)
        const volume = parseInt(args[0])
        if (isNaN(volume)) return message.channel.send(`Vui lòng nhập số.`)
        if ((vol.value) < 0 || (vol.value) > 100) return message.channel.send({ content: "❌ | Volume ở trong mức 0-100" });
        const success = queue.setVolume(vol.value);
        return message.reply({
            content: success ? `✅ | Đã chỉnh volume thành **${vol.value}%**!` : "❌ | Thất bại!"
        }).then(msg => {
            setTimeout(() => {msg.delete()}, ms('5s'))
        })
    }
}